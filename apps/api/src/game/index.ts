import { FeatureFlags } from '@freshmen68/flags';
import { env } from 'cloudflare:workers';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { JWTPayload } from 'jose';
import type { WorkerCacheStorage } from '../type';
import { getPopByGroups, getRegionHandler, getRegionHandlers, groupNumbers } from './coordinator';
import type { LeaderboardEntry } from './sqlite-leaderboard';

/*
	POPCAT: 800pop/30sec
		our rate limiter is 4 req/60s (can change) -> So 400 pop/req
		assuming we update every 15 sec
		we technically can ALLOW ?pop=1600 if they send the request once per minute but im lazy

	800pop/30sec = ~26.66 click/s = ~ 400 bpm (at 1/4)

	i can do 195 bpm (1/4) max with 2 keys
	so 195 * 4 / 60 = ~13 cps

	BUT popcat allow ANY KEY and dont require pressing only 1 key at a time
	so 26cps seem low, well RIP mobile user
*/
const MAX_POP_PER_REQUEST = 300;

// TODO: better error message
const INVITE_MESSAGE =
	'สวัสดีแหกเกอ ได้โปรดอย่ายิงค่าเซิร์ฟเวอร์มันแพง 😭 | สนใจทำงาน IT สโมเข้ามาดิสนี้ได้นะครับ: https://discord.gg/JNYm5dUP9D';
const LEADERBOARD_CACHE_DURATION = 15; // sec
const GLOBAL_LEADERBOARD_CACHE_DURATION = 15; // sec

const cfCaches = caches as unknown as WorkerCacheStorage;

const elavatedOuids = env.ELEVATED_OUID_LIST?.split(",") ?? [];
const dev = env.WORKER_ENV === 'dev';
export const flags = new FeatureFlags({
	enabledAll: dev,
});

const router = new Hono<{
	Variables: {
		gameJWTPayload: JWTPayload;
		ouid: string,
		group: string;
	};
}>();

router.use('*', async (c, next) => {
	if (!flags.isEnabled("game-playing")) {
		return c.json({ error: 'Not available' }, 418);
	}

	const { group, ouid } = c.get("gameJWTPayload");
	if (!group || !ouid) {
		return c.json({
			message: "what"
		}, 500);
	}
	if (dev) {
		c.set("group", group as string);
	}
	c.set("ouid", ouid as string);
	await next();
});

router.get('/stats/global', async (c) => {
	// we do this to reduce amount of rpc call to Durable object
	const cached = await cfCaches.default.match(c.req.raw);
	if (cached) {
		// console.log(`Cache hit for ${c.req.url}`);
		return cached;
	}

	// we dont rate limit this because cf cache

	const pops = await getPopByGroups();
	const response = Response.json(pops, {
		headers: {
			'Cache-Control': `max-age=${GLOBAL_LEADERBOARD_CACHE_DURATION}`,
		},
	});
	console.log(c.executionCtx);
	c.executionCtx.waitUntil(cfCaches.default.put(new Request(c.req.raw.url, c.req.raw), response.clone()));
	return response;
});

/**
 * @example `GET /stats/groups/8`
 * @returns Top 10 user in current group as @type {LeaderboardEntry[]}
 */
router.get('/stats/groups/:group', async (c) => {
	const cached = await cfCaches.default.match(c.req.raw);
	if (cached) {
		return cached;
	}

	// we dont rate limit this because cf cache

	const gameRegion = getRegionHandler(c.get("group"));
	console.log(c.get("group"));
	const response = Response.json(await gameRegion.getTopTen(), {
		headers: {
			'Cache-Control': `max-age=${LEADERBOARD_CACHE_DURATION}`,
		},
	});
	c.executionCtx.waitUntil(cfCaches.default.put(new Request(c.req.raw.url, c.req.raw), response.clone()));
	return response;
});

// its pain to cache this unless we change the url to `/stats/self/:ouid`
// so dont call this too much
router.get('/stats/self', async (c) => {
	const ouid = c.get("ouid");
	const group = c.get("group");

	const { success } = await env.GAME_RATE_LIMITER.limit({ key: `stats:self:${ouid}` });
	if (!success) {
		throw new HTTPException(429, {
			message: INVITE_MESSAGE,
		});
	}

	if (!ouid || !group) {
		throw new HTTPException(400, { message: 'Invalid parameters' });
	}

	const gameRegion = getRegionHandler(group);
	// This is just a number
	return c.json(await gameRegion.getPlayerScore(ouid));
});

/**
 * @example `POST /pop?pop=80` = add 80 pop for current authenticated user
 */
router.post('/pop', async (c) => {
	const query = c.req.query();
	const ouid = c.get("ouid");
	const group = c.get("group");

	const { success } = await env.GAME_RATE_LIMITER.limit({ key: `pop:${ouid}` });
	if (!success && !dev) {
		throw new HTTPException(429, {
			message: INVITE_MESSAGE,
		});
	}

	const pop = parseInt(query.pop);
	if (!pop || pop > MAX_POP_PER_REQUEST) {
		throw new HTTPException(400, {
			message: 'nah',
		});
	}

	const gameRegion = getRegionHandler(group);
	c.executionCtx.waitUntil(gameRegion.addPop(pop, ouid, group));
	return c.text('queued');
});

/**
 * @example `POST /username` plaese submit the name in request body as a string
 */
router.post('/username', async (c) => {
	const group = c.get("group");
	const ouid = c.get("ouid");

	const { success } = await env.GAME_RATE_LIMITER.limit({ key: `rename:${ouid}` });
	if (!success && !dev) {
		throw new HTTPException(429, {
			message: "เปลี่ยนชื่อได้ไม่เกินนาทีละ 4 ครั้ง",
		});
	}

	try {
		let name = await c.req.text();
		// TODO: profanity filter
		if (name.length === 0) {
			throw new HTTPException(429, {
				message: "ชื่อต้องมีความยาวอย่างน้อย 1 ตัวอักษร",
			});
		}

		if (name.length > 160) {
			throw new HTTPException(429, {
				message: "ชื่อต้องมีความยาวน้อยกว่า 160 ตัวอักษร",
			});
		}

		name = name.replace(/[\n\r\t]/g, " ").normalize("NFC").trim();

		const gameRegion = getRegionHandler(group);
		c.executionCtx.waitUntil(gameRegion.setPlayerName(ouid, name));

		return c.text('ok');
	} catch {
		return c.text('failed', 400);
	}
});

router.get("/dump/pop", async c => {
	const ouid = c.get("ouid");
	if (!elavatedOuids.includes(ouid) && !dev) {
		throw new HTTPException(404);
	}

	const groups = c.req.queries("groups") ?? groupNumbers;
	console.log(groups);

	return c.json(
		await Promise.all(
			getRegionHandlers(groups)
				.map(async it => ({
					group: it.groupNumber,
					pops: await it.handler.dumpAllPop(),
				}))
		)
	);
});

export { router as gameRouter };

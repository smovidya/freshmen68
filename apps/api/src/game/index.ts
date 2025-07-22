import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { WorkerCacheStorage } from "../type";
import { getPopByGroups, getRegionHandler } from "./coordinator";
import type { LeaderboardEntry } from "./sqlite-leaderboard";

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
const INVITE_MESSAGE = "สวัสดีแหกเกอ สนใจทำงาน IT สโมมั้ย -> https://discord.gg/JNYm5dUP9D";
const LEADERBOARD_CACHE_DURATION = 15; // sec
const GLOBAL_LEADERBOARD_CACHE_DURATION = 15; // sec

const cfCaches = caches as unknown as WorkerCacheStorage;

const router = new Hono();

// TODO: authenticate user

router.get("/stats/global", async (c) => {
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
			"Cache-Control": `max-age=${GLOBAL_LEADERBOARD_CACHE_DURATION}`
		}
	});
	c.executionCtx.waitUntil(cfCaches.default.put(new Request(c.req.raw.url, c.req.raw), response.clone()));
	return response;
});

/**
 * @example `GET /stats/groups/8`
 * @returns Top 10 user in current group as @type {LeaderboardEntry[]}
 */
router.get("/stats/groups/:groupNumber", async (c) => {
	const cached = await cfCaches.default.match(c.req.raw);
	if (cached) {
		return cached;
	}

	// we dont rate limit this because cf cache

	const group = parseInt(c.req.param().groupNumber);
	if (!group) { // we dont have group 0 anyway
		throw new HTTPException(404);
	}

	const gameRegion = getRegionHandler(group);
	const response = Response.json(await gameRegion.getTopTen(), {
		headers: {
			"Cache-Control": `max-age=${LEADERBOARD_CACHE_DURATION}`
		}
	});
	c.executionCtx.waitUntil(cfCaches.default.put(new Request(c.req.raw.url, c.req.raw), response.clone()));
	return response;
});


// its pain to cache this unless we change the url to `/stats/self/:ouid`
// so dont call this too much
router.get("/stats/self", async (c) => {
	// TODO: auth
	const query = c.req.query();
	const ouid = query.ouid;
	const group = parseInt(query.group);

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
router.post("/pop", async (c) => {
	const query = c.req.query();
	const ouid = query.ouid; // TODO: GET THIS
	const group = parseInt(query.group);

	const { success } = await env.GAME_RATE_LIMITER.limit({ key: `pop:${ouid}` });
	if (!success) {
		throw new HTTPException(429, {
			message: INVITE_MESSAGE,
		});
	}

	const pop = parseInt(query.pop);
	if (pop || pop > MAX_POP_PER_REQUEST) {
		throw new HTTPException(400, {
			message: "nah",
		});
	}

	const gameRegion = getRegionHandler(group);
	c.executionCtx.waitUntil(gameRegion.addPop(pop, ouid, group));
	return c.text("queued");
});

export { router as gameRouter };

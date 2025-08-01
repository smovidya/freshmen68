import { auth, createAuth } from '@freshmen68/auth';
import { createDatabaseConnection } from '@freshmen68/db';
import { FeatureFlags } from '@freshmen68/flags';
import { appRouter } from '@freshmen68/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { env, WorkerEntrypoint } from 'cloudflare:workers';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import * as jose from 'jose';
import { gameRouter } from './game';
import { getPopByGroups } from './game/coordinator';

const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
		gameJWTPayload: jose.JWTPayload | null;
	};
}>();

app.use(
	'*', // or replace with "*" to enable cors for all routes
	cors({
		origin: [env.FRONTEND_URL || 'http://localhost:5173', env.PUBLIC_BETTER_AUTH_URL || 'http://localhost:8787'],
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true,
	}),
);

app.get('/game', (c) => {
	return c.redirect(`${env.FRONTEND_URL || 'http://localhost:5173'}${c.req.path}`, 302);
});

app.route("/game", gameRouter);

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
	const auth = createAuth({
		env,
	});
	return auth.handler(c.req.raw);
});

app.use('*', async (c, next) => {
	// if (env.WORKER_ENV === "dev") {
	// 	return next();
	// }
	const auth = createAuth({
		env,
	});

	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set('user', null);
		c.set('session', null);
		return next();
	}

	c.set('user', session.user);
	c.set('session', session.session);
	return next();
});

app.on(['POST', 'GET'], '/trpc/*', (c) => {
	return fetchRequestHandler({
		endpoint: '/trpc',
		req: c.req.raw,
		router: appRouter,
		createContext: () => ({
			user: c.get('user'),
			session: c.get('session'),
			db: createDatabaseConnection(env.DATABASE_URL),
			flags: new FeatureFlags({
				enabledAll: env.WORKER_ENV !== 'production'
			}),
		}),
	});
});


app.get("__hono/__version", c => {
	return c.json({
		version: 0x9065
	});
});


// app.get("/game-stats", async c => {
// 	const cfCaches = caches as unknown as WorkerCacheStorage;
// 	const cached = await cfCaches.default.match(c.req.raw);
// 	if (cached) {
// 		// console.log(`Cache hit for ${c.req.url}`);
// 		return cached;
// 	}

// 	// we dont rate limit this because cf cache

// 	const pops = await dumpStats();
// 	const response = Response.json(pops, {
// 		headers: {
// 			'Cache-Control': `max-age=${15}`,
// 		},
// 	});

// 	c.executionCtx.waitUntil(cfCaches.default.put(new Request(c.req.raw.url, c.req.raw), response.clone()));
// 	return response;
// });

// redirect all other requests to the frontend URL
app.all('*', (c) => {
	return c.redirect(`${env.FRONTEND_URL || 'http://localhost:5173'}${c.req.path}`, 302);
});

export default class TRPCCloudflareWorkerExample extends WorkerEntrypoint {
	async fetch(request: Request): Promise<Response> {
		return app.fetch(request, {}, this.ctx);
	}

	async scheduled(event: ScheduledEvent): Promise<void> {
		// await env.SyncGoogleSheetWithDatabase.create()

		// can we fetch itself, to use cf cache
		const pops = await getPopByGroups();
		await env.GAME_STATS_DB
			.prepare("INSERT INTO stats (timestamp, stats) VALUES (?, ?)")
			.bind(Date.now(), JSON.stringify(pops))
			.run();
	}
}

// export all workflows
export { GameRegionHandler } from "./game/region-handler";
export * from './workflows';


import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { env, WorkerEntrypoint } from 'cloudflare:workers';
import { appRouter } from '@freshmen68/trpc';
import { createAuth, auth } from '@freshmen68/auth';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createDatabaseConnection } from '@freshmen68/db';
import { FeatureFlags } from '@freshmen68/flags';
import * as jose from 'jose'

const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
}>();

const jwksUrl = `${env.PUBLIC_BETTER_AUTH_URL || 'http://localhost:8787'}/api/auth/jwks`
const JWKS = jose.createRemoteJWKSet(new URL(jwksUrl))

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

app.on(['POST', 'GET'], '/game/*', async (c) => {
	const token = c.req.header('Authorization')?.replace('Bearer ', '');
	if (!token) {
		return c.json({ error: 'Unauthorized' }, 401);
	}
	const { payload } = await jose.jwtVerify(token, JWKS, {
		issuer: env.PUBLIC_BETTER_AUTH_URL || 'http://localhost:8787',
		audience: env.PUBLIC_BETTER_AUTH_URL || 'http://localhost:8787',
	});

	// Game handler here

	return c.json({
		ok: true,
		payload
	})
});

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
				enabledAll: env.WORKER_ENV === 'development' || env.WORKER_ENV === 'dev',
			}),
		}),
	});
});


app.get("__hono/__version", c => {
	return c.json({
		version: 0x594F
	});
});

// redirect all other requests to the frontend URL
app.all('*', (c) => {
	return c.redirect(`${env.FRONTEND_URL || 'http://localhost:5173'}${c.req.path}`, 302);
});

export default class TRPCCloudflareWorkerExample extends WorkerEntrypoint {
	async fetch(request: Request): Promise<Response> {
		return app.fetch(request);

	}

	// async scheduled(event: ScheduledEvent): Promise<void> {
	// 	await env.SyncGoogleSheetWithDatabase.create()
	// }
}

// export all workflows
export * from './workflows'
export { GameRegionHandler } from "./game/region-handler"

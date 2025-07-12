import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { env, WorkerEntrypoint } from 'cloudflare:workers';
import { appRouter } from '@freshmen68/trpc';
import { auth } from "@freshmen68/auth"
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
	"/api/auth/*", // or replace with "*" to enable cors for all routes
	cors({
		origin: [
			env.FRONTEND_URL || 'http://localhost:5173',
			env.PUBLIC_BETTER_AUTH_URL || 'http://localhost:8787',
			'*.smovidya-chula.workers.dev'
		],
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

app.on(["POST", "GET"], "/trpc/*", (c) => {
	return fetchRequestHandler({
		endpoint: '/trpc',
		req: c.req.raw,
		router: appRouter,
		createContext: () => ({}),
	});
});

export default class TRPCCloudflareWorkerExample extends WorkerEntrypoint {
	async fetch(request: Request): Promise<Response> {
		return app.fetch(request);
	}
}

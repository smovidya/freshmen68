import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { genericOAuth } from 'better-auth/plugins';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { schema } from '@freshmen68/db';
import { env } from 'cloudflare:workers';

export const createAuth = ({
	env,
}: {
	env: any;
}) => {
	const client = postgres(env.DATABASE_URL);
	const db = drizzle(client, {
		schema: schema
	});

	return betterAuth({
		database: drizzleAdapter(db, {
			provider: 'pg'
		}),
		logger: {
			level: 'info',
		},
		appName: 'Science Freshmen Fest 68',
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.PUBLIC_BETTER_AUTH_URL || 'http://localhost:8787',
		databaseHooks: {
			user: {
				create: {
					async before(user, context) {
						if (!user.email.endsWith('23@student.chula.ac.th')) {
							return;
						}
						return {
							data: user
						};
					}
				}
			}
		},
		emailAndPassword: {
			enabled: true,
			signUp: {
				enabled: true,
				fields: ['email', 'password']
			},
			signIn: {
				enabled: true,
				fields: ['email', 'password']
			}
		},
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID as string,
				clientSecret: env.GOOGLE_CLIENT_SECRET as string
			}
		},
		plugins: [
			genericOAuth({
				config: [
					{
						providerId: 'smovidya',
						clientId: 'vidya-ci-0000',
						clientSecret: 'vidya-cs-0000',
						discoveryUrl:
							'https://auth.smovidya-chula.workers.dev/api/auth/.well-known/openid-configuration'
					}
				]
			})
		],
		trustedOrigins(request) {
			return [
				env.FRONTEND_URL || 'http://localhost:5173',
				env.PUBLIC_BETTER_AUTH_URL || 'http://localhost:8787',
				'*.smovidya-chula.workers.dev'
			];
		},
	});
}

export const auth = createAuth({
	env
})
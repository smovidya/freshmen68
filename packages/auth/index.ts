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
						// TODO: remove .mock suffix in production
						if (user.email.endsWith('@student.chula.ac.th.mock')) {
							const ouid = user.email.split('@')[0];
							// Science students only
							if (!ouid?.endsWith('23')) {
								return;
							}
							return {
								data: {
									...user,
									ouid: ouid,
								}
							};
						}

						// disallow non-student emails
						return;
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
		user: {
			additionalFields: {
				ouid: {
					type: 'string',
					label: 'OUID',
					unique: true,
					input: false,
				}
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
		advanced: {
			// crossSubDomainCookies: {
			// 	enabled: true,
			// 	domain: "vidyachula.org"
			// },
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				partitioned: true // New browser standards will mandate this for foreign cookies
			}
		}
	});
};

export const auth = createAuth({
	env
});

import { betterAuth } from 'better-auth';
import { APIError } from 'better-auth/api';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { schema } from '@freshmen68/db';
import { env } from 'cloudflare:workers';
import { jwt } from 'better-auth/plugins/jwt';

export const createAuth = ({
	env,
}: {
	env: any;
}) => {
	const client = postgres(env.DATABASE_URL);
	const db = drizzle(client, {
		schema: schema
	});

	const isDev = env.WORKER_ENV !== 'production';

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
						if (user.email.endsWith('@student.chula.ac.th')) {
							const ouid = user.email.split('@')[0];

							// Limited to science freshmen only
							if (!ouid?.endsWith('23')) {
								throw new APIError("FORBIDDEN", {
									code: 'science-students-only',
									message: 'การลงทะเบียนนี้สำหรับนิสิตคณะวิทยาศาสตร์เท่านั้น',
								})
							}

							// Limited to freshmen only
							if (!ouid?.startsWith('68')) {
								throw new APIError("FORBIDDEN", {
									code: 'freshmen-only',
									message: 'การลงทะเบียนนี้สำหรับนิสิตชั้นปีที่ 1 เท่านั้น หากคุณเป็นนิสิตชั้นปีที่ 1 โปรดติดต่อ https://www.instagram.com/smovidya_official/',
								});
							}

							return {
								data: {
									...user,
									ouid: ouid,
								}
							};
						}

						throw new APIError("FORBIDDEN", {
							code: 'invalid-email',
							message: 'ระบบนี้สามารถเข้าสู่ระบบได้เฉพาะนิสิตเท่านั้น (@student.chula.ac.th)',
						})
					}
				}
			}
		},
		emailAndPassword: {
			enabled: isDev,
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
			jwt()
		],
		onAPIError: {
			errorURL: `/aaaauth/error`, // wtf why dont this work 
			// errorURL: `${env.FRONTEND_URL}/auth/error`, // wtf why dont this work 
		},
		trustedOrigins(request) {
			return [
				env.FRONTEND_URL || 'http://localhost:5173',
				env.PUBLIC_BETTER_AUTH_URL || 'http://localhost:8787',
			];
		},
		advanced: {
			crossSubDomainCookies: {
				enabled: env.WORKER_ENV === 'production',
				domain: "freshmen68.vidyachula.org"
			},
			cookiePrefix: "freshmen68",
			// defaultCookieAttributes: {
			// 	sameSite: "none",
			// 	secure: true,
			// 	// partitioned: true // New browser standards will mandate this for foreign cookies
			// }
		}
	});
};

export const auth = createAuth({
	env
});

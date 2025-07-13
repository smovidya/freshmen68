import { createAuthClient } from 'better-auth/svelte';
import { genericOAuthClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { env } from '$env/dynamic/public';
import type { auth } from '@freshmen68/auth';

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_BETTER_AUTH_URL || 'http://localhost:8787',
	plugins: [genericOAuthClient(), inferAdditionalFields<typeof auth>()]
});


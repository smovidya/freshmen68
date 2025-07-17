import { env } from '$env/dynamic/public';
import type { AppRouter } from '@freshmen68/trpc';
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';
import { tokenRefreshLink } from "trpc-token-refresh-link"
import { authClient } from './auth/client';

interface Options {
  fetch?: typeof fetch;
}

export const trpcClient = ({ fetch = globalThis.fetch }: Options = {}) => createTRPCClient<AppRouter>({
  links: [
    tokenRefreshLink({
      tokenRefreshNeeded: () => {
        // used in game, disabled for now
        return false
      },
      fetchAccessToken: async () => {
        await authClient.getSession({
          fetchOptions: {
            onSuccess: (ctx) => {
              const jwt = ctx.response.headers.get("set-auth-jwt");
              if (jwt) {
                // use this for game :)
                localStorage.setItem("something-something-token", jwt);
              }
            }
          }
        })
      }
    }),
    loggerLink(),
    httpBatchLink({
      fetch: (url, options) => fetch(url, {
        ...options,
        credentials: "include"
      }),
      url: env.PUBLIC_TRPC_URL || 'http://localhost:8787/trpc',
    })
  ],
});

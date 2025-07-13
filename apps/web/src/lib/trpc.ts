import { env } from '$env/dynamic/public';
import type { AppRouter } from '@freshmen68/trpc';
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';

interface Options {
  fetch?: typeof fetch;
}

export const trpcClient = ({ fetch = globalThis.fetch }: Options = {}) => createTRPCClient<AppRouter>({
  links: [
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

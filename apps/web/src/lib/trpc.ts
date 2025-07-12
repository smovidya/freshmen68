import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '@freshmen68/trpc';
import { env } from '$env/dynamic/public';

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink(),
    httpBatchLink({
      url: env.PUBLIC_TRPC_URL || 'http://localhost:8787/trpc',
    })],
});

import type { LayoutLoad } from "./$types";
import { trpcClient } from "$lib/trpc";
import { isTRPCClientError } from '@trpc/client';

export const load: LayoutLoad = async ({ fetch }) => {
  try {
    const [whoami] = await Promise.allSettled([
      trpcClient({ fetch }).user.whoami.query(),
    ])
    return {
      whoami
    };
  } catch (error) {
    if (isTRPCClientError(error)) {
      console.error("TRPC Client Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return {
      whoami: null
    };
  }
};
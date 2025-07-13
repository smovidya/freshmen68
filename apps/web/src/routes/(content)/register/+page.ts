import { trpcClient } from "$lib/trpc";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const isRegistered = await trpcClient({ fetch }).user.isRegistered.query();
  const me = await trpcClient({ fetch }).user.whoami.query();

  console.log({
    me,
    isRegistered
  });
};
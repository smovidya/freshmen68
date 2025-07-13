import { flashParams } from "$lib/flash.svelte";
import { trpcClient } from "$lib/trpc";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const isRegistered = await trpcClient({ fetch }).user.isRegistered.query();

  console.log({
    isRegistered
  });

  if (isRegistered) {
    redirect(307, `/?${flashParams('already-registered')}`);
  }
};
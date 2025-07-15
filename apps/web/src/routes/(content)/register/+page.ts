import { flashParams } from "$lib/flash.svelte";
import { trpcClient } from "$lib/trpc";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { dev } from "$app/environment";

export const load: PageLoad = async ({ fetch, parent }) => {
  const { student } = await parent();
  if (!student) {
    redirect(307, `/?${flashParams("please-login")}`);
  }

  const isRegistered = await trpcClient({ fetch }).user.isRegistered.query();

  console.log({
    isRegistered
  });

  if (isRegistered && !dev) {
    redirect(307, `/menu?${flashParams('already-registered')}`);
  }
};
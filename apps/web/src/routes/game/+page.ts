import { flashParams } from "$lib/flash.svelte";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { flags } from '$lib/flags';

export const load: PageLoad = async ({ parent }) => {
  const { whoami } = await parent()
  if (!whoami) {
    return redirect(307, `/login?${flashParams("dont-rush")}`);
  }
  if (!flags.isEnabled("game-allow-non-freshmen")) {
    return redirect(307, `/login?${flashParams("dont-rush")}`);
  }
};
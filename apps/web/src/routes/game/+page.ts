import { flashParams } from "$lib/flash.svelte";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({  }) => {
  redirect(307, `/?${flashParams("dont-rush")}`);
};
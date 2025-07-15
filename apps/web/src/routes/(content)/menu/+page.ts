import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { flashParams } from "$lib/flash.svelte";

export const load: PageLoad = async ({ parent }) => {
  const { student } = await parent()
  if (!student) {
    redirect(307, `/?${flashParams("please-login")}`)
  }
};
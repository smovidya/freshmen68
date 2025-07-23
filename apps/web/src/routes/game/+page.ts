import { flashParams } from "$lib/flash.svelte";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { flags } from '$lib/flags';

export const load: PageLoad = async ({ parent }) => {
  const { whoami } = await parent()
  if (!whoami) {
    return redirect(307, `/menu?${flashParams("dont-rush")}`);
  }
  if (!flags.isEnabled("game-allow-non-freshmen")) {
    return redirect(307, `/menu?${flashParams("dont-rush")}`);
  }
  if (!flags.isEnabled("game-playing") && whoami.ouid.startsWith("68")) {
    return redirect(307, `/menu?${flashParams("dont-rush")}`);
  }
  console.log({
    whoami,
    flags: {
      "game-playing": flags.isEnabled("game-playing"),
      "game-allow-non-freshmen": flags.isEnabled("game-allow-non-freshmen"),
    },
  })
  if (flags.isEnabled("game-allow-non-freshmen") && whoami.ouid.startsWith("68")) {
    return redirect(307, `/menu?${flashParams("not-allowed")}`);
  }
  if (flags.isEnabled("game-playing") && !whoami.ouid.startsWith("68")) {
    return redirect(307, `/menu?${flashParams("not-allowed")}`);
  }
};
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { flashParams } from "$lib/flash.svelte";
import { trpcClient } from "$lib/trpc";

export const load: PageLoad = async ({ parent, fetch, depends }) => {
  const { whoami } = await parent();
  if (!whoami) {
    redirect(307, `/?${flashParams("please-login")}`);
  }

  depends("data:owned-team", "data:joined-team");
  const [isRegistered, ownedTeam, joinedTeam] = await Promise.all([
    trpcClient({ fetch }).user.isRegistered.query(),
    trpcClient({ fetch }).team.getOwnedTeam.query(),
    trpcClient({ fetch }).team.getJoinedTeam.query()
  ]);

  return {
    whoami,
    isRegistered,
    team: joinedTeam ?? ownedTeam
  };
};
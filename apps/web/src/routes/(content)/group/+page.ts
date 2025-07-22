import { flags } from '$lib/flags';
import { flashParams } from "$lib/flash.svelte";
import { groupData } from "$lib/groups";
import { trpcClient } from "$lib/trpc";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ depends, parent, fetch }) => {
  const { whoami } = await parent();
  if (!whoami) {
    redirect(307, `/?${flashParams("please-login")}`);
  }
  
  if (!flags.isEnabled('group-choosing')) {    
    redirect(307, `/menu?${flashParams("not-yet-start")}`);
  }

  depends("data:owned-team", "data:joined-team");

  const [ownedTeam, joinedTeam] = await Promise.all([
    trpcClient({ fetch }).team.getOwnedTeam.query(),
    trpcClient({ fetch }).team.getJoinedTeam.query()
  ]).catch((e) => {
    console.warn(e);
    // actually wtf
    redirect(307, `/menu?${flashParams("unknown-error")}`);
  });

  if (!ownedTeam) {
    redirect(307, `/menu?${flashParams("please-register")}`);
  }

  // console.log(joinedTeam);

  return {
    ownedTeam,
    joinedTeam,
    groupData,
  };
};

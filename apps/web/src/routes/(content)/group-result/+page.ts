import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { flashParams } from "$lib/flash.svelte";
import { flags } from "$lib/flags";
import { trpcClient } from "$lib/trpc";
import { groupData } from "$lib/groups";

export const load: PageLoad = async ({ parent }) => {
  const { whoami } = await parent();
  if (!whoami) {
    redirect(307, `/?${flashParams("please-login")}`);
  }

  if (!flags.isEnabled('group-announcement')) {
    redirect(307, `/menu?${flashParams("not-yet-start")}`);
  }

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

  const groupResult = 6; // TODO: query this from the db

  return {
    ownedTeam,
    joinedTeam,
    groupData,
    groupResult
  };
};
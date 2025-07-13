import { trpcClient } from "$lib/trpc";
import { error, redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { flashParams } from "$lib/flash.svelte";

export const load: PageLoad = async ({ depends, fetch }) => {
  depends("data:owned-team", "data:joined-team");
  const [ownedTeam, joinedTeam] = await Promise.all([
    trpcClient({ fetch }).team.getOwnedTeam.query(),
    trpcClient({ fetch }).team.getJoinedTeam.query()
  ]).catch((e) => {
    console.warn(e);
    // actually wtf
    redirect(307, `/?${flashParams("please-register")}`);
  });

  const groupDetail = [{}];

  if (!ownedTeam) {
    redirect(307, `/?${flashParams("please-register")}`);
  }

  return {
    ownedTeam,
    joinedTeam,
    groupDetail,
  };

};

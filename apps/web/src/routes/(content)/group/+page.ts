import { flashParams } from "$lib/flash.svelte";
import { trpcClient } from "$lib/trpc";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ depends, parent, fetch }) => {
  const { student } = await parent();
  if (!student) {
    redirect(307, `/?${flashParams("please-login")}`);
  }

  depends("data:owned-team", "data:joined-team");

  const [ownedTeam, joinedTeam] = await Promise.all([
    trpcClient({ fetch }).team.getOwnedTeam.query(),
    trpcClient({ fetch }).team.getJoinedTeam.query()
  ]).catch((e) => {
    console.warn(e);
    // actually wtf
    redirect(307, `/menu?${flashParams("please-register")}`);
  });

  const groupDetail = [{}];

  if (!ownedTeam) {
    redirect(307, `/menu?${flashParams("please-register")}`);
  }

  // console.log(joinedTeam);

  return {
    ownedTeam,
    joinedTeam,
    groupDetail,
  };
};

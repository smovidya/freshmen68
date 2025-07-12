import { trpcClient } from "$lib/trpc";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ depends }) => {
  depends("data:team-member", "data:team-group-pref");
  const ownedTeam = trpcClient.team.getOwnedTeam.query();
  const groupDetail = [{}];

  return {
    ownedTeam: await ownedTeam,
    groupDetail: await groupDetail
  };
};
import { trpcClient } from "$lib/trpc";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ depends, fetch }) => {
  depends("data:owned-team", "data:joined-team");
  try {
    const [ownedTeam, joinedTeam] = await Promise.all([
      trpcClient({ fetch }).team.getOwnedTeam.query(),
      trpcClient({ fetch }).team.getJoinedTeam.query()
    ]);
    const groupDetail = [{}];

    return {
      ownedTeam,
      joinedTeam,
      groupDetail,
    };
  } catch (e) {
    console.warn(e);
    error(401, "Please register first");
  }
};

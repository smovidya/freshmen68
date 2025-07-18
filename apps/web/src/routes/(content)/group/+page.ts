import { flashParams } from "$lib/flash.svelte";
import { trpcClient } from "$lib/trpc";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Group } from "$lib/type";

export const load: PageLoad = async ({ depends, parent, fetch }) => {
  const { whoami } = await parent();
  if (!whoami) {
    redirect(307, `/?${flashParams("please-login")}`);
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

  const groupData: Group[] = [
    {
      number: 1,
      name: '1'
    },
    {
      number: 3,
      name: '333'
    },
    {
      number: 4,
      name: '4444'
    },
    {
      number: 5,
      name: '55555'
    },
    {
      number: 6,
      name: '666666'
    },
    {
      number: 7,
      name: '7777777'
    }
  ];

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

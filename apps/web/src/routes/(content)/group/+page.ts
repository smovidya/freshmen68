import { flashParams } from "$lib/flash.svelte";
import { trpcClient } from "$lib/trpc";
import { redirect } from "@sveltejs/kit";
import { flags } from '$lib/flags';
import type { PageLoad } from "./$types";
import type { Group } from "$lib/type";

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

  const groupData: Group[] = [
    {
      number: 1,
      name: 'โมโนหวงเจิ้น'
    },
    {
      number: 3,
      name: 'SANXiARA'
    },
    {
      number: 4,
      name: 'PINK HU4'
    },
    {
      number: 5,
      name: 'Wulong 5'
    },
    {
      number: 6,
      name: 'หก ลก ซิ่ว'
    },
    {
      number: 7,
      name: 'เจ็ดโต่วอิน'
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

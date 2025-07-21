import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { flashParams } from "$lib/flash.svelte";
import { trpcClient } from "$lib/trpc";
import posthog from 'posthog-js';
import { dev } from '$app/environment';

export const load: PageLoad = async ({ parent, fetch, depends }) => {
  const { whoami } = await parent();
  if (!whoami) {
    redirect(307, `/?${flashParams("please-login")}`);
  }

  if (!dev) {
    posthog.identify(
      whoami.id,  // Replace 'distinct_id' with your user's unique identifier
      { email: whoami.email, name: whoami.name } // optional: set additional person properties
    );
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
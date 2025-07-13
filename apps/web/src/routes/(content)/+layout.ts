import type { LayoutLoad } from "./$types";
import { trpcClient } from "$lib/trpc";

export const load: LayoutLoad = async ({ fetch }) => {
  const [student] = await Promise.all([
    // trpcClient({ fetch }).user.whoami.query(),
    trpcClient({ fetch }).user.getStudentInfo.query()
  ]);

  return {
    student
  };
};
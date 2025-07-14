import type { LayoutLoad } from "./$types";
import { trpcClient } from "$lib/trpc";
import { isTRPCClientError } from '@trpc/client';

export const load: LayoutLoad = async () => {
  try {
    const [student] = await Promise.all([
      trpcClient().user.getStudentInfo.query()
    ]);
    return {
      student
    };
  } catch (error) {
    if (isTRPCClientError(error)) {
      console.error("TRPC Client Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return {
      student: null
    };
  }
};
import type { LayoutLoad } from "./$types";
import { trpcClient } from "$lib/trpc";
import { isTRPCClientError } from '@trpc/client';

export const load: LayoutLoad = async ({ depends, fetch }) => {
  // depends("data:auth");
  try {
    const [student] = await Promise.all([
      trpcClient({ fetch }).user.getStudentInfo.query()
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
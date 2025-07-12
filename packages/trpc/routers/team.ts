import z from "zod/v4";
import { router, signedInProcedure } from ".";
import { getOwnedTeam, joinTeam, regenerateTeamCode } from "../services/team.service";
import { db } from "@freshmen68/db";
import { TRPCError } from "@trpc/server";
import { getGroupPreference, updateGroupPreference } from "../services/group.service";
import { groupPreferenceSchema } from "@freshmen68/dto";

export const teamRouter = router({
  join: signedInProcedure
    .input(z.string().length(4))
    .mutation(async ({ ctx, input }) => {
      const result = await joinTeam(ctx.user.id, input, db);

      if (result === "team-full") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Team is already full"
        });
      }

      if (result === "team-not-founded") {
        throw new TRPCError({
          code: "NOT_FOUND"
        });
      }
    }),
  regenerateTeamCode: signedInProcedure
    .mutation(async ({ ctx }) => {
      await regenerateTeamCode(ctx.user.id, db);
    }),
  updateGroupPreference: signedInProcedure
    .input(groupPreferenceSchema)
    .mutation(async ({ ctx, input }) => {
      await updateGroupPreference(ctx.user.id, input, db);
    }),
  getOwnedTeam: signedInProcedure
    .query(async ({ ctx }) => {
      return await getOwnedTeam(ctx.user.id, db);
    }),
});

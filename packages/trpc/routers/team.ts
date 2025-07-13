import { groupPreferenceSchema } from "@freshmen68/dto";
import { TRPCError } from "@trpc/server";
import z from "zod/v4";
import { router, signedInProcedure } from "../core";
import { updateGroupPreference } from "../services/group.service";
import { getJoinedTeam, getOwnedTeam, joinTeam, kickOwnedTeamMemeber, leaveJoinedTeam, regenerateTeamCode } from "../services/team.service";

export const teamRouter = router({
  join: signedInProcedure
    .input(z.string().length(4))
    .mutation(async ({ ctx, input }) => {
      return await joinTeam(ctx.user.email, input, ctx.db);
    }),
  regenerateTeamCode: signedInProcedure
    .mutation(async ({ ctx }) => {
      await regenerateTeamCode(ctx.user.email, ctx.db);
    }),
  updateGroupPreference: signedInProcedure
    .input(groupPreferenceSchema)
    .mutation(async ({ ctx, input }) => {
      await updateGroupPreference(ctx.user.email, input, ctx.db);
    }),
  getOwnedTeam: signedInProcedure
    .query(async ({ ctx }) => {
      return await getOwnedTeam(ctx.user.email, ctx.db);
    }),
  getJoinedTeam: signedInProcedure
    .query(async ({ ctx }) => {
      return await getJoinedTeam(ctx.user.email, ctx.db);
    }),
  leaveJoinedTeam: signedInProcedure
    .mutation(async ({ ctx }) => {
      return await leaveJoinedTeam(ctx.user.email, ctx.db);
    }),
  kickOwnedTeamMemeber: signedInProcedure
    .input(z.email())
    .mutation(async ({ ctx, input }) => {
      return await kickOwnedTeamMemeber(ctx.user.email, input, ctx.db);
    })
});

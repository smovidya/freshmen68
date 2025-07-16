import { registrationSchema } from '@freshmen68/dto';
import { router, signedInProcedure } from '../core';
import { createStudentWithTeam, getStudentByEmail, isRegistered } from '../services/students.service';
import { TRPCError } from '@trpc/server';

export const userRouter = router({
  whoami: signedInProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  getStudentInfo: signedInProcedure
    .query(async ({ ctx }) => {
      return await getStudentByEmail(ctx.user.email, ctx.db)
    }),
  isRegistered: signedInProcedure
    .query(async ({ ctx }) => {
      return await isRegistered(ctx.user.email, ctx.db);
    }),
  register: signedInProcedure
    .input(registrationSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.flags.isEnabled("registering")) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Registration is not open at the moment',
        });
      }
      const email = ctx.user.email;
      await createStudentWithTeam(input, email, ctx.db);
    })
});

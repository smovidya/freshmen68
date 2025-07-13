import { registrationSchema } from '@freshmen68/dto';
import { router, signedInProcedure } from '../core';
import { createStudentWithTeam, isRegistered } from '../services/students.service';

export const userRouter = router({
  whoami: signedInProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  isRegistered: signedInProcedure
    .query(async ({ ctx }) => {
      return isRegistered(ctx.user.email, ctx.db);
    }),
  register: signedInProcedure
    .input(registrationSchema)
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user.email;
      await createStudentWithTeam(input, email, ctx.db);
    })
});

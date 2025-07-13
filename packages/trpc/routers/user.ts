import { registrationSchema } from '@freshmen68/dto';
import { router, signedInProcedure } from '../core';
import { createStudentWithTeam, getStudentByEmail, isRegistered } from '../services/students.service';

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
      const email = ctx.user.email;
      await createStudentWithTeam(input, email, ctx.db);
    })
});

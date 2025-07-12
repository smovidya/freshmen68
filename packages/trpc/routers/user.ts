import { registrationSchema } from '@freshmen68/dto';
import { router, signedInProcedure } from '.';
import { createStudentWithTeam } from '../services/students.service';
import { db } from '@freshmen68/db';

export const userRouter = router({
  whoami: signedInProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  register: signedInProcedure
    .input(registrationSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: some verification
      // const studentId = ctx.someId;
      const studentId = 6812345678;

      await createStudentWithTeam(input, db);
    })
});

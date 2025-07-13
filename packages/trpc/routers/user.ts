import { router, signedInProcedure } from '.';

export const userRouter = router({
  whoami: signedInProcedure.query(({ ctx }) => {
    return ctx.user;
  })
})
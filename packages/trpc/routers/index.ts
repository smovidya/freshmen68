import type { auth } from '@freshmen68/auth';
import { initTRPC, TRPCError, type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { z } from 'zod';

export type Context = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
}

const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;
export const signedInProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be signed in to perform this action.',
    });
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    }
  })
})

export const router = t.router;

export const appRouter = router({
  hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
    return `hello ${input ?? 'world'}`;
  }),
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;

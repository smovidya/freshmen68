import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { z } from 'zod';
import { publicProcedure, router } from '../core';
import { teamRouter } from './team';
import { userRouter } from './user';

export const appRouter = router({
  hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
    return `hello ${input ?? 'world'}`;
  }),
  team: teamRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;

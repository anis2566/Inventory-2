import { cache } from 'react';

import { initTRPC, TRPCError } from '@trpc/server';
import { getCurrentUser } from '@/lib/user.action';

export const createTRPCContext = cache(async () => {
    return { userId: 'user_123' };
});

const t = initTRPC.create({
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    const user = await getCurrentUser()

    if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return next({ ctx: { ...ctx, auth: user } })
})
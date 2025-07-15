import { createTRPCRouter } from '../init';
import { brandRouter } from './brand';
import { categoryRouter } from './category';
import { employeeRouter } from './employee';
import { productRouter } from './product';
import { shopRouter } from './shop';
import { userRouter } from './user';

export const appRouter = createTRPCRouter({
    category: categoryRouter,
    brand: brandRouter,
    product: productRouter,
    employee: employeeRouter,
    shop: shopRouter,
    user: userRouter
});

export type AppRouter = typeof appRouter;
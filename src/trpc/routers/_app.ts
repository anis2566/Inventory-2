import { createTRPCRouter } from '../init';
import { brandRouter } from './brand';
import { categoryRouter } from './category';
import { employeeRouter } from './employee';
import { incominggRouter } from './incoming';
import { orderRouter } from './order';
import { outgoingRouter } from './outgoing';
import { productRouter } from './product';
import { sellReportRouter } from './sale-report';
import { shopRouter } from './shop';
import { userRouter } from './user';
import { userDashboardRouter } from './user-dashboard';

export const appRouter = createTRPCRouter({
    category: categoryRouter,
    brand: brandRouter,
    product: productRouter,
    employee: employeeRouter,
    shop: shopRouter,
    user: userRouter,
    order: orderRouter,
    outgoing: outgoingRouter,
    incoming: incominggRouter,
    sellReport: sellReportRouter,
    userDashboard: userDashboardRouter
});

export type AppRouter = typeof appRouter;
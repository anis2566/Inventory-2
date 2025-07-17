import { db } from "@/lib/db";
import { createTRPCRouter, srProcedure } from "../init";
import { ORDER_STATUS } from "@/constant";

export const userDashboardRouter = createTRPCRouter({
    get: srProcedure.query(async ({ ctx }) => {
        const employee = ctx.employee

        const [recentOrders, dueAmount] = await Promise.all([
            await db.order.findMany({
                where: {
                    employeeId: employee.id
                },
                include: {
                    shop: {
                        select: {
                            name: true
                        }
                    },
                    _count: {
                        select: {
                            orderItems: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5
            }),
            await db.order.aggregate({
                where: {
                    employeeId: employee.id,
                    status: ORDER_STATUS.Due
                },
                _sum: {
                    dueAmount: true
                },
                _count: {
                    shopId: true
                }
            })
        ])

        return {
            recentOrders,
            dueAmount: dueAmount._sum.dueAmount ?? 0,
            dueShops: dueAmount._count.shopId ?? 0
        }
    })
})
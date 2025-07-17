import { db } from "@/lib/db";
import { createTRPCRouter, srProcedure } from "../init";
import { ORDER_STATUS } from "@/constant";

type WeeklyTrendUp = {
    date: string;
    outgoing: number;
    incoming: number;
    balance: number;
}

export const sellReportRouter = createTRPCRouter({
    daily: srProcedure
        .query(async ({ ctx }) => {
            const employee = ctx.employee

            const targetDate = new Date()

            const dayStart = new Date(Date.UTC(
                targetDate.getUTCFullYear(),
                targetDate.getUTCMonth(),
                targetDate.getUTCDate(),
                0, 0, 0
            ))

            const dayEnd = new Date(Date.UTC(
                targetDate.getUTCFullYear(),
                targetDate.getUTCMonth(),
                targetDate.getUTCDate(),
                23, 59, 59, 999
            ))

            const [totalOutgoing, totalIncoming] = await Promise.all([
                await db.outgoing.aggregate({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                        employeeId: employee.id,
                    },
                    _sum: {
                        total: true,
                        totalQuantity: true
                    }
                }),
                await db.incoming.aggregate({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                        employeeId: employee.id,
                    },
                    _sum: {
                        total: true,
                        totalQuantity: true
                    }
                })
            ])

            const totalOutgoingCount = {
                amount: totalOutgoing._sum.total ?? 0,
                quantity: totalOutgoing._sum.totalQuantity ?? 0
            }

            const totalIncomingCount = {
                amount: totalIncoming._sum.total ?? 0,
                quantity: totalIncoming._sum.totalQuantity ?? 0
            }

            const totalDueCount = {
                amount: totalOutgoingCount.amount - totalIncomingCount.amount,
                quantity: totalOutgoingCount.quantity - totalIncomingCount.quantity
            }

            return {
                totalOutgoingCount,
                totalIncomingCount,
                totalDueCount
            }
        }),
    overall: srProcedure.query(async ({ ctx }) => {
        const employee = ctx.employee;
        const now = new Date();

        const startOfTheWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay()));
        const endOfTheWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay() + 6, 23, 59, 59, 999));

        const lastWeekStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay() - 7));
        const lastWeekEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay(), 23, 59, 59, 999));

        const startOfTheMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        const endOfTheMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

        const lastMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
        const lastMonthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0, 23, 59, 59, 999));

        // DATABSE AGG
        const [thisWeekAgg, lastWeekAgg, thisMonthAgg, lastMonthAgg, totalOrders, totalOutgoing, totalIncoming] = await Promise.all([
            await db.order.aggregate({
                where: {
                    employeeId: employee.id,
                    createdAt: { gte: startOfTheWeek, lte: endOfTheWeek },
                    status: ORDER_STATUS.Delivered
                },
                _sum: { totalAmount: true },
                _count: true,
            }),
            await db.order.aggregate({
                where: {
                    employeeId: employee.id,
                    createdAt: { gte: lastWeekStart, lte: lastWeekEnd },
                    status: ORDER_STATUS.Delivered
                },
                _sum: { totalAmount: true },
                _count: true,
            }),
            await db.order.aggregate({
                where: {
                    employeeId: employee.id,
                    createdAt: { gte: startOfTheMonth, lte: endOfTheMonth },
                    status: ORDER_STATUS.Delivered
                },
                _sum: { totalAmount: true },
                _count: true,
            }),
            await db.order.aggregate({
                where: {
                    employeeId: employee.id,
                    createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
                    status: ORDER_STATUS.Delivered
                },
                _sum: { totalAmount: true },
                _count: true,
            }),
            await db.order.aggregate({
                where: {
                    employeeId: employee.id,
                    status: ORDER_STATUS.Delivered
                },
                _sum: { totalAmount: true },
                _count: true
            }),
            await db.outgoing.aggregate({
                where: {
                    employeeId: employee.id,

                },
                _sum: { total: true },
            }),
            await db.incoming.aggregate({
                where: {
                    employeeId: employee.id,
                },
                _sum: { total: true },
            }),
        ])

        // WEEKLY TRENDS
        const weeklyTrends: WeeklyTrendUp[] = [];
        for (let i = 6; i >= 0; i--) {
            const day = new Date();
            day.setUTCDate(now.getUTCDate() - i);
            const dayStart = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()));
            const dayEnd = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 23, 59, 59, 999));

            const [outgoing, incoming] = await Promise.all([
                db.outgoing.aggregate({
                    where: { createdAt: { gte: dayStart, lte: dayEnd }, employeeId: employee.id },
                    _sum: { total: true },
                }),
                db.incoming.aggregate({
                    where: { createdAt: { gte: dayStart, lte: dayEnd }, employeeId: employee.id },
                    _sum: { total: true },
                }),
            ]);

            weeklyTrends.push({
                date: dayStart.toISOString().split("T")[0],
                outgoing: outgoing._sum.total ?? 0,
                incoming: incoming._sum.total ?? 0,
                balance: (outgoing._sum.total ?? 0) - (incoming._sum.total ?? 0),
            });
        }

        // WEEKLY OVERVIEW
        const weekGrowthRate = lastWeekAgg._sum.totalAmount
            ? +(
                ((thisWeekAgg._sum.totalAmount ?? 0) - lastWeekAgg._sum.totalAmount) /
                lastWeekAgg._sum.totalAmount *
                100
            ).toFixed(1)
            : 0;

        const weeklyOverview = {
            totalSale: thisWeekAgg._sum.totalAmount ?? 0,
            growthRate: weekGrowthRate,
        };

        // MONTHLY OVERVIEW
        const monthGrowthRate = lastMonthAgg._sum.totalAmount
            ? +(
                ((thisMonthAgg._sum.totalAmount ?? 0) - lastMonthAgg._sum.totalAmount) /
                lastMonthAgg._sum.totalAmount *
                100
            ).toFixed(1)
            : 0;

        const monthlyOverview = {
            totalSale: thisMonthAgg._sum.totalAmount ?? 0,
            growthRate: monthGrowthRate,
        };

        // AVERAGE ORDER
        const averageOrderValue = totalOrders._sum.totalAmount ? (totalOrders._sum.totalAmount / totalOrders._count) : 0
        const avergeOrderOverview = {
            averageOrderValue,
            totalOrders: totalOrders._count ?? 0,
        }

        console.log(avergeOrderOverview)

        // NET BALANCE
        const netBalance = (totalIncoming._sum.total ?? 0) - (totalOutgoing._sum.total ?? 0)

        return {
            weeklyOverview,
            weeklyTrends,
            totalSale: totalOrders._sum.totalAmount ?? 0,
            netBalance,
            totalOrders: totalOrders._count ?? 0,
            avergeOrderOverview,
            monthlyOverview,
        };
    }),
})
import { db } from "@/lib/db";
import { createTRPCRouter, srProcedure } from "../init";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/constant";

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

            const [totalOrder, totalOrderItems, unPaidOrders, todayOrders, outgoings, incomings] = await Promise.all([
                await db.order.aggregate({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                        employeeId: employee.id,
                    },
                    _sum: {
                        totalAmount: true,
                    },
                    _count: {
                        _all: true,
                    }
                }),
                await db.orderItem.aggregate({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                        order: {
                            employeeId: employee.id,
                        }
                    },
                    _sum: {
                        quantity: true,
                    }
                }),
                await db.order.aggregate({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                        employeeId: employee.id,
                        paymentStatus: PAYMENT_STATUS.Unpaid
                    },
                    _sum: {
                        totalAmount: true,
                    },
                }),
                await db.order.findMany({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                        employeeId: employee.id,
                    },
                    include: {
                        shop: {
                            select: {
                                name: true,
                            }
                        },
                        _count: {
                            select: {
                                orderItems: true,
                            }
                        },
                    },
                    take: 5
                }),
                await db.outgoingItem.findMany({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                        outgoing: {
                            employeeId: employee.id,
                        }
                    },
                    include: {
                        product: {
                            select: {
                                name: true,
                                productCode: true,
                            }
                        },
                    },
                }),
                await db.ingoingItem.findMany({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                        incoming: {
                            employeeId: employee.id,
                        }
                    },
                    include: {
                        product: {
                            select: {
                                name: true,
                                productCode: true,
                            }
                        },
                    },
                }),
            ])

            const overview = {
                totalOrder: totalOrder._count._all ?? 0,
                totalQuantity: totalOrderItems._sum.quantity ?? 0,
                totalAmount: totalOrder._sum.totalAmount ?? 0,
                unPaidAmount: unPaidOrders._sum.totalAmount ?? 0,
            }

            const formattedOutgoings = outgoings.map(outgoing => ({
                product: outgoing.product.name,
                quantity: outgoing.quantity,
                productCode: outgoing.product.productCode,
            }));

            const outgoingOverview = {
                total: formattedOutgoings.reduce((sum, item) => sum + item.quantity, 0),
                items: formattedOutgoings,
            }

            const formattedIncomings = incomings.map(incoming => ({
                product: incoming.product.name,
                quantity: incoming.quantity,
                productCode: incoming.product.productCode,
            }));

            const incomingOverview = {
                total: formattedIncomings.reduce((sum, item) => sum + item.quantity, 0),
                items: formattedIncomings,
            }

            return {
                overview,
                orders: todayOrders,
                outgoings: outgoingOverview,
                incomings: incomingOverview
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
        const [thisWeekAgg, lastWeekAgg, thisMonthAgg, lastMonthAgg, totalOrders, dueOrders] = await Promise.all([
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
            await db.order.aggregate({
                where: {
                    employeeId: employee.id,
                    paymentStatus: PAYMENT_STATUS.Due,
                },
                _sum: {
                    totalAmount: true,
                }
            })
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

        return {
            weeklyOverview,
            weeklyTrends,
            totalSale: totalOrders._sum.totalAmount ?? 0,
            dueBalance: dueOrders._sum.totalAmount ?? 0,
            totalOrders: totalOrders._count ?? 0,
            avergeOrderOverview,
            monthlyOverview,
        };
    }),
})
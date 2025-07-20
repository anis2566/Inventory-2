import { db } from "@/lib/db";
import { adminProcedure, createTRPCRouter } from "../init";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/constant";

export const adminDashboardRouter = createTRPCRouter({
    get: adminProcedure
        .query(async ({ ctx }) => {

            const now = new Date();

            const dayStart = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                0, 0, 0
            ))

            const dayEnd = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                23, 59, 59, 999
            ))

            const startOfTheWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay()));
            const endOfTheWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay() + 6, 23, 59, 59, 999));

            const lastWeekStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay() - 7));
            const lastWeekEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay(), 23, 59, 59, 999));

            const startOfTheMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
            const endOfTheMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

            const lastMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
            const lastMonthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0, 23, 59, 59, 999));

            const [thisMonthTotalProducts, lastMonthTotalProducts, thisMonthDamageProducts, lastMonthDamageProducts, thisMonthOutOfStockProducts, lastMonthOutOfStockProducts, totalProductQuantity, todayTotalOrders, thisWeekTotalOrders, lastWeekTotalOrders, thisMonthTotalOrders, lastMonthTotalOrders, totalDueOrders, todayTotalIncome, todayTotalExpense, thisWeekTotalIncome, thisWeekTotalExpense, thisMonthTotalIncome, thisMonthTotalExpense, totalIncome, totalExpense, totalDeliveredOrders] = await Promise.all([
                await db.product.count({
                    where: {
                        createdAt: {
                            gte: startOfTheMonth,
                            lte: endOfTheMonth
                        }
                    }
                }),
                await db.product.count({
                    where: {
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd
                        }
                    }
                }),
                await db.product.count({
                    where: {
                        createdAt: {
                            gte: startOfTheMonth,
                            lte: endOfTheMonth
                        },
                        damageStock: {
                            gt: 0
                        }
                    }
                }),
                await db.product.count({
                    where: {
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd
                        },
                        damageStock: {
                            gt: 0
                        }

                    }
                }),
                await db.product.count({
                    where: {
                        createdAt: {
                            gte: startOfTheMonth,
                            lte: endOfTheMonth
                        },
                        stock: 0
                    }
                }),
                await db.product.count({
                    where: {
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd
                        },
                        stock: 0
                    }
                }),
                await db.product.aggregate({
                    _sum: {
                        stock: true
                    }
                }),
                await db.order.count({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd
                        }
                    }
                }),
                await db.order.count({
                    where: {
                        createdAt: {
                            gte: startOfTheWeek,
                            lte: endOfTheWeek
                        }
                    }
                }),
                await db.order.count({
                    where: {
                        createdAt: {
                            gte: lastWeekStart,
                            lte: lastWeekEnd
                        }
                    }
                }),
                await db.order.count({
                    where: {
                        createdAt: {
                            gte: startOfTheMonth,
                            lte: endOfTheMonth
                        }
                    }
                }),
                await db.order.count({
                    where: {
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd
                        }
                    }
                }),
                await db.order.count({
                    where: {
                        paymentStatus: PAYMENT_STATUS.Due
                    }
                }),
                await db.income.aggregate({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd
                        }
                    },
                    _sum: {
                        amount: true
                    }
                }),
                await db.expense.aggregate({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd
                        }
                    },
                    _sum: {
                        amount: true
                    }
                }),
                await db.income.aggregate({
                    where: {
                        createdAt: {
                            gte: startOfTheWeek,
                            lte: endOfTheWeek
                        }
                    },
                    _sum: {
                        amount: true
                    }
                }),
                await db.expense.aggregate({
                    where: {
                        createdAt: {
                            gte: startOfTheWeek,
                            lte: endOfTheWeek
                        }
                    },
                    _sum: {
                        amount: true
                    }
                }),
                await db.income.aggregate({
                    where: {
                        createdAt: {
                            gte: startOfTheMonth,
                            lte: endOfTheMonth
                        }
                    },
                    _sum: {
                        amount: true
                    }
                }),
                await db.expense.aggregate({
                    where: {
                        createdAt: {
                            gte: startOfTheMonth,
                            lte: endOfTheMonth
                        }
                    },
                    _sum: {
                        amount: true
                    }
                }),
                await db.income.aggregate({
                    _sum: {
                        amount: true
                    }
                }),
                await db.expense.aggregate({
                    _sum: {
                        amount: true
                    }
                }),
                await db.order.aggregate({
                    where: {
                        createdAt: {
                            gte: startOfTheMonth,
                            lte: endOfTheMonth
                        },
                        status: ORDER_STATUS.Delivered
                    },
                    _sum: {
                        totalAmount: true
                    }
                }),
            ])

            // PRODUCT OVERVIEW
            const productGrowthRate =
                lastMonthTotalProducts === 0
                    ? thisMonthTotalProducts > 0 ? 100 : 0
                    : ((thisMonthTotalProducts - lastMonthTotalProducts) / lastMonthTotalProducts) * 100;

            const productOverview = {
                totalProduct: thisMonthTotalProducts,
                growthRate: productGrowthRate,
                type: productGrowthRate >= 0 ? 'increase' : 'decrease',
                totalProductQuantity: totalProductQuantity._sum.stock ?? 0
            };

            // DAMAGE OVERVIEW
            const damageGrowthRate =
                lastMonthDamageProducts === 0
                    ? thisMonthDamageProducts > 0 ? 100 : 0
                    : ((thisMonthDamageProducts - lastMonthDamageProducts) / lastMonthDamageProducts) * 100;

            const damageOverview = {
                totalProduct: thisMonthDamageProducts,
                growthRate: damageGrowthRate,
                type: damageGrowthRate >= 0 ? 'increase' : 'decrease'
            };

            // OUT OF STOCK OVERVIEW
            const outOfStockGrowthRate =
                lastMonthOutOfStockProducts === 0
                    ? thisMonthOutOfStockProducts > 0 ? 100 : 0
                    : ((thisMonthOutOfStockProducts - lastMonthOutOfStockProducts) / lastMonthOutOfStockProducts) * 100;

            const outOfStockOverview = {
                totalProduct: thisMonthOutOfStockProducts,
                growthRate: outOfStockGrowthRate,
                type: outOfStockGrowthRate >= 0 ? 'increase' : 'decrease',
            };

            // THIS WEEK ORDER OVERVIEW
            const thisWeekOrderGrowthRate =
                lastWeekTotalOrders === 0
                    ? thisWeekTotalOrders > 0 ? 100 : 0
                    : ((thisWeekTotalOrders - lastWeekTotalOrders) / lastWeekTotalOrders) * 100;

            const thisWeekOrderOverview = {
                totalOrder: thisWeekTotalOrders,
                growthRate: thisWeekOrderGrowthRate,
                type: thisWeekOrderGrowthRate >= 0 ? 'increase' : 'decrease'
            };

            // THIS MONTH ORDER OVERVIEW
            const thisMonthOrderGrowthRate =
                lastMonthTotalOrders === 0
                    ? thisMonthTotalOrders > 0 ? 100 : 0
                    : ((thisMonthTotalOrders - lastMonthTotalOrders) / lastMonthTotalOrders) * 100;

            const thisMonthOrderOverview = {
                totalOrder: thisMonthTotalOrders,
                growthRate: thisMonthOrderGrowthRate,
                type: thisMonthOrderGrowthRate >= 0 ? 'increase' : 'decrease'
            }

            // TODAY INCOME & EXPENSE
            const todayIncomeExpense = {
                income: todayTotalIncome._sum.amount ?? 0,
                expense: todayTotalExpense._sum.amount ?? 0
            }

            // THIS MONTH INCOME & EXPENSE
            const thisMonthIncomeExpense = {
                income: thisMonthTotalIncome._sum.amount ?? 0,
                expense: thisMonthTotalExpense._sum.amount ?? 0
            }

            // THIS WEEK INCOME & EXPENSE
            const thisWeekIncomeExpense = {
                income: thisWeekTotalIncome._sum.amount ?? 0,
                expense: thisWeekTotalExpense._sum.amount ?? 0
            }

            // TOTAL INCOME & EXPENSE OVERVIEW
            const totalIncomeExpense = {
                income: (totalIncome._sum.amount ?? 0) + (totalDeliveredOrders._sum.totalAmount ?? 0),
                expense: totalExpense._sum.amount ?? 0
            }

            console.log(totalIncomeExpense)

            return {
                productOverview,
                damageOverview,
                outOfStockOverview,
                todayTotalOrders,
                thisWeekOrderOverview,
                thisMonthOrderOverview, 
                totalDueOrders,
                todayIncomeExpense,
                thisMonthIncomeExpense,
                thisWeekIncomeExpense,
                totalIncomeExpense
            }
        })
})
import { z } from "zod";

import { db } from "@/lib/db";
import { adminProcedure, createTRPCRouter } from "../init";

export const reportRouter = createTRPCRouter({
    product: adminProcedure
        .input(
            z.object({
                startDate: z.string().nullish(),
                endDate: z.string().nullish(),
            })
        )
        .query(async ({ input }) => {
            const targetStartDate = input.startDate ? new Date(input.startDate) : new Date();
            const targetEndDate = input.endDate ? new Date(input.endDate) : new Date();

            const dayStart = new Date(Date.UTC(
                targetStartDate.getUTCFullYear(),
                targetStartDate.getUTCMonth(),
                targetStartDate.getUTCDate(),
                0, 0, 0
            ));

            const dayEnd = new Date(Date.UTC(
                targetEndDate.getUTCFullYear(),
                targetEndDate.getUTCMonth(),
                targetEndDate.getUTCDate(),
                23, 59, 59, 999
            ));

            const products = await db.product.findMany({
                include: {
                    orderItems: {
                        where: {
                            createdAt: {
                                gte: dayStart,
                                lte: dayEnd,
                            },
                        },
                    },
                    incomingItems: {
                        where: {
                            createdAt: {
                                gte: dayStart,
                                lte: dayEnd,
                            },
                        },
                    },
                },
            });

            const reportArray = products.map(product => {
                const totalQuantity = product.orderItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );

                const totalAmount = product.orderItems.reduce(
                    (sum, item) => sum + item.total,
                    0
                );

                const returnedQuantity = product.incomingItems
                    .filter(item => item.reason.toLowerCase() === "returned")
                    .reduce((sum, item) => sum + item.quantity, 0);

                return {
                    productName: product.name,
                    price: product.price,
                    totalQuantity,
                    totalAmount,
                    returnedQuantity,
                };
            });

            return reportArray;
        }),
    sale: adminProcedure
        .input(
            z.object({
                startDate: z.string().nullish(),
                endDate: z.string().nullish(),
            })
        )
        .query(async ({ input }) => {
            const targetStartDate = input.startDate ? new Date(input.startDate) : new Date();
            const targetEndDate = input.endDate ? new Date(input.endDate) : new Date();

            const dayStart = new Date(Date.UTC(
                targetStartDate.getUTCFullYear(),
                targetStartDate.getUTCMonth(),
                targetStartDate.getUTCDate(),
                0, 0, 0
            ));

            const dayEnd = new Date(Date.UTC(
                targetEndDate.getUTCFullYear(),
                targetEndDate.getUTCMonth(),
                targetEndDate.getUTCDate(),
                23, 59, 59, 999
            ));

            const employees = await db.employee.findMany({
                where: {
                    status: "Active",
                },
                include: {
                    outgoings: {
                        where: {
                            createdAt: {
                                gte: dayStart,
                                lte: dayEnd,
                            },
                        },
                        include: {
                            items: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    },
                    incomings: {
                        where: {
                            createdAt: {
                                gte: dayStart,
                                lte: dayEnd,
                            },
                        },
                        include: {
                            items: {
                                where: {
                                    reason: "returned",
                                },
                                include: {
                                    product: true,
                                },
                            },
                        },
                    },
                },
            });

            const reportArray = employees.map((employee) => {
                const productMap = new Map<
                    string,
                    {
                        productName: string;
                        price: number;
                        totalQuantity: number;
                        totalAmount: number;
                        returnedQuantity: number;
                    }
                >();

                // Outgoing items (sold)
                employee.outgoings.forEach((outgoing) => {
                    outgoing.items.forEach((item) => {
                        const product = item.product;
                        const existing = productMap.get(product.id);

                        if (existing) {
                            existing.totalQuantity += item.quantity;
                            existing.totalAmount += item.quantity * product.price;
                        } else {
                            productMap.set(product.id, {
                                productName: product.name,
                                price: product.price,
                                totalQuantity: item.quantity,
                                totalAmount: item.quantity * product.price,
                                returnedQuantity: 0,
                            });
                        }
                    });
                });

                // Incoming items (returned)
                employee.incomings.forEach((incoming) => {
                    incoming.items.forEach((item) => {
                        const product = item.product;
                        const existing = productMap.get(product.id);

                        if (existing) {
                            existing.returnedQuantity += item.quantity;
                        } else {
                            productMap.set(product.id, {
                                productName: product.name,
                                price: product.price,
                                totalQuantity: 0,
                                totalAmount: 0,
                                returnedQuantity: item.quantity,
                            });
                        }
                    });
                });

                return {
                    employeeName: employee.name,
                    items: Array.from(productMap.values()),
                };
            });

            return reportArray;
        }),
});
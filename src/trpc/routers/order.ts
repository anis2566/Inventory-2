import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure, srProcedure } from "../init";
import { db } from "@/lib/db";
import { OrderSchema } from "@/schema/order";
import { ORDER_STATUS } from "@/constant";

export const orderRouter = createTRPCRouter({
    createOne: srProcedure
        .input(OrderSchema)
        .mutation(async ({ input, ctx }) => {
            const employee = ctx.employee
            const { shopId, orderItems } = input;

            try {
                const hasDueOrder = await db.order.findFirst({
                    where: {
                        shopId,
                        status: ORDER_STATUS.Due
                    }
                })

                if (hasDueOrder) {
                    return { success: false, message: "You already have a due order" }
                }

                const total = orderItems.reduce((acc, item) => {
                    return acc + parseFloat(item.price) * parseInt(item.quantity)
                }, 0)

                const totalQuantity = orderItems.reduce((acc, item) => {
                    return acc + parseInt(item.quantity)
                }, 0)

                const items = orderItems.map((item) => ({
                    quantity: Number(item.quantity),
                    productId: item.productId,
                    total: Number(item.price) * Number(item.quantity),
                    price: Number(item.price)
                }))

                await db.order.create({
                    data: {
                        shopId,
                        totalQuantity,
                        totalAmount: total,
                        status: ORDER_STATUS.Placed,
                        employeeId: employee.id,
                        orderItems: {
                            createMany: {
                                data: items
                            }
                        }
                    }
                })

                return { success: true, message: "Order created" }
            } catch (error) {
                console.error("Error creating order", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    updateOneBySr: srProcedure
        .input(
            z.object({
                id: z.string(),
                ...OrderSchema.shape,
            })
        )
        .mutation(async ({ input, ctx }) => {
            const employee = ctx.employee
            const { id, orderItems } = input;

            try {
                const existingOrder = await db.order.findUnique({
                    where: { id, employeeId: employee.id },
                    include: {
                        orderItems: {
                            include: {
                                product: true,
                            }
                        }
                    }
                });

                if (!existingOrder) {
                    return { success: false, message: "Order not found" }
                }

                if (existingOrder.status !== ORDER_STATUS.Placed) {
                    return { success: false, message: "Order cannot be updated" }
                }

                const total = orderItems.reduce((acc, item) => {
                    return acc + parseFloat(item.price) * parseInt(item.quantity)
                }, 0)

                const totalQuantity = orderItems.reduce((acc, item) => {
                    return acc + parseInt(item.quantity)
                }, 0)

                const items = orderItems.map((item) => ({
                    quantity: Number(item.quantity),
                    productId: item.productId,
                    total: Number(item.price) * Number(item.quantity),
                    price: Number(item.price)
                }))

                await db.$transaction(async (tx) => {
                    await tx.orderItem.deleteMany({
                        where: { orderId: id },
                    });
                    await tx.order.update({
                        where: { id },
                        data: {
                            totalAmount: total,
                            totalQuantity,
                            orderItems: {
                                createMany: {
                                    data: items
                                }
                            }
                        }
                    })
                })

                return { success: true, message: "Order updated" }
            } catch (error) {
                console.error("Error updating order", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    statusBySr: srProcedure
        .input(
            z.object({
                id: z.string(),
                status: z.enum(ORDER_STATUS),
                dueAmount: z.string().nullish()
            })
        )
        .mutation(async ({ input }) => {
            const { id, status, dueAmount } = input;

            try {
                const existingOrder = await db.order.findUnique({
                    where: { id },
                })

                if (!existingOrder) {
                    return { success: false, message: "Order not found" }
                }

                if (existingOrder.status === ORDER_STATUS.Received && status === ORDER_STATUS.Due) {
                    return { success: false, message: "Order already received" }
                }

                if (status === ORDER_STATUS.Due && dueAmount) {
                    await db.order.update({
                        where: { id },
                        data: {
                            status,
                            paidAmount: existingOrder.totalAmount - Number(dueAmount),
                            dueAmount: Number(dueAmount),
                        }
                    })
                } else {
                    await db.order.update({
                        where: { id },
                        data: {
                            status,
                            paidAmount: existingOrder.totalAmount,
                            dueAmount: 0
                        }
                    })
                }

                return { success: true, message: "Order updated" }
            } catch (error) {
                console.error("Error updating order", error);
                return { success: false, message: "Internal Server Error" }
            }

        }),
    deleteOne: adminProcedure
        .input(
            z.object({ id: z.string() })
        )
        .mutation(async ({ input }) => {
            const { id } = input;

            try {
                const existingOrder = await db.order.findUnique({
                    where: { id },
                });

                if (!existingOrder) {
                    return { success: false, message: "Order not found" }
                }

                await db.order.delete({
                    where: { id },
                });

                return { success: true, message: "Order deleted" }
            } catch (error) {
                console.error("Error deleting order", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    deleteMany: adminProcedure
        .input(
            z.object({
                ids: z.array(z.string()),
            })
        )
        .mutation(async ({ input }) => {
            const { ids } = input;
            try {
                await db.order.deleteMany({
                    where: {
                        id: {
                            in: ids,
                        },
                    },
                });

                return {
                    success: true,
                    message: "Orders deleted successfully",
                };
            } catch (error) {
                console.error(`Error deleting orders: ${error}`);
                return {
                    success: false,
                    message: "Internal Server Error",
                };
            }
        }),
    summaryBySr: srProcedure
        .input(
            z.object({
                date: z.string().optional().nullable(),
            })
        )
        .query(async ({ input, ctx }) => {
            const employee = ctx.employee;
            const targetDate = input.date ? new Date(input.date) : new Date()

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

            const orderItems = await db.orderItem.findMany({
                where: {
                    createdAt: {
                        gte: dayStart,
                        lte: dayEnd,
                    },
                    order: {
                        employeeId: employee.id
                    }
                },
                select: {
                    product: {
                        select: {
                            name: true,
                            id: true,
                            price: true
                        },
                    },
                    quantity: true,
                },
            })

            const productMap = new Map<string, { id: string; name: string; quantity: number, price: number }>();

            for (const item of orderItems) {
                const { id, name } = item.product;
                if (productMap.has(id)) {
                    productMap.get(id)!.quantity += item.quantity;
                } else {
                    productMap.set(id, { id, name, quantity: item.quantity, price: item.product.price });
                }
            }

            return Array.from(productMap.values());
        }),
    summary: adminProcedure
        .input(
            z.object({
                date: z.string().optional().nullable(),
            })
        )
        .query(async ({ input }) => {
            const targetDate = input.date ? new Date(input.date) : new Date()

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

            const orderItems = await db.orderItem.findMany({
                where: {
                    createdAt: {
                        gte: dayStart,
                        lte: dayEnd,
                    },
                },
                select: {
                    product: {
                        select: {
                            name: true,
                        },
                    },
                    quantity: true,
                },
            })

            const productMap = new Map<string, number>()

            for (const item of orderItems) {
                const name = item.product.name
                const prev = productMap.get(name) ?? 0
                productMap.set(name, prev + item.quantity)
            }

            return Array.from(productMap, ([name, quantity]) => ({ name, quantity }))
        }),
    getOne: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { id } = input;
            const order = await db.order.findUnique({
                where: {
                    id,
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        }
                    },
                    shop: {
                        select: {
                            name: true
                        }
                    },
                    employee: {
                        select: {
                            name: true
                        }
                    }
                }
            });
            return order;
        }),
    getManyBySr: srProcedure
        .input(
            z.object({
                page: z.number(),
                limit: z.number().min(1).max(100),
                sort: z.string().nullish(),
                search: z.string().nullish(),
                status: z.string().nullish(),
            })
        )
        .query(async ({ input, ctx }) => {
            const employee = ctx.employee
            const { page, limit, sort, search, status } = input;

            const [orders, totalCount] = await Promise.all([
                db.order.findMany({
                    where: {
                        employeeId: employee.id,
                        ...(search && {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        }),
                        ...(status && { status }),
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
                    orderBy: {
                        createdAt: sort === "asc" ? "asc" : "desc",
                    },
                    take: limit,
                    skip: (page - 1) * limit,

                }),
                db.order.count({
                    where: {
                        employeeId: employee.id,
                        ...(search && {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        }),
                        ...(status && { status }),
                    },
                }),
            ]);
            return { orders, totalCount };
        }),
    getMany: adminProcedure
        .input(
            z.object({
                page: z.number(),
                limit: z.number().min(1).max(100),
                sort: z.string().nullish(),
                search: z.string().nullish(),
                status: z.string().nullish(),
            })
        )
        .query(async ({ input }) => {
            const { page, limit, sort, search, status } = input;

            const [orders, totalCount] = await Promise.all([
                db.order.findMany({
                    where: {
                        ...(search && {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        }),
                        ...(status && { status }),
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
                        }
                    },
                    orderBy: {
                        createdAt: sort === "asc" ? "asc" : "desc",
                    },
                    take: limit,
                    skip: (page - 1) * limit,

                }),
                db.order.count({
                    where: {
                        ...(search && {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        }),
                        ...(status && { status }),
                    },
                }),
            ]);
            return { orders, totalCount };
        }),
})
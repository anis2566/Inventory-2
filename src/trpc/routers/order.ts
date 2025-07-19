import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure, srProcedure } from "../init";
import { db } from "@/lib/db";
import { OrderSchema } from "@/schema/order";
import { ORDER_STATUS, ORDER_STATUS_SR, PAYMENT_STATUS } from "@/constant";
import { fr } from "date-fns/locale";

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
                        paymentStatus: PAYMENT_STATUS.Due
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
                    price: Number(item.price),
                    freeQuantity: item.freeQuantity ? Number(item.freeQuantity) : 0
                }))

                const totalFreeQuantity = orderItems.reduce((acc, item) => {
                    return acc + (item.freeQuantity ? parseInt(item.freeQuantity) : 0);
                }, 0);

                await db.order.create({
                    data: {
                        shopId,
                        totalQuantity,
                        totalAmount: total,
                        status: ORDER_STATUS.Placed,
                        employeeId: employee.id,
                        freeQuantity: totalFreeQuantity,
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
    paymentStatusBySr: srProcedure
        .input(
            z.object({
                id: z.string(),
                status: z.enum(PAYMENT_STATUS),
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

                if (existingOrder.paymentStatus === PAYMENT_STATUS.Received && status === PAYMENT_STATUS.Due) {
                    return { success: false, message: "Order already received" }
                }

                if (status === PAYMENT_STATUS.Due && dueAmount) {
                    await db.order.update({
                        where: { id },
                        data: {
                            paymentStatus: status,
                            paidAmount: Number(dueAmount),
                            dueAmount: existingOrder.totalAmount - Number(dueAmount),
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
    paymentStatus: adminProcedure
        .input(
            z.object({
                id: z.string(),
                status: z.enum(PAYMENT_STATUS),
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

                if (existingOrder.paymentStatus === PAYMENT_STATUS.Received && status === PAYMENT_STATUS.Due) {
                    return { success: false, message: "Order already received" }
                }

                if (status === PAYMENT_STATUS.Due && dueAmount) {
                    await db.order.update({
                        where: { id },
                        data: {
                            paymentStatus: status,
                            paidAmount: Number(dueAmount),
                            dueAmount: existingOrder.totalAmount - Number(dueAmount),
                        }
                    })
                }

                if (status === PAYMENT_STATUS.Paid) {
                    await db.order.update({
                        where: { id },
                        data: {
                            paymentStatus: status,
                            paidAmount: existingOrder.totalAmount,
                            dueAmount: 0
                        }
                    })
                }

                if (status === PAYMENT_STATUS.Unpaid) {
                    await db.order.update({
                        where: { id },
                        data: {
                            paymentStatus: status,
                            paidAmount: 0,
                            dueAmount: existingOrder.totalAmount
                        }
                    })
                }

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
                status: z.enum(ORDER_STATUS_SR),
                productId: z.string(),
                quantity: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const { id, status, productId, quantity } = input;

            try {
                const existingOrder = await db.order.findUnique({
                    where: { id },
                })

                if (!existingOrder) {
                    return { success: false, message: "Order not found" }
                }

                const product = await db.product.findUnique({
                    where: { id: productId, orderItems: { some: { orderId: id } } },
                })

                if (!product) {
                    return { success: false, message: "Product not found" }
                }

                if (status === ORDER_STATUS_SR.Damaged) {
                    const damageAmount = Number(quantity) * product.price;

                    await db.order.update({
                        where: { id },
                        data: {
                            damageQuantity: Number(quantity),
                            totalAmount: existingOrder.totalAmount - damageAmount,
                            dueAmount: existingOrder.totalAmount - damageAmount
                        }
                    })
                } else if (status === ORDER_STATUS_SR.Returned) {
                    const returnedAmount = Number(quantity) * product.price;

                    await db.order.update({
                        where: { id },
                        data: {
                            returnedQuantity: Number(quantity),
                            totalAmount: existingOrder.totalAmount - returnedAmount,
                            dueAmount: existingOrder.totalAmount - returnedAmount
                        }
                    })
                }

                return { success: true, message: "Order updated" }
            } catch (error) {
                console.error("Error updating order", error);
                return { success: false, message: "Internal Server Error" }
            }

        }),
    status: srProcedure
        .input(
            z.object({
                id: z.string(),
                status: z.enum(ORDER_STATUS),
            })
        )
        .mutation(async ({ input }) => {
            const { id, status } = input;

            try {
                const existingOrder = await db.order.findUnique({
                    where: { id },
                })

                if (!existingOrder) {
                    return { success: false, message: "Order not found" }
                }

                if (status === ORDER_STATUS.Delivered) {
                    await db.order.update({
                        where: { id },
                        data: {
                            status,
                            paidAmount: existingOrder.totalAmount,
                            dueAmount: 0
                        }
                    })
                } else if (status === ORDER_STATUS.Cancelled) {
                    await db.order.update({
                        where: { id },
                        data: {
                            status,
                            totalAmount: 0,
                            paidAmount: 0,
                            dueAmount: 0
                        }
                    })
                } else {
                    await db.order.update({
                        where: { id },
                        data: {
                            status
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
            const targetDate = input.date ? new Date(input.date) : new Date();

            const dayStart = new Date(Date.UTC(
                targetDate.getUTCFullYear(),
                targetDate.getUTCMonth(),
                targetDate.getUTCDate(),
                0, 0, 0
            ));

            const dayEnd = new Date(Date.UTC(
                targetDate.getUTCFullYear(),
                targetDate.getUTCMonth(),
                targetDate.getUTCDate(),
                23, 59, 59, 999
            ));

            // 1. Fetch OrderItems by employee and date
            const orderItems = await db.orderItem.findMany({
                where: {
                    createdAt: {
                        gte: dayStart,
                        lte: dayEnd,
                    },
                    order: {
                        employeeId: employee.id,
                    },
                },
                select: {
                    quantity: true,
                    freeQuantity: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            incomingItems: {
                                where: {
                                    createdAt: {
                                        gte: dayStart,
                                        lte: dayEnd,
                                    },
                                },
                                select: {
                                    quantity: true,
                                },
                            },
                        },
                    },
                },
            });

            const productMap = new Map<string, {
                id: string;
                name: string;
                price: number;
                quantity: number;
                freeQuantity: number;
                returnedQuantity: number;
            }>();

            for (const item of orderItems) {
                const { id, name, price, incomingItems } = item.product;

                const returnedQty = incomingItems.reduce((sum, i) => sum + i.quantity, 0);

                if (productMap.has(id)) {
                    const existing = productMap.get(id)!;
                    existing.quantity += item.quantity;
                    existing.freeQuantity += item.freeQuantity;
                    existing.returnedQuantity += returnedQty;
                } else {
                    productMap.set(id, {
                        id,
                        name,
                        price,
                        quantity: item.quantity,
                        freeQuantity: item.freeQuantity,
                        returnedQuantity: returnedQty,
                    });
                }
            }

            console.log(Array.from(productMap.values()))


            return Array.from(productMap.values());
        }),

    summary: adminProcedure
        .input(
            z.object({
                date: z.string().optional().nullable(),
            })
        )
        .query(async ({ input }) => {
            const targetDate = input.date ? new Date(input.date) : new Date();

            const dayStart = new Date(Date.UTC(
                targetDate.getUTCFullYear(),
                targetDate.getUTCMonth(),
                targetDate.getUTCDate(),
                0, 0, 0
            ));

            const dayEnd = new Date(Date.UTC(
                targetDate.getUTCFullYear(),
                targetDate.getUTCMonth(),
                targetDate.getUTCDate(),
                23, 59, 59, 999
            ));

            // Fetch all items in parallel
            const [orderItems, incomingItems, outgoingItems] = await Promise.all([
                db.orderItem.findMany({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                    },
                    select: {
                        product: { select: { name: true } },
                        quantity: true,
                    },
                }),
                db.ingoingItem.findMany({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                    },
                    select: {
                        product: { select: { name: true } },
                        quantity: true,
                    },
                }),
                db.outgoingItem.findMany({
                    where: {
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                    },
                    select: {
                        product: { select: { name: true } },
                        quantity: true,
                    },
                }),
            ]);

            // Initialize map
            const productMap = new Map<
                string,
                { quantity: number; incoming: number; outgoing: number }
            >();

            // Add orderItems
            for (const item of orderItems) {
                const name = item.product.name;
                const entry = productMap.get(name) ?? { quantity: 0, incoming: 0, outgoing: 0 };
                entry.quantity += item.quantity;
                productMap.set(name, entry);
            }

            // Add incomingItems
            for (const item of incomingItems) {
                const name = item.product.name;
                const entry = productMap.get(name) ?? { quantity: 0, incoming: 0, outgoing: 0 };
                entry.incoming += item.quantity;
                entry.quantity += item.quantity;
                productMap.set(name, entry);
            }

            // Add outgoingItems
            for (const item of outgoingItems) {
                const name = item.product.name;
                const entry = productMap.get(name) ?? { quantity: 0, incoming: 0, outgoing: 0 };
                entry.outgoing += item.quantity;
                entry.quantity += item.quantity;
                productMap.set(name, entry);
            }

            // Return array of aggregated data
            return Array.from(productMap, ([name, data]) => ({
                name,
                quantity: data.quantity,
                incoming: data.incoming,
                outgoing: data.outgoing,
            }));
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
                            name: true,
                            address: true,
                            phone: true
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
                date: z.string().nullish(),
                paymentStatus: z.string().nullish()
            })
        )
        .query(async ({ input, ctx }) => {
            const employee = ctx.employee
            const { page, limit, sort, search, status, date, paymentStatus } = input;

            const targetDate = date ? new Date(date) : new Date()

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

            const [orders, totalCount, orderOverview] = await Promise.all([
                db.order.findMany({
                    where: {
                        employeeId: employee.id,
                        ...(search && {
                            shop: {
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                }
                            }
                        }),
                        ...(status && { status }),
                        ...(paymentStatus && { paymentStatus }),
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd
                        }
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
                            shop: {
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                }
                            }
                        }),
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd
                        },
                        ...(status && { status }),
                        ...(paymentStatus && { paymentStatus }),
                    },
                }),
                db.order.aggregate({
                    where: {
                        employeeId: employee.id,
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd
                        },
                    },
                    _count: {
                        _all: true
                    },
                    _sum: {
                        totalAmount: true
                    }
                })
            ]);

            return { orders, totalCount, totalOrderCount: orderOverview._count._all ?? 0, totalAmount: orderOverview._sum.totalAmount ?? 0 };
        }),
    getMany: adminProcedure
        .input(
            z.object({
                page: z.number(),
                limit: z.number().min(1).max(100),
                sort: z.string().nullish(),
                search: z.string().nullish(),
                status: z.string().nullish(),
                date: z.string().nullish(),
                paymentStatus: z.string().nullish()
            })
        )
        .query(async ({ input }) => {
            const { page, limit, sort, search, status, date, paymentStatus } = input;

            const targetDate = date ? new Date(date) : new Date()

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
                        ...(paymentStatus && { paymentStatus }),
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd
                        }
                    },
                    include: {
                        shop: {
                            select: {
                                name: true,
                            }
                        },
                        employee: {
                            select: {
                                name: true
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
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd
                        }
                    },
                }),
            ]);
            return { orders, totalCount };
        }),
})
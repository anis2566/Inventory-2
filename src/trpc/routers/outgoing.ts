import { z } from "zod";

import { adminProcedure, createTRPCRouter, srProcedure } from "../init";
import { db } from "@/lib/db";
import { OutgoingSchema } from "@/schema/outgoing";

export const outgoingRouter = createTRPCRouter({
    createOne: srProcedure
        .input(OutgoingSchema)
        .mutation(async ({ input, ctx }) => {
            const employee = ctx.employee
            const { items } = input;

            try {
                const productIds = items.map((item) => item.productId);

                const products = await db.product.findMany({
                    where: {
                        id: { in: productIds }
                    },
                    select: {
                        id: true,
                        name: true,
                        stock: true,
                    }
                });

                const productMap = new Map(products.map(p => [p.id, p]));

                for (const item of items) {
                    const product = productMap.get(item.productId);
                    const requiredQty = Number(item.quantity);

                    if (!product) {
                        return {
                            success: false,
                            message: `Product with ID ${item.productId} not found.`,
                        };
                    }

                    if (product.stock < requiredQty) {
                        return {
                            success: false,
                            message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Required: ${requiredQty}`,
                        };
                    }
                }

                console.log(items)

                const total = items.reduce((acc, item) => acc + Number(item.quantity) * Number(item.price), 0);

                const totalQuantity = items.reduce((acc, item) => acc + Number(item.quantity), 0);

                const formatedItems = items.map((item) => ({
                    quantity: Number(item.quantity),
                    productId: item.productId
                }))

                await db.$transaction(async (tx) => {
                    await tx.outgoing.create({
                        data: {
                            employeeId: employee.id,
                            items: {
                                createMany: {
                                    data: formatedItems
                                }
                            },
                            total,
                            totalQuantity
                        },
                    });
                    for (const item of formatedItems) {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: {
                                stock: {
                                    decrement: item.quantity
                                }
                            }
                        })
                    }
                })

                return { success: true, message: "Outgoing created" }
            } catch (error) {
                console.error("Error creating outgoing", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    updateOne: adminProcedure
        .input(
            z.object({
                id: z.string(),
                ...OutgoingSchema.shape,
            })
        )
        .mutation(async ({ input }) => {
            const { id, items } = input;

            try {
                const existingOutgoing = await db.outgoing.findUnique({
                    where: { id },
                    include: { items: true },
                });

                if (!existingOutgoing) {
                    return { success: false, message: "Outgoing record not found" };
                }

                const productIds = items.map((item) => item.productId);

                const products = await db.product.findMany({
                    where: { id: { in: productIds } },
                    select: {
                        id: true,
                        name: true,
                        stock: true,
                    }
                });

                const productMap = new Map(products.map(p => [p.id, p]));

                for (const item of items) {
                    const product = productMap.get(item.productId);
                    const requiredQty = Number(item.quantity);

                    if (!product) {
                        return {
                            success: false,
                            message: `Product with ID ${item.productId} not found.`,
                        };
                    }

                    if (product.stock < requiredQty) {
                        return {
                            success: false,
                            message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Required: ${requiredQty}`,
                        };
                    }
                }

                const total = items.reduce((acc, item) => acc + Number(item.quantity), 0);

                const totalQuantity = items.reduce((acc, item) => acc + Number(item.quantity), 0);

                const formatedItems = items.map((item) => ({
                    quantity: Number(item.quantity),
                    productId: item.productId
                }));

                await db.$transaction(async (tx) => {
                    for (const oldItem of existingOutgoing.items) {
                        await tx.product.update({
                            where: { id: oldItem.productId },
                            data: {
                                stock: {
                                    increment: oldItem.quantity,
                                },
                            },
                        });
                    }

                    await tx.outgoingItem.deleteMany({
                        where: { outgoingId: id },
                    });

                    await tx.outgoing.update({
                        where: { id },
                        data: {
                            total,
                            totalQuantity,
                            items: {
                                createMany: {
                                    data: formatedItems,
                                },
                            },
                        },
                    });

                    for (const item of formatedItems) {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: {
                                stock: {
                                    decrement: item.quantity,
                                },
                            },
                        });
                    }
                })

                return { success: true, message: "Outgoing updated" };
            } catch (error) {
                console.error("Error updating outgoing", error);
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
                const existingOutgoing = await db.outgoing.findUnique({
                    where: { id },
                });

                if (!existingOutgoing) {
                    return { success: false, message: "Outgoing not found" }
                }

                await db.outgoing.delete({
                    where: { id },
                });

                return { success: true, message: "Outgoing deleted" }
            } catch (error) {
                console.error("Error deleting outgoing", error);
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
                await db.outgoing.deleteMany({
                    where: {
                        id: {
                            in: ids,
                        },
                    },
                });

                return {
                    success: true,
                    message: "Outgoings deleted successfully",
                };
            } catch (error) {
                console.error(`Error deleting outgoing: ${error}`);
                return {
                    success: false,
                    message: "Internal Server Error",
                };
            }
        }),
    getOneBySr: srProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input, ctx }) => {
            const employee = ctx.employee

            const { id } = input;
            const outgoing = await db.outgoing.findUnique({
                where: {
                    employeeId: employee.id,
                    id,
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    category: {
                                        select: {
                                            name: true
                                        }
                                    },
                                    name: true,
                                    description: true,
                                    price: true,
                                    productCode: true
                                }
                            }
                        }
                    },
                    employee: true
                }
            });
            return outgoing;
        }),
    getOne: adminProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { id } = input;
            const outgoing = await db.outgoing.findUnique({
                where: {
                    id,
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    category: {
                                        select: {
                                            name: true
                                        }
                                    },
                                    name: true,
                                    description: true,
                                    price: true,
                                    productCode: true,
                                    id: true
                                }
                            }
                        }
                    },
                    employee: true
                }
            });
            return outgoing;
        }),
    getManyBySr: srProcedure
        .input(
            z.object({
                date: z.string().optional().nullable(),
                page: z.number(),
                limit: z.number().min(1).max(100),
                sort: z.string().nullish(),
            })
        )
        .query(async ({ input, ctx }) => {
            const employee = ctx.employee
            const { date, page, limit, sort, } = input;

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

            const [outgoings, totalCount] = await Promise.all([
                db.outgoing.findMany({
                    where: {
                        employeeId: employee.id,
                        ...(date && {
                            createdAt: {
                                gte: dayStart,
                                lte: dayEnd
                            }
                        })
                    },
                    include: {
                        _count: {
                            select: {
                                items: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: sort === "asc" ? "asc" : "desc",
                    },
                    take: limit,
                    skip: (page - 1) * limit,

                }),
                db.outgoing.count({
                    where: {
                        employeeId: employee.id,
                        ...(date && {
                            createdAt: {
                                gte: dayStart,
                                lte: dayEnd
                            }
                        })
                    },
                }),
            ]);
            return { outgoings, totalCount };
        }),
    getMany: adminProcedure
        .input(
            z.object({
                date: z.string().optional().nullable(),
                page: z.number(),
                limit: z.number().min(1).max(100),
                sort: z.string().nullish(),
                employee: z.string().nullish(),
            })
        )
        .query(async ({ input }) => {
            const { page, limit, sort, employee, date } = input;

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

            const [outgoings, totalCount] = await Promise.all([
                db.outgoing.findMany({
                    where: {
                        ...(date && {
                            createdAt: {
                                gte: dayStart,
                                lte: dayEnd
                            }
                        }),
                        ...(employee && {
                            employee: {
                                name: {
                                    contains: employee,
                                    mode: "insensitive",
                                }
                            }
                        }),
                    },
                    include: {
                        employee: {
                            select: {
                                name: true
                            }
                        },
                        _count: {
                            select: {
                                items: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: sort === "asc" ? "asc" : "desc",
                    },
                    take: limit,
                    skip: (page - 1) * limit,

                }),
                db.outgoing.count({
                    where: {
                        ...(date && {
                            createdAt: {
                                gte: dayStart,
                                lte: dayEnd
                            }
                        }),
                        ...(employee && {
                            employee: {
                                name: {
                                    contains: employee,
                                    mode: "insensitive",
                                }
                            }
                        }),
                    },
                }),
            ]);
            return { outgoings, totalCount };
        }),
})
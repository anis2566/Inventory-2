import { z } from "zod";

import { baseProcedure, createTRPCRouter, protectedProcedure, srProcedure } from "../init";
import { db } from "@/lib/db";
import { BrandSchema } from "@/schema/brand";
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

                const items = orderItems.map((item) => ({
                    quantity: Number(item.quantity),
                    productId: item.productId,
                    total: Number(item.price) * Number(item.quantity),
                    price: Number(item.price)
                }))

                await db.order.create({
                    data: {
                        shopId,
                        total,
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
    updateOne: baseProcedure
        .input(
            z.object({
                id: z.string(),
                ...BrandSchema.shape,
            })
        )
        .mutation(async ({ input }) => {
            const { id, name, description, status } = input;

            try {
                const existingBrand = await db.brand.findUnique({
                    where: { id },
                });

                if (!existingBrand) {
                    return { success: false, message: "Brand not found" }
                }

                await db.brand.update({
                    where: { id },
                    data: {
                        name,
                        description,
                        status
                    },
                });

                return { success: true, message: "Brand updated" }
            } catch (error) {
                console.error("Error updating brand", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    deleteOne: baseProcedure
        .input(
            z.object({ id: z.string() })
        )
        .mutation(async ({ input }) => {
            const { id } = input;

            try {
                const existingBrand = await db.brand.findUnique({
                    where: { id },
                });

                if (!existingBrand) {
                    return { success: false, message: "Brand not found" }
                }

                await db.brand.delete({
                    where: { id },
                });

                return { success: true, message: "Brand deleted" }
            } catch (error) {
                console.error("Error deleting brand", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    deleteMany: baseProcedure
        .input(
            z.object({
                ids: z.array(z.string()),
            })
        )
        .mutation(async ({ input }) => {
            const { ids } = input;
            try {
                await db.brand.deleteMany({
                    where: {
                        id: {
                            in: ids,
                        },
                    },
                });

                return {
                    success: true,
                    message: "Brands deleted successfully",
                };
            } catch (error) {
                console.error(`Error deleting brands: ${error}`);
                return {
                    success: false,
                    message: "Internal Server Error",
                };
            }
        }),
    forSelect: baseProcedure
        .input(
            z.object({
                search: z.string().nullish(),
            })
        )
        .query(async ({ input }) => {
            const { search } = input;
            const brands = await db.brand.findMany({
                where: {
                    ...(search && {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    }),
                },
                select: {
                    id: true,
                    name: true,
                },
            });
            return brands;
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
                            id: true
                        },
                    },
                    quantity: true,
                },
            })

            const productMap = new Map<string, { id: string; name: string; quantity: number }>();

            for (const item of orderItems) {
                const { id, name } = item.product;
                if (productMap.has(id)) {
                    productMap.get(id)!.quantity += item.quantity;
                } else {
                    productMap.set(id, { id, name, quantity: item.quantity });
                }
            }

            return Array.from(productMap.values());
        }),
    summary: protectedProcedure
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
    getOne: baseProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { id } = input;
            const product = await db.order.findUnique({
                where: {
                    id,
                },
                include: {
                    employee: {
                        select: {
                            name: true
                        }
                    },
                    shop: {
                        select: {
                            name: true,
                            address: true,
                            phone: true
                        }
                    },
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    productCode: true
                                }
                            }
                        }
                    }
                }
            });
            return product;
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
    getMany: baseProcedure
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
import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/lib/db";
import { BrandSchema } from "@/schema/brand";
import { OrderSchema } from "@/schema/order";
import { ORDER_STATUS } from "@/constant";

export const orderRouter = createTRPCRouter({
    createOne: baseProcedure
        .input(OrderSchema)
        .mutation(async ({ input }) => {
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
                }))

                await db.order.create({
                    data: {
                        shopId,
                        total,
                        status: ORDER_STATUS.Placed,
                        employeeId: "6875336521b39e890ad9a871",
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
    getOne: baseProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { id } = input;
            const brand = await db.brand.findUnique({
                where: {
                    id,
                },
            });
            return brand;
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

            const [brands, totalCount] = await Promise.all([
                db.brand.findMany({
                    where: {
                        ...(search && {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        }),
                        ...(status && { status }),
                    },
                    orderBy: {
                        createdAt: sort === "asc" ? "asc" : "desc",
                    },
                    take: limit,
                    skip: (page - 1) * limit,

                }),
                db.brand.count({
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
            return { brands, totalCount };
        }),
})
import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/lib/db";
import { ShopSchema } from "@/schema/shop";

export const shopRouter = createTRPCRouter({
    createOne: protectedProcedure
        .input(ShopSchema)
        .mutation(async ({ input }) => {
            const { name, phone, address } = input;

            try {
                const existingShop = await db.shop.findFirst({
                    where: { name },
                })

                if (existingShop) {
                    return { success: false, message: "SHop already exists" }
                }

                await db.shop.create({
                    data: {
                        name,
                        address,
                        phone
                    },
                });

                return { success: true, message: "Shop created" }
            } catch (error) {
                console.error("Error creating shop", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    updateOne: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                ...ShopSchema.shape,
            })
        )
        .mutation(async ({ input }) => {
            const { id, name, phone, address } = input;

            try {
                const existingShop = await db.shop.findUnique({
                    where: { id },
                });

                if (!existingShop) {
                    return { success: false, message: "Shop not found" }
                }

                await db.shop.update({
                    where: { id },
                    data: {
                        name,
                        address,
                        phone
                    },
                });

                return { success: true, message: "Shop updated" }
            } catch (error) {
                console.error("Error updating shop", error);
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
                const existingShop = await db.shop.findUnique({
                    where: { id },
                });

                if (!existingShop) {
                    return { success: false, message: "Shop not found" }
                }

                await db.shop.delete({
                    where: { id },
                });

                return { success: true, message: "Shop deleted" }
            } catch (error) {
                console.error("Error deleting shop", error);
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
                await db.shop.deleteMany({
                    where: {
                        id: {
                            in: ids,
                        },
                    },
                });

                return {
                    success: true,
                    message: "Shops deleted successfully",
                };
            } catch (error) {
                console.error(`Error deleting shops: ${error}`);
                return {
                    success: false,
                    message: "Internal Server Error",
                };
            }
        }),
    forSelect: protectedProcedure
        .input(
            z.object({
                search: z.string().nullish(),
            })
        )
        .query(async ({ input }) => {
            const { search } = input;
            const shops = await db.shop.findMany({
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
            return shops;
        }),
    getOne: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { id } = input;
            const shop = await db.shop.findUnique({
                where: {
                    id,
                },
            });
            return shop;
        }),
    getMany: protectedProcedure
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
            const { page, limit, sort, search } = input;

            const [shops, totalCount] = await Promise.all([
                db.shop.findMany({
                    where: {
                        ...(search && {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        }),
                    },
                    orderBy: {
                        createdAt: sort === "asc" ? "asc" : "desc",
                    },
                    take: limit,
                    skip: (page - 1) * limit,

                }),
                db.shop.count({
                    where: {
                        ...(search && {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        }),
                    },
                }),
            ]);
            return { shops, totalCount };
        }),
})
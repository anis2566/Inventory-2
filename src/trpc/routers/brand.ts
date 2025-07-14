import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/lib/db";
import { BrandSchema } from "@/schema/brand";

export const brandRouter = createTRPCRouter({
    createOne: baseProcedure
        .input(BrandSchema)
        .mutation(async ({ input }) => {
            const { name, description, status } = input;

            try {
                const existingBrand = await db.brand.findUnique({
                    where: { name },
                })

                if (existingBrand) {
                    return { success: false, message: "Brand already exists" }
                }

                await db.brand.create({
                    data: {
                        name,
                        description,
                        status
                    },
                });

                return { success: true, message: "Brand created" }
            } catch (error) {
                console.error("Error creating brand", error);
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
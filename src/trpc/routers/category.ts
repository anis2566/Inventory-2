import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/lib/db";
import { CategorySchema } from "@/schema/category";

export const categoryRouter = createTRPCRouter({
    createOne: baseProcedure
        .input(CategorySchema)
        .mutation(async ({ input }) => {
            const { name, description, status } = input;

            try {
                const existingCategory = await db.category.findUnique({
                    where: { name },
                })

                if (existingCategory) {
                    return { success: false, message: "Category already exists" }
                }

                await db.category.create({
                    data: {
                        name,
                        description,
                        status
                    },
                });

                return { success: true, message: "Category created" }
            } catch (error) {
                console.error("Error creating category", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    updateOne: baseProcedure
        .input(
            z.object({
                id: z.string(),
                ...CategorySchema.shape,
            })
        )
        .mutation(async ({ input }) => {
            const { id, name, description, status } = input;

            try {
                const existingCategory = await db.category.findUnique({
                    where: { id },
                });

                if (!existingCategory) {
                    return { success: false, message: "Category not found" }
                }

                await db.category.update({
                    where: { id },
                    data: {
                        name,
                        description,
                        status
                    },
                });

                return { success: true, message: "Category updated" }
            } catch (error) {
                console.error("Error updating category", error);
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
                const existingCategory = await db.category.findUnique({
                    where: { id },
                });

                if (!existingCategory) {
                    return { success: false, message: "Category not found" }
                }

                await db.category.delete({
                    where: { id },
                });

                return { success: true, message: "Category deleted" }
            } catch (error) {
                console.error("Error deleting category", error);
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
                await db.category.deleteMany({
                    where: {
                        id: {
                            in: ids,
                        },
                    },
                });

                return {
                    success: true,
                    message: "Categories deleted successfully",
                };
            } catch (error) {
                console.error(`Error deleting categories: ${error}`);
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
            const categories = await db.category.findMany({
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
            return categories;
        }),
    getOne: baseProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { id } = input;
            const category = await db.category.findUnique({
                where: {
                    id,
                },
            });
            return category;
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

            const [categories, totalCount] = await Promise.all([
                db.category.findMany({
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
                db.category.count({
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
            return { categories, totalCount };
        }),
})
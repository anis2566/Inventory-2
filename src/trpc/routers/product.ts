import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/lib/db";
import { ProductSchema } from "@/schema/product";

export const productRouter = createTRPCRouter({
    createOne: adminProcedure
        .input(ProductSchema)
        .mutation(async ({ input }) => {
            const { name, description, productCode, status, categoryId, brandId, price, discountPrice, stock } = input;

            try {
                const existingProductCode = await db.product.findUnique({
                    where: { productCode },
                })

                if (existingProductCode) {
                    return { success: false, message: "Product code already exists" }
                }

                await db.product.create({
                    data: {
                        name,
                        description,
                        productCode,
                        status,
                        categoryId,
                        brandId,
                        price: Number(price),
                        discountPrice: Number(discountPrice),
                        stock: Number(stock)
                    },
                });

                return { success: true, message: "Product created" }
            } catch (error) {
                console.error("Error creating product", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    updateOne: adminProcedure
        .input(
            z.object({
                id: z.string(),
                ...ProductSchema.shape,
            })
        )
        .mutation(async ({ input }) => {
            const { id, name, description, productCode, status, categoryId, brandId, price, discountPrice, stock } = input;

            try {
                const existingProduct = await db.product.findUnique({
                    where: { id },
                });

                if (!existingProduct) {
                    return { success: false, message: "Product not found" }
                }

                const existingProductCode = await db.product.findUnique({
                    where: { productCode },
                })

                if (productCode !== existingProduct.productCode && existingProductCode) {
                    return { success: false, message: "Product code already exists" }
                }

                await db.product.update({
                    where: { id },
                    data: {
                        name,
                        description,
                        productCode,
                        status,
                        categoryId,
                        brandId,
                        price: Number(price),
                        discountPrice: Number(discountPrice),
                        stock: Number(stock)
                    },
                });

                return { success: true, message: "Product updated" }
            } catch (error) {
                console.error("Error updating product", error);
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
                const existingProduct = await db.product.findUnique({
                    where: { id },
                });

                if (!existingProduct) {
                    return { success: false, message: "Product not found" }
                }

                await db.product.delete({
                    where: { id },
                });

                return { success: true, message: "Product deleted" }
            } catch (error) {
                console.error("Error deleting product", error);
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
                await db.product.deleteMany({
                    where: {
                        id: {
                            in: ids,
                        },
                    },
                });

                return {
                    success: true,
                    message: "Products deleted successfully",
                };
            } catch (error) {
                console.error(`Error deleting products: ${error}`);
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
            const products = await db.product.findMany({
                where: {
                    ...(search && {
                        OR: [
                            {
                                productCode: {
                                    contains: search,
                                    mode: "insensitive",
                                }
                            },
                            {
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                }
                            }
                        ]
                    }),
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    productCode: true
                },
            });
            return products;
        }),
    getOne: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { id } = input;
            const product = await db.product.findUnique({
                where: {
                    id,
                },
                include: {
                    brand: {
                        select: {
                            name: true
                        }
                    },
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            });
            return product;
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

            const [products, totalCount] = await Promise.all([
                db.product.findMany({
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
                        brand: {
                            select: {
                                name: true
                            }
                        },
                        category: {
                            select: {
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: sort === "asc" ? "asc" : "desc",
                    },
                    take: limit,
                    skip: (page - 1) * limit,

                }),
                db.product.count({
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
            return { products, totalCount };
        }),
})
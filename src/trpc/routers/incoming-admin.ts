import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "../init";
import { db } from "@/lib/db";
import { IncomingSchema } from "@/schema/incoming-admin";

export const incomingAdminRouter = createTRPCRouter({
    createOne: adminProcedure
        .input(IncomingSchema)
        .mutation(async ({ input }) => {
            const { items } = input;

            try {
                const total = items.reduce((acc, item) => acc + Number(item.quantity) * Number(item.price), 0);

                const totalQuantity = items.reduce((acc, item) => acc + Number(item.quantity), 0);

                const formatedItems = items.map((item) => ({
                    quantity: Number(item.quantity),
                    productId: item.productId,
                }));

                await db.$transaction(async (tx) => {
                    await tx.incomingAdmin.create({
                        data: {
                            total,
                            totalQuantity,
                            items: {
                                createMany: {
                                    data: formatedItems
                                }
                            },
                        },
                    });
                    for (const item of items) {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: {
                                stock: {
                                    increment: Number(item.quantity),
                                },
                            },
                        });
                    }
                })

                return { success: true, message: "Incoming created" }
            } catch (error) {
                console.error("Error creating incoming", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    updateOne: adminProcedure
        .input(
            z.object({
                id: z.string(),
                ...IncomingSchema.shape,
            })
        )
        .mutation(async ({ input }) => {
            const { id, items } = input;

            try {
                const existingIncoming = await db.incomingAdmin.findUnique({
                    where: { id },
                    include: { items: true },
                });

                if (!existingIncoming) {
                    return { success: false, message: "Incoming record not found" };
                }


                const total = items.reduce((acc, item) => acc + Number(item.quantity), 0);

                const totalQuantity = items.reduce((acc, item) => acc + Number(item.quantity), 0);

                const formatedItems = items.map((item) => ({
                    quantity: Number(item.quantity),
                    productId: item.productId,
                }));

                await db.$transaction(async (tx) => {
                    for (const oldItem of existingIncoming.items) {
                        await tx.product.update({
                            where: { id: oldItem.productId },
                            data: {
                                stock: {
                                    decrement: oldItem.quantity,
                                },
                            },
                        });
                    }

                    await tx.incomingItemAdmin.deleteMany({
                        where: { incomingId: id },
                    });

                    await tx.incomingAdmin.update({
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
                                    increment: item.quantity,
                                },
                            },
                        });
                    }
                })

                return { success: true, message: "Incoming updated" };
            } catch (error) {
                console.error("Error updating incoming", error);
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
                const existingIncoming = await db.incomingAdmin.findUnique({

                    where: { id },
                });

                if (!existingIncoming) {
                    return { success: false, message: "Outgoing not found" }
                }

                await db.incomingAdmin.delete({
                    where: { id },
                });

                return { success: true, message: "Incoming deleted" }
            } catch (error) {
                console.error("Error deleting incoming", error);
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
                await db.incomingAdmin.deleteMany({
                    where: {
                        id: {
                            in: ids,
                        },
                    },
                });

                return {
                    success: true,
                    message: "Incomings deleted successfully",
                };
            } catch (error) {
                console.error(`Error deleting incoming: ${error}`);
                return {
                    success: false,
                    message: "Internal Server Error",
                };
            }
        }),
    getOne: adminProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { id } = input;
            const incoming = await db.incomingAdmin.findUnique({
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
                }
            });
            return incoming;
        }),
    getMany: adminProcedure
        .input(
            z.object({
                date: z.string().optional().nullable(),
                page: z.number(),
                limit: z.number().min(1).max(100),
                sort: z.string().nullish(),
            })
        )
        .query(async ({ input }) => {
            const { page, limit, sort, date } = input;

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

            const [incomings, totalCount] = await Promise.all([
                db.incomingAdmin.findMany({
                    where: {
                        ...(date && {
                            createdAt: {
                                gte: dayStart,
                                lte: dayEnd
                            }
                        }),
                    },
                    include: {
                        _count: {
                            select: {
                                items: true
                            }
                        },
                    },
                    orderBy: {
                        createdAt: sort === "asc" ? "asc" : "desc",
                    },
                    take: limit,
                    skip: (page - 1) * limit,

                }),
                db.incomingAdmin.count({
                    where: {
                        ...(date && {
                            createdAt: {
                                gte: dayStart,
                                lte: dayEnd
                            }
                        }),
                    },
                }),
            ]);
            return { incomings, totalCount };
        }),
})
import { z } from "zod";

import { adminProcedure,  createTRPCRouter } from "../init";
import { db } from "@/lib/db";
import { IncomeSchema } from "@/schema/income";

export const incomeRouter = createTRPCRouter({
    createOne: adminProcedure
        .input(IncomeSchema)
        .mutation(async ({ input }) => {
            const { type, month, amount } = input;

            try {
                await db.income.create({
                    data: {
                        type,
                        year: new Date().getFullYear(),
                        month,
                        amount: Number(amount),
                    },
                });

                return { success: true, message: "Income created" }
            } catch (error) {
                console.error("Error creating income", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    updateOne: adminProcedure
        .input(
            z.object({
                id: z.string(),
                ...IncomeSchema.shape,
            })
        )
        .mutation(async ({ input }) => {
            const { id, type, month, amount } = input;

            try {
                const existingIncome = await db.income.findUnique({
                    where: { id },
                });

                if (!existingIncome) {
                    return { success: false, message: "Income not found" }
                }

                await db.income.update({
                    where: { id },
                    data: {
                        type,
                        year: new Date().getFullYear(),
                        month,
                        amount: Number(amount),
                    },
                });

                return { success: true, message: "Income updated" }
            } catch (error) {
                console.error("Error updating income", error);
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
                const existingIncome = await db.income.findUnique({
                    where: { id },
                });

                if (!existingIncome) {
                    return { success: false, message: "Income not found" }
                }

                await db.income.delete({
                    where: { id },
                });

                return { success: true, message: "Income deleted" }
            } catch (error) {
                console.error("Error deleting income", error);
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
                await db.income.deleteMany({
                    where: {
                        id: {
                            in: ids,
                        },
                    },
                });

                return {
                    success: true,
                    message: "Incomes deleted successfully",
                };
            } catch (error) {
                console.error(`Error deleting incomes: ${error}`);
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
            const income = await db.income.findUnique({
                where: {
                    id,
                },
            });
            return income;
        }),
    getMany: adminProcedure
        .input(
            z.object({
                page: z.number(),
                limit: z.number().min(1).max(100),
                sort: z.string().nullish(),
                month: z.string().nullish(),
                date: z.string().optional().nullable(),
            })
        )
        .query(async ({ input }) => {
            const { page, limit, sort, month, date } = input;

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

            const [incomes, totalCount] = await Promise.all([
                db.income.findMany({
                    where: {
                        ...(date && {
                            createdAt: {
                                gte: dayStart,
                                lte: dayEnd
                            }
                        }),
                        ...(month && {
                            month,
                        }),
                    },
                    orderBy: {
                        createdAt: sort === "asc" ? "asc" : "desc",
                    },
                    take: limit,
                    skip: (page - 1) * limit,

                }),
                db.income.count({
                    where: {
                        ...(date && {
                            createdAt: {
                                gte: dayStart,
                                lte: dayEnd
                            }
                        }),
                        ...(month && {
                            month,
                        }),
                    },
                }),
            ]);
            return { incomes, totalCount };
        }),
})
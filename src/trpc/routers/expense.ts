import { z } from "zod";

import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/lib/db";
import { ExpenseSchema } from "@/schema/expense";

export const expenseRouter = createTRPCRouter({
    createOne: adminProcedure
        .input(ExpenseSchema)
        .mutation(async ({ input }) => {
            const { type, month, amount } = input;

            try {
                await db.expense.create({
                    data: {
                        type,
                        year: new Date().getFullYear(),
                        month,
                        amount: Number(amount),
                    },
                });

                return { success: true, message: "Expense created" }
            } catch (error) {
                console.error("Error creating expense", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    updateOne: baseProcedure
        .input(
            z.object({
                id: z.string(),
                ...ExpenseSchema.shape,
            })
        )
        .mutation(async ({ input }) => {
            const { id, type, month, amount } = input;

            try {
                const existingExpense = await db.expense.findUnique({
                    where: { id },
                });

                if (!existingExpense) {
                    return { success: false, message: "Expense not found" }
                }

                await db.expense.update({
                    where: { id },
                    data: {
                        type,
                        year: new Date().getFullYear(),
                        month,
                        amount: Number(amount),
                    },
                });

                return { success: true, message: "Expense updated" }
            } catch (error) {
                console.error("Error updating expense", error);
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
                const existingExpense = await db.expense.findUnique({
                    where: { id },
                });

                if (!existingExpense) {
                    return { success: false, message: "Expense not found" }
                }

                await db.expense.delete({
                    where: { id },
                });

                return { success: true, message: "Expense deleted" }
            } catch (error) {
                console.error("Error deleting expense", error);
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
                await db.expense.deleteMany({
                    where: {
                        id: {
                            in: ids,
                        },
                    },
                });

                return {
                    success: true,
                    message: "Exepnses deleted successfully",
                };
            } catch (error) {
                console.error(`Error deleting expenses: ${error}`);
                return {
                    success: false,
                    message: "Internal Server Error",
                };
            }
        }),
    getOne: baseProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { id } = input;
            const expense = await db.expense.findUnique({
                where: {
                    id,
                },
            });
            return expense;
        }),
    getMany: baseProcedure
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

            const [expenses, totalCount] = await Promise.all([
                db.expense.findMany({
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
                db.expense.count({
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
            return { expenses, totalCount };
        }),
})
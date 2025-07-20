import { z } from "zod";

import { adminProcedure, baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/lib/db";
import { clerkClient } from "@/lib/clerk";

export const userRouter = createTRPCRouter({
    updateRole: adminProcedure
        .input(
            z.object({
                id: z.string(),
                role: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const { id, role } = input;

            try {
                const existingUser = await db.user.findUnique({
                    where: { id },
                })

                if (!existingUser) {
                    return { success: false, message: "User not found" }
                }

                await db.$transaction(async (tx) => {
                    await tx.user.update({
                        where: { id },
                        data: {
                            role,
                        },
                    });
                    await clerkClient.users.updateUserMetadata(existingUser.clerkId, {
                        publicMetadata: {
                            role,
                        }
                    })
                })

                return { success: true, message: "User role updated" }
            } catch (error) {
                console.error("Error updating user role", error);
                return { success: false, message: "Internal Server Error" }
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
            const users = await db.user.findMany({
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
                    avatar: true
                },
            });
            return users;
        }),
    getOne: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { id } = input;
            const user = await db.user.findUnique({
                where: {
                    id,
                },
            });
            return user;
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

            const [users, totalCount] = await Promise.all([
                db.user.findMany({
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
                db.user.count({
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
            return { users, totalCount };
        }),
})
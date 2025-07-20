import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "../init";
import { db } from "@/lib/db";
import { EmployeeSchema } from "@/schema/employee";
import { ROLE } from "@/constant";
import { clerkClient } from "@/lib/clerk";

export const employeeRouter = createTRPCRouter({
    createOne: adminProcedure
        .input(EmployeeSchema)
        .mutation(async ({ input }) => {
            const { name, phone, address, avatar, nid, status, userId } = input;

            try {
                const existingEmployee = await db.employee.findFirst({
                    where: { name },
                })

                if (existingEmployee) {
                    return { success: false, message: "Employee already exists" }
                }

                await db.$transaction(async (tx) => {
                    await tx.employee.create({
                        data: {
                            userId,
                            name,
                            phone,
                            address,
                            avatar,
                            nid,
                            status
                        },
                    })
                    const existingUser = await tx.user.update({
                        where: { id: userId },
                        data: {
                            role: ROLE.SR,
                        },
                    });
                    await clerkClient.users.updateUserMetadata(existingUser.clerkId, {
                        publicMetadata: {
                            role: ROLE.SR,
                        }
                    })
                })

                return { success: true, message: "Employee created" }
            } catch (error) {
                console.error("Error creating employee", error);
                return { success: false, message: "Internal Server Error" }
            }
        }),
    updateOne: adminProcedure
        .input(
            z.object({
                id: z.string(),
                ...EmployeeSchema.shape,
            })
        )
        .mutation(async ({ input }) => {
            const { id, name, phone, address, avatar, nid, status } = input;

            try {
                const existingEmployee = await db.employee.findUnique({
                    where: { id },
                });

                if (!existingEmployee) {
                    return { success: false, message: "Employee not found" }
                }

                await db.employee.update({
                    where: { id },
                    data: {
                        name,
                        phone,
                        address,
                        avatar,
                        nid,
                        status
                    },
                });

                return { success: true, message: "Employee updated" }
            } catch (error) {
                console.error("Error updating employee", error);
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
                const existingEmployee = await db.employee.findUnique({
                    where: { id },
                });

                if (!existingEmployee) {
                    return { success: false, message: "Employee not found" }
                }

                await db.employee.delete({
                    where: { id },
                });

                return { success: true, message: "Employee deleted" }
            } catch (error) {
                console.error("Error deleting employee", error);
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
                await db.employee.deleteMany({
                    where: {
                        id: {
                            in: ids,
                        },
                    },
                });

                return {
                    success: true,
                    message: "Employees deleted successfully",
                };
            } catch (error) {
                console.error(`Error deleting employees: ${error}`);
                return {
                    success: false,
                    message: "Internal Server Error",
                };
            }
        }),
    forSelect: adminProcedure
        .input(
            z.object({
                search: z.string().nullish(),
            })
        )
        .query(async ({ input }) => {
            const { search } = input;
            const employees = await db.employee.findMany({
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
            return employees;
        }),
    getOne: adminProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { id } = input;
            const employee = await db.employee.findUnique({
                where: {
                    id,
                },
            });
            return employee;
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

            const [employees, totalCount] = await Promise.all([
                db.employee.findMany({
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
                db.employee.count({
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
            return { employees, totalCount };
        }),
})
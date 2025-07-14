import { z } from "zod";

import { CATEGORY_STATUS } from "@/constant";

export const EmployeeSchema = z.object({
    name: z.string().min(1, { message: "required" }),
    phone: z.string().length(11, {message: "invalid phone number"}).min(1, { message: "required" }),
    address: z.string().min(1, { message: "required" }),
    avatar: z.string().optional(),
    nid: z.string().optional(),
    status: z
        .enum(CATEGORY_STATUS)
        .refine((val) => Object.values(CATEGORY_STATUS).includes(val), {
            message: "required",
        }),
})

export type EmployeeSchemaType = z.infer<typeof EmployeeSchema>
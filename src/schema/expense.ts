import { z } from "zod";

import { EXPENSE_TYPE, MONTHS } from "@/constant";

export const ExpenseSchema = z.object({
    type: z
        .enum(EXPENSE_TYPE)
        .refine((val) => Object.values(EXPENSE_TYPE).includes(val), {
            message: "required",
        }),
    month: z
        .enum(MONTHS)
        .refine((val) => Object.values(MONTHS).includes(val), {
            message: "required",
        }),
    amount: z.string().min(1, { message: "required" }),
})

export type ExpenseSchemaType = z.infer<typeof ExpenseSchema>
import { z } from "zod";

import { INCOME_TYPE, MONTHS } from "@/constant";

export const IncomeSchema = z.object({
    type: z
        .enum(INCOME_TYPE)
        .refine((val) => Object.values(INCOME_TYPE).includes(val), {
            message: "required",
        }),
    month: z
        .enum(MONTHS)
        .refine((val) => Object.values(MONTHS).includes(val), {
            message: "required",
        }),
    amount: z.string().min(1, { message: "required" }),
})

export type IncomeSchemaType = z.infer<typeof IncomeSchema>
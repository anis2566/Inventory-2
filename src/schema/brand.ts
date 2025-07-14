import { z } from "zod";

import { CATEGORY_STATUS } from "@/constant";

export const BrandSchema = z.object({
    name: z.string().min(1, { message: "required" }),
    description: z.string().optional(),
    status: z
        .enum(CATEGORY_STATUS)
        .refine((val) => Object.values(CATEGORY_STATUS).includes(val), {
            message: "required",
        }),
})

export type BrandSchemaType = z.infer<typeof BrandSchema>
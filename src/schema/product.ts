import { z } from "zod";

import { CATEGORY_STATUS } from "@/constant";

export const ProductSchema = z.object({
    name: z.string().min(1, { message: "required" }),
    productCode: z.string().min(1, { message: "required" }),
    description: z.string().optional(),
    price: z.string().min(1, { message: "required" }),
    discountPrice: z.string().optional(),
    stock: z.string().min(1, { message: "required" }),
    damageStock: z.string().min(1, { message: "required" }),
    categoryId: z.string().min(1, { message: "required" }),
    brandId: z.string().min(1, { message: "required" }),
    status: z
        .enum(CATEGORY_STATUS)
        .refine((val) => Object.values(CATEGORY_STATUS).includes(val), {
            message: "required",
        }),
})

export type ProductSchemaType = z.infer<typeof ProductSchema>
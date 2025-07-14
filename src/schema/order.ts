import { z } from "zod";

import { CATEGORY_STATUS } from "@/constant";

export const SaleSchema = z.object({
    quantity: z.string().min(1, { message: "required" }),
    productId: z.string().min(1, { message: "required" }),
    price: z.string().min(1, { message: "required" }),
    name: z.string().min(1, { message: "required" })
})

export const OrderSchema = z.object({
    shopId: z.string().min(1, { message: "required" }),
    products: z.array(SaleSchema).min(1, { message: "required" }),
    status: z
        .enum(CATEGORY_STATUS)
        .refine((val) => Object.values(CATEGORY_STATUS).includes(val), {
            message: "required",
        }),
})

export type OrderSchemaType = z.infer<typeof OrderSchema>
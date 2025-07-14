import { z } from "zod";

export const ShopSchema = z.object({
    name: z.string().min(1, { message: "required" }),
    address: z.string().min(1, { message: "required" }),
    phone: z.string().optional(),
})

export type ShopSchemaType = z.infer<typeof ShopSchema>
import { z } from "zod";

export const IncomingItemSchema = z.object({
    quantity: z.string().min(1, { message: "required" }),
    productId: z.string().min(1, { message: "required" }),
    name: z.string().min(1, { message: "required" }),
    price: z.string().min(1, { message: "required" })
})

export const IncomingSchema = z.object({
    items: z.array(IncomingItemSchema).min(1, { message: "required" }),
})

export type IncomingSchemaType = z.infer<typeof IncomingSchema>
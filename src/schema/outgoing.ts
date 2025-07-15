import { z } from "zod";

export const OutgoingItemSchema = z.object({
    quantity: z.string().min(1, { message: "required" }),
    productId: z.string().min(1, { message: "required" }),
    name: z.string().min(1, { message: "required" })
})

export const OutgoingSchema = z.object({
    items: z.array(OutgoingItemSchema).min(1, { message: "required" }),
})

export type OutgoingSchemaType = z.infer<typeof OutgoingSchema>
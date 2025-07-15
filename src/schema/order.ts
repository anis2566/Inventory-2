import { z } from "zod";

export const OrderItemSchema = z.object({
    quantity: z.string().min(1, { message: "required" }),
    productId: z.string().min(1, { message: "required" }),
    price: z.string().min(1, { message: "required" }),
    name: z.string().min(1, { message: "required" })
})

export const OrderSchema = z.object({
    shopId: z.string().min(1, { message: "required" }),
    orderItems: z.array(OrderItemSchema).min(1, { message: "required" }),
})

export type OrderSchemaType = z.infer<typeof OrderSchema>
"use server";

import { db } from "./db";

export const generateOrderId = async () => {
    const counter = await db.counter.findFirst();

    if (!counter) {
        throw new Error("Counter not found");
    }

    await db.counter.update({
        where: { id: counter.id },
        data: { count: counter.count + 1 },
    });

    const orderId = `HHE-${counter.count + 1}`

    return orderId;
}

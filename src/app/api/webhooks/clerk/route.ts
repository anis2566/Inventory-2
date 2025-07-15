import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

import { clerkClient } from '@/lib/clerk'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req)

        // Do something with payload
        // For this guide, log payload to console
        const { id } = evt.data
        const eventType = evt.type
        console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
        console.log('Webhook payload:', evt.data)

        if (eventType === "user.created") {
            await db.$transaction(async (tx) => {
                await tx.user.create({
                    data: {
                        clerkId: evt.data.id,
                        name: `${evt.data.first_name} ${evt.data.last_name}`,
                        email: evt.data.email_addresses[0].email_address,
                        avatar: evt.data.image_url,
                    }
                })
                await clerkClient.users.updateUserMetadata(evt.data.id, {
                    publicMetadata: {
                        role: "User",
                    }
                })
            })
        }

        if (eventType === "user.updated") {
            await db.user.update({
                where: { clerkId: evt.data.id },
                data: {
                    name: `${evt.data.first_name} ${evt.data.last_name}`,
                    avatar: evt.data.image_url,
                }
            })
        }

        if (eventType === "user.deleted") {
            if (id) {
                await db.user.delete({ where: { clerkId: id } })
            }
        }

        return new Response('Webhook received', { status: 200 })
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error verifying webhook', { status: 400 })
    }
}
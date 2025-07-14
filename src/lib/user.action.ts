"use server"

import { cache } from "react"
import { auth, currentUser } from "@clerk/nextjs/server"

import { db } from "./db"
import { redirect } from "next/navigation"

export const getCurrentUser = cache(async () => {
    const session = await auth()

    if (!session.userId) return null

    const user = await db.user.findUnique({
        where: {
            clerkId: session.userId
        },
        include: {
            bank: true
        }
    })

    if (!user) return null;

    return user;
})

export const getUser = async () => {
    const session = await auth()

    if (!session.userId) return null

    const user = await db.user.findUnique({
        where: {
            clerkId: session.userId
        }
    })

    if (!user) return null;

    return user;
}

export const getUserByClerkId = cache(async () => {
    const user = await currentUser()

    if (!user) return redirect('/sign-in')

    return await db.user.findUnique({
        where: {
            clerkId: user.id
        }
    })
})

export const generateReferCode = async (name: string) => {
    const lastUserWithName = await db.user.findFirst({
        where: {
            name
        },
        select: { name: true },
        orderBy: {
            createdAt: "desc"
        }
    })

    if (!lastUserWithName) {
        return `${name}-1`
    }

    const referCode = lastUserWithName.name.split("-")[1]
    return `${name}-${Number(referCode) + 1}`
}
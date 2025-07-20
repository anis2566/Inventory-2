import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/', "/order(.*)", "/outgoing(.*)", "/report(.*)", "/dashboard(.*)"])

const isSrRoute = createRouteMatcher(['/', "/order(.*)", "/outgoing(.*)", "/report(.*)"])

const isAdminRoute = createRouteMatcher(['/', "/dashboard(.*)"])

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect()

    const sessionClaims = (await auth()).sessionClaims;

    if (sessionClaims?.role !== "SR" && isSrRoute(req)) {
        const onboardingUrl = new URL('/unauthorized', req.url)
        return NextResponse.redirect(onboardingUrl)
    }

    if (sessionClaims?.role !== "Admin" && isAdminRoute(req)) {
        const onboardingUrl = new URL('/unauthorized', req.url)
        return NextResponse.redirect(onboardingUrl)
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
        "/(.*)",
    ],
};
"use client";

import { useTRPC } from "@/trpc/client";
import QuickActions from "../components/quick-actions"
import { useSuspenseQuery } from "@tanstack/react-query";
import Loader from "@/components/loader";
import { RecentOrders } from "../components/recent-orders";
import { DueCard } from "../components/due";

export const DashboardView = () => {
    const trpc = useTRPC();

    const { data, isLoading } = useSuspenseQuery(trpc.userDashboard.get.queryOptions());

    if (isLoading) return <Loader />

    return (
        <div className="container flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <QuickActions />
                    <RecentOrders orders={data?.recentOrders ?? []} />
                </div>

                <div className="space-y-6">
                    <DueCard dueAmount={data?.dueAmount} dueShops={data?.dueShops} />
                </div>
            </div>
        </div>
    )
}
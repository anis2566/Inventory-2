import { Metadata } from "next";
import Link from "next/link";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Loader from "@/components/loader";
import { ErrorBoundryUI } from "@/components/error-boundary";

import { getQueryClient, trpc } from "@/trpc/server";
import { ContentLayout } from "@/modules/dashboard/ui/view/content-layout";
import { OrderDetails } from "@/modules/dashboard/order/ui/view/order-details";

export const metadata: Metadata = {
    title: "Order details",
    description: "Order details",
};

interface Props {
    params: Promise<{ id: string }>;
}

const Order = async ({ params }: Props) => {
    const { id } = await params;

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(
        trpc.order.getOne.queryOptions({
            id,
        })
    );

    return (
        <ContentLayout navChildren={<NavChildren />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<Loader />}>
                    <ErrorBoundary fallback={<ErrorBoundryUI />}>
                        <OrderDetails id={id} />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </ContentLayout>
    );
};

export default Order;

const NavChildren = () => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard/order">Orders</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>Details</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
};
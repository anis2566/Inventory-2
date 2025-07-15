import { Metadata } from "next";
import Link from "next/link";
import { SearchParams } from "nuqs";
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
} from "@/components/ui/breadcrumb"
import Loader from "@/components/loader";
import { ErrorBoundryUI } from "@/components/error-boundary";

import { ContentLayout } from "@/modules/dashboard/ui/view/content-layout";
import { getQueryClient, trpc } from "@/trpc/server";
import { shopSearchParams } from "@/modules/dashboard/shop/filter/params";
import { ShopList } from "@/modules/dashboard/shop/ui/view/shop-list";


export const metadata: Metadata = {
    title: "Shops",
    description: "Shops",
};

interface Props {
    searchParams: Promise<SearchParams>;
}

const Shops = async ({ searchParams }: Props) => {
    const params = await shopSearchParams(searchParams);

    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(trpc.shop.getMany.queryOptions({
        ...params
    }))

    return (
        <ContentLayout navChildren={<NavChildren />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<Loader />}>
                    <ErrorBoundary fallback={<ErrorBoundryUI />}>
                        <ShopList />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </ContentLayout>
    )
}

export default Shops

const NavChildren = () => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href="/">
                            Dashboard
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>Shops</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
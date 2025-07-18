import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ErrorBoundryUI } from "@/components/error-boundary";
import Loader from "@/components/loader";

import { ContentLayout } from "@/modules/dashboard/ui/view/content-layout";
import { getQueryClient, trpc } from "@/trpc/server";
import { productReportSearchParams } from "@/modules/dashboard/report/filter/params";
import { ProductReportView } from "@/modules/dashboard/report/ui/view/product-report-view";

export const metadata: Metadata = {
    title: "Product Report",
    description: "Product Report",
};

interface Props {
    searchParams: Promise<SearchParams>;
}

const ProductReport = async ({ searchParams }: Props) => {
    const params = await productReportSearchParams(searchParams);

    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(trpc.report.product.queryOptions({
        ...params
    }));

    return (
        <ContentLayout navChildren={<NavChildren />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<Loader />}>
                    <ErrorBoundary fallback={<ErrorBoundryUI />}>
                        <ProductReportView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </ContentLayout>
    )
}

export default ProductReport

const NavChildren = async () => {
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
                    <BreadcrumbPage>Product Report</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
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
import { SaleReportView } from "@/modules/dashboard/report/ui/view/sale-report-view";
import { saleReportSearchParams } from "@/modules/dashboard/report/filter/params";

export const metadata: Metadata = {
    title: "Sale Report",
    description: "Sale Report",
};

interface Props {
    searchParams: Promise<SearchParams>;
}

const SaleReport = async ({ searchParams }: Props) => {
    const params = await saleReportSearchParams(searchParams);

    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(trpc.report.sale.queryOptions({
        ...params
    }));

    return (
        <ContentLayout navChildren={<NavChildren />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<Loader />}>
                    <ErrorBoundary fallback={<ErrorBoundryUI />}>
                        <SaleReportView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </ContentLayout>
    )
}

export default SaleReport

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
                    <BreadcrumbPage>Sale Report</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
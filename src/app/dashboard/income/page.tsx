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
import { incomeSearchParams } from "@/modules/dashboard/income/filter/params";
import { IncomeList } from "@/modules/dashboard/income/ui/view/income-list";


export const metadata: Metadata = {
    title: "Incomes",
    description: "Incomes",
};

interface Props {
    searchParams: Promise<SearchParams>;
}

const Income = async ({ searchParams }: Props) => {
    const params = await incomeSearchParams(searchParams);

    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(trpc.income.getMany.queryOptions({
        ...params
    }))

    return (
        <ContentLayout navChildren={<NavChildren />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<Loader />}>
                    <ErrorBoundary fallback={<ErrorBoundryUI />}>
                        <IncomeList />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </ContentLayout>
    )
}

export default Income

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
                    <BreadcrumbPage>Income</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
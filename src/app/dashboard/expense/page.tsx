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
import { expenseSearchParams } from "@/modules/dashboard/expense/filter/params";
import { ExpenseList } from "@/modules/dashboard/expense/ui/view/expense-list";


export const metadata: Metadata = {
    title: "Expense",
    description: "Expense",
};

interface Props {
    searchParams: Promise<SearchParams>;
}

const Expenses = async ({ searchParams }: Props) => {
    const params = await expenseSearchParams(searchParams);

    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(trpc.expense.getMany.queryOptions({
        ...params
    }))

    return (
        <ContentLayout navChildren={<NavChildren />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<Loader />}>
                    <ErrorBoundary fallback={<ErrorBoundryUI />}>
                        <ExpenseList />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </ContentLayout>
    )
}

export default Expenses

const NavChildren = () => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard">
                            Dashboard
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>Expense</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
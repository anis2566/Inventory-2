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

import { ContentLayout } from "@/modules/ui/view/content-layout";
import { getQueryClient, trpc } from "@/trpc/server";
import { brandSearchParams } from "@/modules/brand/filter/params";
import { EmployeeList } from "@/modules/employee/ui/view/employee-list";


export const metadata: Metadata = {
    title: "Employees",
    description: "Employees",
};

interface Props {
    searchParams: Promise<SearchParams>;
}

const Employees = async ({ searchParams }: Props) => {
    const params = await brandSearchParams(searchParams);

    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(trpc.employee.getMany.queryOptions({
        ...params
    }))

    return (
        <ContentLayout navChildren={<NavChildren />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<Loader />}>
                    <ErrorBoundary fallback={<ErrorBoundryUI />}>
                        <EmployeeList />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </ContentLayout>
    )
}

export default Employees

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
                    <BreadcrumbPage>Employees</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
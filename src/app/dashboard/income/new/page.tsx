import { Metadata } from "next";
import Link from "next/link";
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
import { ErrorBoundryUI } from "@/components/error-boundary";
import Loader from "@/components/loader";

import { ContentLayout } from "@/modules/dashboard/ui/view/content-layout";
import { IncomeForm } from "@/modules/dashboard/income/ui/view/income-form";


export const metadata: Metadata = {
    title: "New Income",
    description: "New Income",
};

const NewIncome = async () => {
    return (
        <ContentLayout navChildren={<NavChildren />}>
            <Suspense fallback={<Loader />}>
                <ErrorBoundary fallback={<ErrorBoundryUI />}>
                    <IncomeForm />
                </ErrorBoundary>
            </Suspense>
        </ContentLayout>
    )
}

export default NewIncome

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
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href="/income">
                            Incomes
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>New</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
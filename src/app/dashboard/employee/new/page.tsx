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
import { EmployeeForm } from "@/modules/dashboard/employee/ui/view/employee-form";

export const metadata: Metadata = {
    title: "New Employee",
    description: "New Employee",
};

const NewEmployee = async () => {
    return (
        <ContentLayout navChildren={<NavChildren />}>
            <Suspense fallback={<Loader />}>
                <ErrorBoundary fallback={<ErrorBoundryUI />}>
                    <EmployeeForm />
                </ErrorBoundary>
            </Suspense>
        </ContentLayout>
    )
}

export default NewEmployee

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
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href="/employee">
                            Employee
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
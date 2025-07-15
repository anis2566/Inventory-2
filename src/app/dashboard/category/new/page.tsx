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
import { CategoryForm } from "@/modules/dashboard/category/ui/view/category-form";


export const metadata: Metadata = {
    title: "New Category",
    description: "New Category",
};

const NewCategory = async () => {
    return (
        <ContentLayout navChildren={<NavChildren />}>
            <Suspense fallback={<Loader />}>
                <ErrorBoundary fallback={<ErrorBoundryUI />}>
                    <CategoryForm />
                </ErrorBoundary>
            </Suspense>
        </ContentLayout>
    )
}

export default NewCategory

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
                        <Link href="/category">
                            Categories
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
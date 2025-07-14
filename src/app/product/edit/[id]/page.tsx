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
import { ContentLayout } from "@/modules/ui/view/content-layout";
import { EditProductForm } from "@/modules/product/ui/view/edit-product-form";

export const metadata: Metadata = {
    title: "Edit Product",
    description: "Edit Product",
};

interface Props {
    params: Promise<{ id: string }>;
}

const EditProduct = async ({ params }: Props) => {
    const { id } = await params;

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(
        trpc.product.getOne.queryOptions({
            id,
        })
    );

    return (
        <ContentLayout navChildren={<NavChildren />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<Loader />}>
                    <ErrorBoundary fallback={<ErrorBoundryUI />}>
                        <EditProductForm id={id} />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </ContentLayout>
    );
};

export default EditProduct;

const NavChildren = () => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href="/">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href="/product">Products</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>Edit</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
};
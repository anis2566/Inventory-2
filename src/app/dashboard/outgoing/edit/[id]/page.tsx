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
import { ContentLayout } from "@/modules/dashboard/ui/view/content-layout";
import { EditOutgoingForm } from "@/modules/dashboard/outgoing/ui/view/edit-outgoing-form";

export const metadata: Metadata = {
    title: "Edit Outgoing",
    description: "Edit Outgoing",
};

interface Props {
    params: Promise<{ id: string }>;
}

const EditOutgoing = async ({ params }: Props) => {
    const { id } = await params;

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(
        trpc.outgoing.getOne.queryOptions({
            id,
        })
    );
    void queryClient.prefetchQuery(trpc.product.forSelect.queryOptions({}));

    return (
        <ContentLayout navChildren={<NavChildren />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<Loader />}>
                    <ErrorBoundary fallback={<ErrorBoundryUI />}>
                        <EditOutgoingForm id={id} />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </ContentLayout>
    );
};

export default EditOutgoing;

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
                        <Link href="/outgoing">Outgoing</Link>
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
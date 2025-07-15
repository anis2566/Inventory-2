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

import { getQueryClient, trpc } from "@/trpc/server";
import { ContentLayout } from "@/modules/home/ui/view/content-layout";
import { OrderForm } from "@/modules/home/order/ui/view/order-form";
import { OutgoingForm } from "@/modules/home/outgoing/ui/view/outgoing-form";

export const metadata: Metadata = {
    title: "New Outgoing",
    description: "New Outgoing",
};

const NewOutgoing = async () => {
    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(trpc.product.forSelect.queryOptions({ search: "" }));

    return (
        <ContentLayout navChildren={<NavChildren />}>
            <Suspense fallback={<Loader />}>
                <ErrorBoundary fallback={<ErrorBoundryUI />}>
                    <OutgoingForm />
                </ErrorBoundary>
            </Suspense>
        </ContentLayout>
    )
}

export default NewOutgoing

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
                        <Link href="/outgoing">
                            Outgoing
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
import { Metadata } from "next";
import Link from "next/link";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/modules/ui/view/content-layout";
import { OrderForm } from "@/modules/order/ui/view/order-form";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
    title: "New Order",
    description: "New Order",
};

const NewOrder = async () => {
    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(trpc.shop.forSelect.queryOptions({ search: "" }));
    
    return (
        <ContentLayout navChildren={<NavChildren />}>
            <OrderForm />
        </ContentLayout>
    )
}

export default NewOrder

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
                        <Link href="/order">
                            Orders
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
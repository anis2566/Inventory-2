"use client"

import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs";

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
import { ContentLayout } from "@/modules/dashboard/ui/view/content-layout";
import { summarySearchParams } from "@/modules/dashboard/order/filter/params";
import { InvoiceView } from "@/modules/dashboard/order/ui/view/invoice-view";
import { PDFViewer } from "@react-pdf/renderer";


const Invoices = () => {
    return (
        <ContentLayout navChildren={<NavChildren />}>
                <PDFViewer width="100%" height="1000px">
                    <InvoiceView />
                </PDFViewer>
        </ContentLayout>
    )
}

export default Invoices

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
                        <Link href="/dashboard/order">
                            Orders
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>Invoices</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
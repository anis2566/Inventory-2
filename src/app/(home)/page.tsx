import { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import Loader from "@/components/loader";
import { ErrorBoundryUI } from "@/components/error-boundary";

import { ContentLayout } from "@/modules/home/ui/view/content-layout";
import { DashboardView } from "@/modules/home/ui/view/dashboard-view";
import { getQueryClient, trpc } from "@/trpc/server";


export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
}

const Dashboard = () => {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.userDashboard.get.queryOptions())

  return (
    <ContentLayout navChildren={<NavChildren />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loader />}>
          <ErrorBoundary fallback={<ErrorBoundryUI />}>
            <DashboardView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </ContentLayout>
  )
}

export default Dashboard


const NavChildren = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
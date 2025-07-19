"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingBasket, ShoppingCart, Store } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { useOutgoingFilter } from "../../filter/use-outgoing-filter";
import { MobileOutgoingView } from "./mobile-outgoing-view";
import { EmptyStatView } from "@/components/empty-stat-view";

export const OutgoingList = () => {
    const [filter] = useOutgoingFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.outgoing.getManyBySr.queryOptions({
            ...filter,
        })
    );

    if (data?.totalOutgoingCount === 0) {
        return (
            <EmptyStatView
                title="No Stock Out Available"
                description="You don't have any outgoings yet"
                animatedIcon={Store}
                floatingIcon={ShoppingCart}
                floatingIcon2={ShoppingBasket}
                buttonLink="/outgoing/new"
                buttonTitle="Create stock out Now"
            />
        )
    }

    return (
        <div>
            <MobileOutgoingView outgoings={data.outgoings} totalCount={data.totalCount} totalOutgoingCount={data.totalOutgoingCount} totalAmount={data.totalAmount} />

            <DataTable
                data={data.outgoings}
                columns={columns}
                totalCount={data.totalCount}
            />
        </div>
    );
};
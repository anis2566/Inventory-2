"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingBag, ShoppingBasket, ShoppingCart } from "lucide-react";

import { EmptyStatView } from "@/components/empty-stat-view";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { useOrderFilter } from "../../filter/use-order-filter";
import { MobileOrderView } from "./mobile-order-view";

export const OrderList = () => {
    const [filter] = useOrderFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.order.getManyBySr.queryOptions({
            ...filter,
        })
    );

    if (data?.totalOrderCount === 0) {
        return (
            <EmptyStatView
                title="No Order Available"
                description="You don't have any orders yet"
                animatedIcon={ShoppingBag}
                floatingIcon={ShoppingCart}
                floatingIcon2={ShoppingBasket}
                buttonLink="/order/new"
                buttonTitle="Create Order Now"
            />
        )
    }

    return (
        <div>
            <MobileOrderView orders={data.orders ?? []} totalOrderCount={data.totalOrderCount} totalAmount={data.totalAmount} totalCount={data.totalCount} />
            <DataTable
                data={data.orders}
                columns={columns}
                totalCount={data.totalCount}
            />
        </div>
    );
};
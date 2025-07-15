"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { useShopFilter } from "../../filter/use-shop-filter";

export const ShopList = () => {
    const [filter] = useShopFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.shop.getMany.queryOptions({
            ...filter,
        })
    );

    return (
        <div>
            <DataTable
                data={data.shops}
                columns={columns}
                totalCount={data.totalCount}
            />
        </div>
    );
};
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { useOrderFilter } from "../../filter/use-order-filter";

export const OrderList = () => {
    const [filter] = useOrderFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.order.getManyBySr.queryOptions({
            ...filter,
        })
    );

    return (
        <div>
            <DataTable
                data={data.orders}
                columns={columns}
                totalCount={data.totalCount}
            />
        </div>
    );
};
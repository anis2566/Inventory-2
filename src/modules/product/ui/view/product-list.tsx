"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { useProductFilter } from "../../filter/use-product-filter";

export const ProductList = () => {
    const [filter] = useProductFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.product.getMany.queryOptions({
            ...filter,
        })
    );

    return (
        <div>
            <DataTable
                data={data.products}
                columns={columns}
                totalCount={data.totalCount}
            />
        </div>
    );
};
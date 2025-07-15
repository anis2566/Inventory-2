"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { useBrandFilter } from "../../filter/use-brand-filter";

export const BrandList = () => {
    const [filter] = useBrandFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.brand.getMany.queryOptions({
            ...filter,
        })
    );

    return (
        <div>
            <DataTable
                data={data.brands}
                columns={columns}
                totalCount={data.totalCount}
            />
        </div>
    );
};
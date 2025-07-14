"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { useCategoryFilter } from "../../filter/use-category-filter";

export const CategoryList = () => {
    const [filter] = useCategoryFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.category.getMany.queryOptions({
            ...filter,
        })
    );

    return (
        <div>
            <DataTable
                data={data.categories}
                columns={columns}
                totalCount={data.totalCount}
            />
        </div>
    );
};
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { useIncomeFilter } from "../../filter/use-income-filter";

export const IncomeList = () => {
    const [filter] = useIncomeFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.income.getMany.queryOptions({
            ...filter,
        })
    );

    return (
        <div>
            <DataTable
                data={data.incomes}
                columns={columns}
                totalCount={data.totalCount}
            />
        </div>
    );
};
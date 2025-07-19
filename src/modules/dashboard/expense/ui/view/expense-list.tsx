"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { useExpenseFilter } from "../../filter/use-expense-filter";

export const ExpenseList = () => {
    const [filter] = useExpenseFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.expense.getMany.queryOptions({
            ...filter,
        })
    );

    return (
        <div>
            <DataTable
                data={data.expenses}
                columns={columns}
                totalCount={data.totalCount}
            />
        </div>
    );
};
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { useEmployeeFilter } from "../../filter/use-employee-filter";

export const EmployeeList = () => {
    const [filter] = useEmployeeFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.employee.getMany.queryOptions({
            ...filter,
        })
    );

    return (
        <div>
            <DataTable
                data={data.employees}
                columns={columns}
                totalCount={data.totalCount}
            />
        </div>
    );
};
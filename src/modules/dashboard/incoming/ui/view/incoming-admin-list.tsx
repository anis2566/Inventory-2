"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useIncomingFilter } from "../../filter/use-incoming-filter";
import { DataTable } from "../table-admin/data-table";
import { columns } from "../table-admin/columns";

export const IncomingList = () => {
    const [filter] = useIncomingFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.incomingAdmin.getMany.queryOptions({
            ...filter,
        })
    );

    return (
        <div>
            <DataTable
                data={data.incomings}
                columns={columns}
                totalCount={data.totalCount}
            />
        </div>
    );
};
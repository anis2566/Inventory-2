"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { useIncomingFilter } from "../../filter/use-incoming-filter";

export const IncomingList = () => {
    const [filter] = useIncomingFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.incoming.getMany.queryOptions({
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
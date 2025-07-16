"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { useOutgoingFilter } from "../../filter/use-incoming-filter";

export const OutgoingList = () => {
    const [filter] = useOutgoingFilter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.outgoing.getManyBySr.queryOptions({
            ...filter,
        })
    );

    return (
        <div>
            <DataTable
                data={data.outgoings}
                columns={columns}
                totalCount={data.totalCount}
            />
        </div>
    );
};
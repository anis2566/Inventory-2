"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Outgoing } from "@/generated/prisma";

type OutgoingOmit = Omit<Outgoing, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
    _count: {
        items: number
    }
};

export const columns: ColumnDef<OutgoingOmit>[] = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => <p className="truncate">{format(new Date(row.original.createdAt), "dd/MM/yyyy")}</p>,
    },
    {
        accessorKey: "products",
        header: "Products",
        cell: ({ row }) => (
            <p className="truncate">{row.original._count.items}</p>
        )
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => (
            <p className="truncate">{row.original.totalQuantity}</p>
        )
    },
    {
        accessorKey: "f. quantity",
        header: "F. Quantity",
        cell: ({ row }) => (
            <p className="truncate">{row.original.freeQuantity}</p>
        )
    },
    {
        accessorKey: "t. quantity",
        header: "T. Quantity",
        cell: ({ row }) => (
            <p className="truncate">{row.original.totalQuantity + row.original.freeQuantity}</p>
        )
    },
    {
        accessorKey: "total amount",
        header: "T. Amount",
        cell: ({ row }) => (
            <p className="truncate font-bengali">৳{row.original.total}</p>
        )
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ table, row }) => {
            const hasSelected =
                table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

            if (hasSelected) return null;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-700 hover:text-white">
                            <MoreVerticalIcon className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/outgoing/${row.original.id}`}
                                className="flex items-center gap-x-3"
                            >
                                <Eye className="w-5 h-5" />
                                <p>View</p>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
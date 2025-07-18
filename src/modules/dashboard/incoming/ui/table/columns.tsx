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

import { Incoming } from "@/generated/prisma";

type IncomingOmit = Omit<Incoming, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
    _count: {
        items: number
    };
    employee: {
        name: string
    };
};

export const columns: ColumnDef<IncomingOmit>[] = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => <p className="truncate">{format(new Date(row.original.createdAt), "dd/MM/yyyy")}</p>,
    },
    {
        accessorKey: "SR",
        header: "SR",
        cell: ({ row }) => (
            <p className="truncate">{row.original.employee.name}</p>
        )
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
        header: "T. Quantity",
        cell: ({ row }) => (
            <p className="truncate">{row.original.totalQuantity}</p>
        )
    },
    {
        accessorKey: "t. amount",
        header: "T. Amount",
        cell: ({ row }) => (
            <p className="truncate font-bengali tracking-wider">৳{row.original.total}</p>
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
                                href={`/dashboard/incoming/${row.original.id}`}
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
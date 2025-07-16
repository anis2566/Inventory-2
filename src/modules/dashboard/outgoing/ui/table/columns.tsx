"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

import { Outgoing } from "@/generated/prisma";
import { DeleteButton } from "./delete-button";

type OutgoingOmit = Omit<Outgoing, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
    _count: {
        items: number
    };
    employee: {
        name: string
    }
};

export const columns: ColumnDef<OutgoingOmit>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: "sr",
        header: "SR",
        cell: ({ row }) => <p className="truncate">{row.original.employee.name}</p>,
    },
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
        header: "T. Quantity",
        cell: ({ row }) => (
            <p className="truncate">{row.original.total}</p>
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
                                href={`/dashboard/outgoing/${row.original.id}`}
                                className="flex items-center gap-x-3"
                            >
                                <Eye className="w-5 h-5" />
                                <p>View</p>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/dashboard/outgoing/edit/${row.original.id}`}
                                className="flex items-center gap-x-3"
                            >
                                <Edit className="w-5 h-5" />
                                <p>Edit</p>
                            </Link>
                        </DropdownMenuItem>
                        <DeleteButton id={row.original.id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

import { Income } from "@/generated/prisma";
import { DeleteButton } from "./delete-button";

type IncomeOmit = Omit<Income, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
};

export const columns: ColumnDef<IncomeOmit>[] = [
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
        accessorKey: "type",
        header: "Type"
    },
    {
        accessorKey: "year",
        header: "Year"
    },
    {
        accessorKey: "month",
        header: "Month"
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => <p className="truncate font-bengali">৳{row.original.amount || "0"}</p>,
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
                                href={`/dashboard/income/edit/${row.original.id}`}
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
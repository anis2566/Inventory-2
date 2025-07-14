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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Employee } from "@/generated/prisma";
import { DeleteButton } from "./delete-button";

type EmployeeOmit = Omit<Employee, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
};

export const columns: ColumnDef<EmployeeOmit>[] = [
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
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({ row }) => (
            <Avatar>
                <AvatarImage src={row.original.avatar} />
                <AvatarFallback>{row.original.name}</AvatarFallback>
            </Avatar>
        )
    },
    {
        accessorKey: "name",
        header: "Name"
    },
    {
        accessorKey: "phone",
        header: "Phone"
    },
    {
        accessorKey: "nid",
        header: "Nid"
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant="gray" className="rounded-full">{row.original.status}</Badge>
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
                                href={`/employee/edit/${row.original.id}`}
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
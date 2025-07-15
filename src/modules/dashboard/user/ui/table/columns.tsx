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

import { User } from "@/generated/prisma";
import { DeleteButton } from "./delete-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoleButton } from "./role-button";
import { ROLE } from "@/constant";

type UserOmit = Omit<User, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
};

export const columns: ColumnDef<UserOmit>[] = [
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
                <AvatarImage src={row.original.avatar || ""} />
                <AvatarFallback>{row.original.name}</AvatarFallback>
            </Avatar>
        )
    },
    {
        accessorKey: "name",
        header: "Name"
    },
    {
        accessorKey: "email",
        header: "Email"
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
            <p>{row.original.phone || "-"}</p>
        )
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <Badge variant="gray">{row.original.role}</Badge>

        )
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
                        <RoleButton id={row.original.id} role={row.original.role as ROLE} />
                        <DeleteButton id={row.original.id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
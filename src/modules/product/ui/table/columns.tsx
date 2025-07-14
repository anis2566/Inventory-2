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

import { Product } from "@/generated/prisma";
import { DeleteButton } from "./delete-button";

type ProductOmit = Omit<Product, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
    brand: {name: string};
    category: {name: string};
};

export const columns: ColumnDef<ProductOmit>[] = [
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
        accessorKey: "name",
        header: "Name"
    },
    {
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }) => (
            <p className="truncate">{row.original.brand.name}</p>
        )
    },
    {
        accessorKey: "catgory",
        header: "Catgory",
        cell: ({ row }) => (
            <p className="truncate">{row.original.category.name}</p>
        )
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "d. price",
        header: "D. Price",
        cell: ({ row }) => (
            <p>{row.original.discountPrice || "-"}</p>
        )
    },
    {
        accessorKey: "stock",
        header: "Stock",
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
                                href={`/product/edit/${row.original.id}`}
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
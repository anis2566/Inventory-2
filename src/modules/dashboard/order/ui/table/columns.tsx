"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreVerticalIcon } from "lucide-react";
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

import { Order } from "@/generated/prisma";
import { DeleteButton } from "./delete-button";
import { PaymentStatusButton } from "./payment-status-button";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/constant";
import { OrderStatusButton } from "./status-button";

type OrderOmit = Omit<Order, "createdAt" | "updatedAt" | "date" | "deliveryDate"> & {
    createdAt: string;
    updatedAt: string;
    date: string;
    deliveryDate: string | null;
    shop: {
        name: string;
    };
    employee: {
        name: string;
    }
    _count: {
        orderItems: number;
    };
};

export const columns: ColumnDef<OrderOmit>[] = [
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
        accessorKey: "shop",
        header: "Shop",
        cell: ({ row }) => (
            <p className="truncate">{row.original.shop.name || "-"}</p>
        )
    },
    {
        accessorKey: "SR",
        header: "SR",
        cell: ({ row }) => (
            <p className="truncate">{row.original.employee.name || "-"}</p>
        )
    },
    {
        accessorKey: "items",
        header: "Items",
        cell: ({ row }) => (
            <p className="truncate">{row.original._count.orderItems || "0"}</p>
        )
    },
    {
        accessorKey: "t. quantity",
        header: "T. Quantity",
        cell: ({ row }) => (
            <p className="truncate">{row.original.totalQuantity}</p>
        )
    },
    {
        accessorKey: "r. quantity",
        header: "R. Quantity",
        cell: ({ row }) => (
            <p className="truncate">{row.original.returnedQuantity}</p>
        )
    },
    {
        accessorKey: "d. quantity",
        header: "D. Quantity",
        cell: ({ row }) => (
            <p className="truncate">{row.original.damageQuantity}</p>
        )
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => (
            <p className="truncate font-bengali">৳{row.original.totalAmount || "0"}</p>
        )
    },
    {
        accessorKey: "paid",
        header: "Paid",
        cell: ({ row }) => (
            <p className="truncate font-bengali">৳{row.original.paidAmount || "0"}</p>
        )
    },
    {
        accessorKey: "due",
        header: "Due",
        cell: ({ row }) => (
            <p className="truncate font-bengali">৳{row.original.totalAmount - row.original.paidAmount}</p>
        )
    },
    {
        accessorKey: "payment status",
        header: "P. Status",
        cell: ({ row }) => (
            <Badge variant="gray" className="rounded-full">{row.original.paymentStatus}</Badge>
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
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/dashboard/order/${row.original.id}`}
                                className="flex items-center gap-x-3"
                            >
                                <Eye className="w-5 h-5" />
                                <p>View</p>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/dashboard/order/edit/${row.original.id}`}
                                className="flex items-center gap-x-3"
                            >
                                <Edit className="w-5 h-5" />
                                <p>Edit</p>
                            </Link>
                        </DropdownMenuItem>
                        <PaymentStatusButton id={row.original.id} status={row.original.paymentStatus as PAYMENT_STATUS} />
                        <OrderStatusButton id={row.original.id} status={row.original.paymentStatus as ORDER_STATUS} />
                        <DeleteButton id={row.original.id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
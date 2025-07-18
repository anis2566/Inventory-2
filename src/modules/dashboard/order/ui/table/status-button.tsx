"use client"

import { RefreshCcw } from "lucide-react"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils";
import { useOrderStatus } from "@/hooks/use-order";
import { ORDER_STATUS } from "@/constant";

interface DeleteButtonProps {
    id: string;
    status: ORDER_STATUS
}

export const OrderStatusButton = ({ id, status }: DeleteButtonProps) => {
    const { onOpen } = useOrderStatus();

    return (
        <DropdownMenuItem
            className={cn("flex items-center gap-x-3")}
            onClick={() => onOpen(id, status)}
        >
            <RefreshCcw className="w-5 h-5" />
            <p>Order status</p>
        </DropdownMenuItem>
    )
}
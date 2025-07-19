"use client"

import { CornerDownLeft } from "lucide-react"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils";
import { useOrderStatusSr } from "@/hooks/use-order";

interface DeleteButtonProps {
    id: string;
}

export const OrderStatusButton = ({ id }: DeleteButtonProps) => {
    const { onOpen } = useOrderStatusSr();

    return (
        <DropdownMenuItem
            className={cn("flex items-center gap-x-3")}
            onClick={() => onOpen(id)}
        >
            <CornerDownLeft className="w-5 h-5" />
            <p>Return</p>
        </DropdownMenuItem>
    )
}
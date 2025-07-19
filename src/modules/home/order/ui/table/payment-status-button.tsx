"use client"

import { RefreshCcw } from "lucide-react"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils";
import { PAYMENT_STATUS } from "@/constant";
import { usePaymentStatus } from "@/hooks/use-order";

interface DeleteButtonProps {
    id: string;
    status: PAYMENT_STATUS
}

export const PaymentStatusButton = ({ id, status }: DeleteButtonProps) => {
    const { onOpen } = usePaymentStatus();

    return (
        <DropdownMenuItem
            className={cn("flex items-center gap-x-3")}
            onClick={() => onOpen(id, status)}
        >
            <RefreshCcw className="w-5 h-5" />
            <p>Payment status</p>
        </DropdownMenuItem>
    )
}
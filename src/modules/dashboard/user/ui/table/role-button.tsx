"use client"

import { RefreshCcw } from "lucide-react"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/use-user";
import { ROLE } from "@/constant";

interface DeleteButtonProps {
    id: string;
    role: ROLE;
}

export const RoleButton = ({ id, role }: DeleteButtonProps) => {
    const { onOpen } = useUserRole();

    return (
        <DropdownMenuItem
            className={cn("flex items-center gap-x-3")}
            onClick={() => onOpen(id, role)}
        >
            <RefreshCcw className="w-5 h-5" />
            <p>Change role</p>
        </DropdownMenuItem>
    )
}
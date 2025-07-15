"use client"

import { Trash2 } from "lucide-react"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils";
import { useDeleteBrand } from "@/hooks/use-brand";

interface DeleteButtonProps {
    id: string
}

export const DeleteButton = ({ id }: DeleteButtonProps) => {
    const { onOpen } = useDeleteBrand();

    return (
        <DropdownMenuItem
            className={cn("flex items-center gap-x-3 text-rose-500 group")}
            onClick={() => onOpen(id)}
        >
            <Trash2 className="w-5 h-5 group-hover:text-rose-600" />
            <p className="group-hover:text-rose-600">Delete</p>
        </DropdownMenuItem>
    )
}
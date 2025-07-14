"use client";

import { OrderSchemaType } from "@/schema/order"
import { UseFormReturn } from "react-hook-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAddProduct } from "@/hooks/use-product";

export const ProductModal = () => {
    const [search, setSearch] = useState("")

    const {isOpen, onClose} = useAddProduct()

    const trpc = useTRPC()
    const { data } = useQuery(trpc.product.forSelect.queryOptions({ search }))

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Product</DialogTitle>
                </DialogHeader>

                <div>
                    <Input
                        placeholder="Search product"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
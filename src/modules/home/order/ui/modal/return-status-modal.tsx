"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/loading-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

import { ORDER_STATUS_SR } from "@/constant";
import { useTRPC } from "@/trpc/client";
import { useOrderFilter } from "../../filter/use-order-filter";
import { useOrderStatusSr } from "@/hooks/use-order";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    status: z
        .enum(ORDER_STATUS_SR)
        .refine((val) => Object.values(ORDER_STATUS_SR).includes(val), {
            message: "required",
        }),
    productId: z.string().min(1, { message: "required" }),
    quantity: z.string().min(1, { message: "required" }),
});

export const OrderStatusSrModal = () => {
    const [product, setProduct] = useState("")
    const [productId, setProductId] = useState("")
    const [openProduct, setOpenProduct] = useState(false)
    const [searchProduct, setSearchProduct] = useState("")

    const { isOpen, onClose, orderId } = useOrderStatusSr()

    const [filter] = useOrderFilter()

    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { data } = useQuery(trpc.product.forSelect.queryOptions({ search: searchProduct }))

    const { mutate: updateStatus, isPending } = useMutation(trpc.order.statusBySr.mutationOptions({
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            if (!data.success) {
                toast.error(data.message);
                return;
            }
            toast.success(data.message);
            queryClient.invalidateQueries(
                trpc.order.getManyBySr.queryOptions({
                    ...filter,
                })
            );
            form.reset({
                status: undefined,
                productId: "",
                quantity: "",
            });
            onClose();
        },
    }))

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: undefined,
            productId: "",
            quantity: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        updateStatus({
            id: orderId,
            status: values.status,
            productId,
            quantity: values.quantity
        })
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Status</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="productId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-white">Product</FormLabel>
                                    <Popover open={openProduct} onOpenChange={setOpenProduct}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between bg-gray-700 border-gray-700 hover:bg-gray-600 hover:border-gray-600 text-gray-400 hover:text-white",
                                                    )}
                                                    disabled={isPending}
                                                >
                                                    {product ? product : "Select product"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 border-gray-600">
                                            <Command className="space-y-2 bg-gray-700 w-full min-w-[350px] p-2">
                                                <Input
                                                    type="search"
                                                    placeholder="Search category..."
                                                    value={searchProduct}
                                                    onChange={(e) => setSearchProduct(e.target.value)}
                                                    className="w-full bg-gray-600 placeholder:text-gray-400 rounded-full text-white"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No product found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {data?.map((product) => (
                                                            <CommandItem
                                                                value={product.id}
                                                                key={product.id}
                                                                onSelect={() => {
                                                                    form.setValue("productId", product.id);
                                                                    setProduct(product.name);
                                                                    setProductId(product.id);
                                                                    form.trigger("productId");
                                                                    setOpenProduct(false);
                                                                }}
                                                                className="text-gray-400 data-[selected=true]:bg-gray-600 data-[selected=true]:text-white text-white"
                                                            >
                                                                {product.name}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto text-white",
                                                                        product.id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormLabel className="text-white">Status</FormLabel>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(ORDER_STATUS_SR).map((status) => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Quantity"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            title="Update"
                            loadingTitle="Updating..."
                            className="w-full"
                            isLoading={isPending}
                            onClick={form.handleSubmit(onSubmit)}
                            variant="gray"
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
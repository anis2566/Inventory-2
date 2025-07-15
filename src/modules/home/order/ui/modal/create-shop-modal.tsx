"use client";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/loading-button";

import { useCreateShop } from "@/hooks/use-shop";
import { useShopFilter } from "@/modules/dashboard/shop/filter/use-shop-filter";
import { useTRPC } from "@/trpc/client";
import { ShopSchema, ShopSchemaType } from "@/schema/shop";

export const CreateShopModal = () => {
    const { onClose, isOpen } = useCreateShop()

    const [filter] = useShopFilter()

    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { mutate: createShop, isPending } = useMutation(trpc.shop.createOne.mutationOptions({
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
                trpc.shop.getMany.queryOptions({
                    ...filter,
                })
            );
            queryClient.invalidateQueries(
                trpc.shop.forSelect.queryOptions({
                    search: "",
                })
            );
            onClose();
            form.reset();
        },
    }))

    const form = useForm<ShopSchemaType>({
        resolver: zodResolver(ShopSchema),
        defaultValues: {
            name: "",
            address: "",
            phone: "",
        },
    })

    const onSubmit = (data: ShopSchemaType) => {
        createShop(data)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Shop</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Shop name" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Address</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Shop address" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Shop phone" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            title="Submit"
                            loadingTitle="Submitting..."
                            isLoading={isPending}
                            onClick={form.handleSubmit(onSubmit)}
                            variant="gray"
                            icon={Send}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
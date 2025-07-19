"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/loading-button";

import { ORDER_STATUS } from "@/constant";
import { useTRPC } from "@/trpc/client";
import { useOrderFilter } from "../../filter/use-order-filter";
import { useOrderStatus } from "@/hooks/use-order";

const formSchema = z.object({
    status: z
        .enum(ORDER_STATUS)
        .refine((val) => Object.values(ORDER_STATUS).includes(val), {
            message: "required",
        }),
});

export const StatusModal = () => {
    const { isOpen, onClose, status, orderId } = useOrderStatus()

    const [filter] = useOrderFilter()

    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { mutate: updateStatus, isPending } = useMutation(trpc.order.status.mutationOptions({
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
                trpc.order.getMany.queryOptions({
                    ...filter,
                })
            );
            form.reset();
            onClose();
        },
    }))

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: undefined,
        },
    });

    useEffect(() => {
        if (status) {
            form.setValue("status", status)
        }
    }, [status, form])

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        updateStatus({
            id: orderId,
            status: values.status,
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
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(ORDER_STATUS).map((status) => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
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
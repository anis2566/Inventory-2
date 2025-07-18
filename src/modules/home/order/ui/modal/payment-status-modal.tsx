"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/loading-button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

import { PAYMENT_STATUS } from "@/constant";
import { useTRPC } from "@/trpc/client";
import { useOrderFilter } from "../../filter/use-order-filter";
import { usePaymentStatus } from "@/hooks/use-order";

const formSchema = z.object({
    status: z
        .enum(PAYMENT_STATUS)
        .refine((val) => Object.values(PAYMENT_STATUS).includes(val), {
            message: "required",
        }),
    dueAmount: z.string().optional(),
});

export const PaymentStatusModal = () => {
    const { isOpen, onClose, status, orderId } = usePaymentStatus()

    const [filter] = useOrderFilter()

    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { mutate: updateStatus, isPending } = useMutation(trpc.order.paymentStatusBySr.mutationOptions({
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
            dueAmount: "",
        },
    });

    useEffect(() => {
        if (status === PAYMENT_STATUS.Due || status === PAYMENT_STATUS.Received) {
            form.setValue("status", status)
        }
    }, [status, form])

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (values.status === PAYMENT_STATUS.Due && !values.dueAmount) {
            toast.error("Due amount is required")
            return
        }

        updateStatus({
            id: orderId,
            status: values.status,
            dueAmount: values.dueAmount
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
                                        <FormLabel className="text-white">Status</FormLabel>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(PAYMENT_STATUS).slice(1,3).map((status) => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Collapsible open={form.watch("status") === PAYMENT_STATUS.Due}>
                            <CollapsibleContent>
                                <FormField
                                    control={form.control}
                                    name="dueAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">Paid amount</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Due amount" {...field} disabled={isPending} type="number" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </CollapsibleContent>
                        </Collapsible>

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
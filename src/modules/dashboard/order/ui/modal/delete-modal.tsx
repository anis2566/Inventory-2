"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingButton } from "@/components/loading-button";

import { useTRPC } from "@/trpc/client";
import { useDeleteOrder } from "@/hooks/use-order";
import { useOrderFilter } from "../../filter/use-order-filter";

export const DeleteOrderModal = () => {
    const { isOpen, orderId, onClose } = useDeleteOrder();
    const [filter] = useOrderFilter();

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation(
        trpc.order.deleteOne.mutationOptions({
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
                onClose();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const handleDelete = () => {
        mutate({ id: orderId });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        order and remove your data from servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <LoadingButton
                        isLoading={isPending}
                        title="Delete"
                        loadingTitle="Deleting..."
                        onClick={handleDelete}
                        variant="destructive"
                        type="button"
                    />
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
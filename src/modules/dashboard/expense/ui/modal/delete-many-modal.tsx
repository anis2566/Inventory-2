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
import { useDeleteManyExpense } from "@/hooks/use-expense";
import { useExpenseFilter } from "../../filter/use-expense-filter";

export const DeleteManyExpenseModal = () => {
    const { isOpen, ids, onClose } = useDeleteManyExpense();
    const [filter] = useExpenseFilter();

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation(
        trpc.expense.deleteMany.mutationOptions({
            onSuccess: (data) => {
                if (!data.success) {
                    toast.error(data.message);
                    return;
                }
                toast.success(data.message);
                queryClient.invalidateQueries(
                    trpc.expense.getMany.queryOptions({
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
        mutate({ ids });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        expenses and remove your data from servers.
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
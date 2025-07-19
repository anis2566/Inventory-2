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
import { useDeleteManyIncome } from "@/hooks/use-income";
import { useIncomeFilter } from "../../filter/use-income-filter";

export const DeleteManyIncomeModal = () => {
    const { isOpen, ids, onClose } = useDeleteManyIncome();
    const [filter] = useIncomeFilter();

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation(
        trpc.income.deleteMany.mutationOptions({
            onSuccess: (data) => {
                if (!data.success) {
                    toast.error(data.message);
                    return;
                }
                toast.success(data.message);
                queryClient.invalidateQueries(
                    trpc.income.getMany.queryOptions({
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
                        incomes and remove your data from servers.
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
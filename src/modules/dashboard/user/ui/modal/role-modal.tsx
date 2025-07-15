"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/loading-button";

import { useUserRole } from "@/hooks/use-user";
import { ROLE } from "@/constant";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserFilter } from "../../filter/use-user-filter";

const formSchema = z.object({
    role: z
        .enum(ROLE)
        .refine((val) => Object.values(ROLE).includes(val), {
            message: "required",
        }),
});

export const UserRoleModal = () => {
    const { isOpen, onClose, role, userId } = useUserRole()

    const [filter] = useUserFilter()

    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { mutate: updateRole, isPending } = useMutation(trpc.user.updateRole.mutationOptions({
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
                trpc.user.getMany.queryOptions({
                    ...filter,
                })
            );
            onClose();
        },
    }))

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role,
        },
    });

    useEffect(() => {
        if (role) {
            form.setValue("role", role)
        }
    }, [])

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        updateRole({
            id: userId,
            role: values.role
        })
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Role</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(ROLE).map((role) => (
                                                    <SelectItem key={role} value={role}>{role}</SelectItem>
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
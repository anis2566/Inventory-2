"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/loading-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useTRPC } from "@/trpc/client";
import { CATEGORY_STATUS } from "@/constant";
import { useEmployeeFilter } from "../../filter/use-employee-filter";
import { EmployeeSchema, EmployeeSchemaType } from "@/schema/employee";
import { Trash2 } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";

interface Props {
    id: string;
}

export const EditEmployeeForm = ({ id }: Props) => {
    const [filter] = useEmployeeFilter();

    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data } = useSuspenseQuery(
        trpc.employee.getOne.queryOptions({
            id,
        })
    );

    const { mutate: updateEmployee, isPending } = useMutation(
        trpc.employee.updateOne.mutationOptions({
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
                    trpc.employee.getMany.queryOptions({
                        ...filter,
                    })
                );
                queryClient.invalidateQueries(trpc.employee.getOne.queryOptions({ id }));
                router.push("/employee");
            },
        })
    );

    const form = useForm<EmployeeSchemaType>({
        resolver: zodResolver(EmployeeSchema),
        defaultValues: {
            name: data?.name || "",
            phone: data?.phone || "",
            avatar: data?.avatar || "",
            address: data?.address || "",
            nid: data?.nid || "",
            status: data?.status as CATEGORY_STATUS || CATEGORY_STATUS.ACTIVE
        },
    });

    const onSubmit = (data: EmployeeSchemaType) => {
        updateEmployee({
            id,
            ...data,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Employee</CardTitle>
                <CardDescription>Customize your employee information</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Employee name" {...field} disabled={isPending} />
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
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Employee phone" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nid</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Employee nid" {...field} disabled={isPending} />
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
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Employee address" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avatar</FormLabel>
                                    {form.watch("avatar") ? (
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarImage src={form.getValues("avatar")} />
                                            </Avatar>
                                            <Button
                                                type="button"
                                                onClick={() => form.setValue("avatar", "")}
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0"
                                                disabled={isPending}
                                            >
                                                <Trash2 className="w-5 h-5 text-rose-500" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                field.onChange(res[0].ufsUrl);
                                                toast.success("Image uploaded");
                                            }}
                                            onUploadError={() => {
                                                toast.error("Image upload failed");
                                            }}
                                            disabled={isPending}
                                        />
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Status</FormLabel>
                                        <FormDescription className="text-gray-400">
                                            Turn this on if you want active this category
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value === CATEGORY_STATUS.ACTIVE}
                                            onCheckedChange={checked => {
                                                if (checked) {
                                                    field.onChange(CATEGORY_STATUS.ACTIVE)
                                                } else {
                                                    field.onChange(CATEGORY_STATUS.INACTIVE)
                                                }
                                            }}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            onClick={form.handleSubmit(onSubmit)}
                            title="Update"
                            loadingTitle="Updating..."
                            isLoading={isPending}
                            variant="gray"
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

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

import { useTRPC } from "@/trpc/client";
import { CATEGORY_STATUS } from "@/constant";
import { useCategoryFilter } from "../../filter/use-category-filter";
import { CategorySchema, CategorySchemaType } from "@/schema/category";

interface Props {
    id: string;
}

export const EditCategoryForm = ({ id }: Props) => {
    const [filter] = useCategoryFilter();

    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data } = useSuspenseQuery(
        trpc.category.getOne.queryOptions({
            id,
        })
    );

    const { mutate: updateCategory, isPending } = useMutation(
        trpc.category.updateOne.mutationOptions({
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
                    trpc.category.getMany.queryOptions({
                        ...filter,
                    })
                );
                queryClient.invalidateQueries(trpc.category.getOne.queryOptions({ id }));
                router.push("/category");
            },
        })
    );

    const form = useForm<CategorySchemaType>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            name: data?.name,
            description: data?.description || "",
            status: data?.status as CATEGORY_STATUS,
        },
    });

    const onSubmit = (data: CategorySchemaType) => {
        updateCategory({
            id,
            ...data,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Category</CardTitle>
                <CardDescription>Customize your category information</CardDescription>
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
                                        <Input placeholder="Category name" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Category description" {...field} disabled={isPending} />
                                    </FormControl>
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

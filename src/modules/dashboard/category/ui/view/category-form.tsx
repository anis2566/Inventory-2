"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { LoadingButton } from "@/components/loading-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

import { useTRPC } from "@/trpc/client"
import { useCategoryFilter } from "../../filter/use-category-filter"
import { CategorySchema, CategorySchemaType } from "@/schema/category"
import { CATEGORY_STATUS } from "@/constant"

export const CategoryForm = () => {
    const [filter] = useCategoryFilter()

    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { mutate: createCategory, isPending } = useMutation(trpc.category.createOne.mutationOptions({
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
            queryClient.invalidateQueries(
                trpc.category.forSelect.queryOptions({
                    search: "",
                })
            );
            router.push("/category");
        },
    }))

    const form = useForm<CategorySchemaType>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            name: "",
            description: "",
            status: CATEGORY_STATUS.INACTIVE,
        },
    })

    const onSubmit = (data: CategorySchemaType) => {
        createCategory(data)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Category</CardTitle>
                <CardDescription>Add your category details below</CardDescription>
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
                            title="Submit"
                            loadingTitle="Submitting..."
                            isLoading={isPending}
                            onClick={form.handleSubmit(onSubmit)}
                            variant="gray"
                            icon={Send}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
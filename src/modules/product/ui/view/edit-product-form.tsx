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
import { useState } from "react";

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
import { useProductFilter } from "../../filter/use-product-filter";
import { ProductSchema, ProductSchemaType } from "@/schema/product";

interface Props {
    id: string;
}

export const EditProductForm = ({ id }: Props) => {
    const [searchBrand, setSearchBrand] = useState("")
    const [searchCategory, setSearchCategory] = useState("")
    const [openBrand, setOpenBrand] = useState(false)
    const [openCategory, setOpenCategory] = useState(false)
    const [brand, setBrand] = useState("")
    const [category, setCategory] = useState("")

    const [filter] = useProductFilter();

    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data } = useSuspenseQuery(
        trpc.product.getOne.queryOptions({
            id,
        })
    );

    const { mutate: updateProduct, isPending } = useMutation(
        trpc.product.updateOne.mutationOptions({
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
                    trpc.product.getMany.queryOptions({
                        ...filter,
                    })
                );
                queryClient.invalidateQueries(trpc.product.getOne.queryOptions({ id }));
                router.push("/product");
            },
        })
    );

    const form = useForm<ProductSchemaType>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            name: data?.name || "",
            description: data?.description || "",
            price: data?.price.toString() || "",
            discountPrice: data?.discountPrice ? data.discountPrice.toString() : "",
            brandId: data?.brandId || "",
            stock: data?.stock.toString() || "",
            categoryId: data?.categoryId || "",
            status: data?.status as CATEGORY_STATUS || CATEGORY_STATUS.INACTIVE,
        },
    });

    const onSubmit = (data: ProductSchemaType) => {
        updateProduct({
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
                                        <Input placeholder="Product name" {...field} disabled={isPending} />
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
                                        <Textarea placeholder="Product description" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product price" {...field} disabled={isPending} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="discountPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount price</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product discount price" {...field} disabled={isPending} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Stock" {...field} disabled={isPending} type="number" />
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

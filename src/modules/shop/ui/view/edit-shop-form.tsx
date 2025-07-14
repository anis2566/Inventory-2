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

import { useTRPC } from "@/trpc/client";
import { useShopFilter } from "../../filter/use-shop-filter";
import { ShopSchema, ShopSchemaType } from "@/schema/shop";

interface Props {
    id: string;
}

export const EditShopForm = ({ id }: Props) => {
    const [filter] = useShopFilter();

    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data } = useSuspenseQuery(
        trpc.shop.getOne.queryOptions({
            id,
        })
    );

    const { mutate: updateShop, isPending } = useMutation(
        trpc.shop.updateOne.mutationOptions({
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
                    trpc.shop.getMany.queryOptions({
                        ...filter,
                    })
                );
                queryClient.invalidateQueries(trpc.shop.getOne.queryOptions({ id }));
                router.push("/shop");
            },
        })
    );

    const form = useForm<ShopSchemaType>({
        resolver: zodResolver(ShopSchema),
        defaultValues: {
            name: data?.name || "",
            address: data?.address || "",
            phone: data?.phone || "",
        },
    });

    const onSubmit = (data: ShopSchemaType) => {
        updateShop({
            id,
            ...data,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Shop</CardTitle>
                <CardDescription>Customize your shop information</CardDescription>
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
                                        <Input placeholder="Shop name" {...field} disabled={isPending} />
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Brand description" {...field} disabled={isPending} />
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
                                        <Input placeholder="Shop phone" {...field} disabled={isPending} />
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

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

import { useTRPC } from "@/trpc/client"
import { useShopFilter } from "../../filter/use-shop-filter"
import { ShopSchema, ShopSchemaType } from "@/schema/shop"

export const ShopForm = () => {
    const [filter] = useShopFilter()

    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { mutate: createShop, isPending } = useMutation(trpc.shop.createOne.mutationOptions({
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
            queryClient.invalidateQueries(
                trpc.shop.forSelect.queryOptions({
                    search: "",
                })
            );
            router.push("/shop");
        },
    }))

    const form = useForm<ShopSchemaType>({
        resolver: zodResolver(ShopSchema),
        defaultValues: {
            name: "",
            address: "",
            phone: "",
        },
    })

    const onSubmit = (data: ShopSchemaType) => {
        createShop(data)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Shop</CardTitle>
                <CardDescription>Add your brand shop below</CardDescription>
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
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Shop address" {...field} disabled={isPending} />
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
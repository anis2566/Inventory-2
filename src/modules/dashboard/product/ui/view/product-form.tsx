"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Send } from "lucide-react"
import { useMutation, useQueryClient, useSuspenseQueries } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { LoadingButton } from "@/components/loading-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button"

import { useTRPC } from "@/trpc/client"
import { CATEGORY_STATUS } from "@/constant"
import { useProductFilter } from "../../filter/use-product-filter"
import { ProductSchema, ProductSchemaType } from "@/schema/product"
import { cn } from "@/lib/utils"

export const ProductForm = () => {
    const [searchBrand, setSearchBrand] = useState("")
    const [searchCategory, setSearchCategory] = useState("")
    const [openBrand, setOpenBrand] = useState(false)
    const [openCategory, setOpenCategory] = useState(false)
    const [brand, setBrand] = useState("")
    const [category, setCategory] = useState("")

    const [filter] = useProductFilter()

    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const [brandQuery, categoryQuery] = useSuspenseQueries({
        queries: [
            {
                ...trpc.brand.forSelect.queryOptions({ search: searchBrand }),
            },
            {
                ...trpc.category.forSelect.queryOptions({ search: searchCategory }),
            }
        ]
    })

    const { mutate: createProduct, isPending } = useMutation(trpc.product.createOne.mutationOptions({
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
            queryClient.invalidateQueries(
                trpc.product.forSelect.queryOptions({
                    search: "",
                })
            );
            router.push("/product");
        },
    }))

    const form = useForm<ProductSchemaType>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            name: "",
            productCode: "",
            description: "",
            price: "",
            discountPrice: "",
            brandId: "",
            stock: "",
            categoryId: "",
            status: CATEGORY_STATUS.INACTIVE,
        },
    })

    const onSubmit = (data: ProductSchemaType) => {
        createProduct(data)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Product</CardTitle>
                <CardDescription>Add your product details below</CardDescription>
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
                            name="productCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product code" {...field} disabled={isPending} type="number" />
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
                            name="brandId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Brand</FormLabel>
                                    <Popover open={openBrand} onOpenChange={setOpenBrand}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between bg-gray-700 border-gray-700 hover:bg-gray-600 hover:border-gray-600 text-gray-400 hover:text-white",
                                                    )}
                                                    disabled={isPending}
                                                >
                                                    {brand ? brand : "Select brand"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 border-gray-600">
                                            <Command className="space-y-2 bg-gray-700 w-full min-w-[350px] p-2">
                                                <Input
                                                    type="search"
                                                    placeholder="Search brand..."
                                                    value={searchBrand}
                                                    onChange={(e) => setSearchBrand(e.target.value)}
                                                    className="w-full bg-gray-600 placeholder:text-gray-400 rounded-full text-white"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No brand found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {brandQuery?.data?.map((brand) => (
                                                            <CommandItem
                                                                value={brand.id}
                                                                key={brand.id}
                                                                onSelect={() => {
                                                                    form.setValue("brandId", brand.id);
                                                                    setBrand(brand.name);
                                                                    form.trigger("brandId");
                                                                    setOpenBrand(false);
                                                                }}
                                                                className="text-gray-400 data-[selected=true]:bg-gray-600 data-[selected=true]:text-white text-white"
                                                            >
                                                                {brand.name}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto text-white",
                                                                        brand.id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Category</FormLabel>
                                    <Popover open={openCategory} onOpenChange={setOpenCategory}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between bg-gray-700 border-gray-700 hover:bg-gray-600 hover:border-gray-600 text-gray-400 hover:text-white",
                                                    )}
                                                    disabled={isPending}
                                                >
                                                    {category ? category : "Select category"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 border-gray-600">
                                            <Command className="space-y-2 bg-gray-700 w-full min-w-[350px] p-2">
                                                <Input
                                                    type="search"
                                                    placeholder="Search category..."
                                                    value={searchCategory}
                                                    onChange={(e) => setSearchCategory(e.target.value)}
                                                    className="w-full bg-gray-600 placeholder:text-gray-400 rounded-full text-white"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No category found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {categoryQuery?.data?.map((category) => (
                                                            <CommandItem
                                                                value={category.id}
                                                                key={category.id}
                                                                onSelect={() => {
                                                                    form.setValue("categoryId", category.id);
                                                                    setCategory(category.name);
                                                                    form.trigger("categoryId");
                                                                    setOpenCategory(false);
                                                                }}
                                                                className="text-gray-400 data-[selected=true]:bg-gray-600 data-[selected=true]:text-white text-white"
                                                            >
                                                                {category.name}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto text-white",
                                                                        category.id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
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
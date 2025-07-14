"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Edit, Plus, Send, Trash2 } from "lucide-react"
import { useMutation, useQuery, useQueryClient, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { BrandSchema, BrandSchemaType } from "@/schema/brand"
import { OrderSchema, OrderSchemaType } from "@/schema/order"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ProductModal } from "./product-modal"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const OrderForm = () => {
    const [searchShop, setSearchShop] = useState("")
    const [shop, setShop] = useState("")
    const [openShop, setOpenShop] = useState(false)
    const [searchProduct, setSearchProduct] = useState("")
    const [product, setProduct] = useState("")
    const [productId, setProductId] = useState("")
    const [quantity, setQuantity] = useState("")
    const [price, setPrice] = useState("")
    const [openProduct, setOpenProduct] = useState(false)

    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    // const { mutate: createBrand, isPending } = useMutation(trpc.brand.createOne.mutationOptions({
    //     onError: (error) => {
    //         toast.error(error.message);
    //     },
    //     onSuccess: (data) => {
    //         if (!data.success) {
    //             toast.error(data.message);
    //             return;
    //         }
    //         toast.success(data.message);
    //         queryClient.invalidateQueries(
    //             trpc.brand.getMany.queryOptions({
    //                 ...filter,
    //             })
    //         );
    //         queryClient.invalidateQueries(
    //             trpc.brand.forSelect.queryOptions({
    //                 search: "",
    //             })
    //         );
    //         router.push("/brand");
    //     },
    // }))

    const [shopQuery, productQuery] = useSuspenseQueries({
        queries: [
            {
                ...trpc.shop.forSelect.queryOptions({ search: searchShop }),
            },
            {
                ...trpc.product.forSelect.queryOptions({ search: searchProduct }),
            }
        ]
    })

    const form = useForm<OrderSchemaType>({
        resolver: zodResolver(OrderSchema),
        defaultValues: {
            shopId: "",
            products: []
        }
    })

    const handleAddProduct = () => {
        if (!productId || !quantity || !price || !product) return

        if (form.getValues().products.some((item) => item.productId === productId)) {
            toast.error("Product already added")
            return
        }

        const products = form.getValues().products.filter((item) => item.productId !== productId)

        form.setValue("products", [...form.getValues().products, { quantity, productId, price, name: product }])

        form.trigger("products")
        setProductId("")
        setSearchProduct("")
        setProduct("")
        setQuantity("")
    }

    const handleRemoveProduct = (id: string) => {
        const updatedProducts = form.getValues().products.filter(
            (item) => item.productId !== id
        );

        console.log(updatedProducts)

        form.setValue("products", updatedProducts);
        form.trigger("products");
    };

    const handleQuantityChange = (id: string, value: string) => {
        form.setValue("products", form.getValues().products.map((item) => {
            if (item.productId === id) {
                return {
                    ...item,
                    quantity: value
                }
            }
            return item
        }))
    }



    const onSubmit = (data: OrderSchemaType) => {
        // createBrand(data)
    }

    const isPending = false;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Order</CardTitle>
                <CardDescription>Add your order details below</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="shopId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Shop</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between bg-gray-700 border-gray-700 hover:bg-gray-600 hover:border-gray-600 text-white hover:text-white",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    disabled={isPending}
                                                >
                                                    {shop ? shop : "Select shop"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Command className="space-y-4 bg-gray-700 w-[330px] px-3 py-1">
                                                <Input
                                                    type="search"
                                                    placeholder="Search category..."
                                                    value={searchShop}
                                                    onChange={(e) => setSearchShop(e.target.value)}
                                                    className="w-full bg-gray-600 placeholder:text-gray-400 rounded-full text-white"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No shop found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {shopQuery?.data?.map((shop) => (
                                                            <CommandItem
                                                                value={shop.id}
                                                                key={shop.id}
                                                                onSelect={() => {
                                                                    form.setValue("shopId", shop.id);
                                                                    setShop(shop.name);
                                                                    form.trigger("shopId");
                                                                    setOpenShop(false);
                                                                }}
                                                                className="text-gray-400 data-[selected=true]:bg-gray-600 data-[selected=true]:text-white text-white"
                                                            >
                                                                {shop.name}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto text-white",
                                                                        shop.id === field.value
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

                        <div className="space-y-2 border border-gray-600 p-2">
                            <h1>Product Form</h1>
                            {/* <FormField
                                    control={form.control}
                                    name={`variants.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}

                            <Popover open={openShop} onOpenChange={setOpenShop}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between bg-gray-700 border-gray-700 hover:bg-gray-600 hover:border-gray-600 text-white hover:text-white",
                                            )}
                                            disabled={isPending}
                                        >
                                            {product ? product : "Select product"}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Command className="space-y-4 bg-gray-700 w-[330px] px-3 py-1">
                                        <Input
                                            type="search"
                                            placeholder="Search product..."
                                            value={searchProduct}
                                            onChange={(e) => setSearchProduct(e.target.value)}
                                            className="w-full bg-gray-600 placeholder:text-gray-400 rounded-full text-white"
                                        />
                                        <CommandList>
                                            <CommandEmpty>No product found.</CommandEmpty>
                                            <CommandGroup>
                                                {productQuery?.data?.map((p) => (
                                                    <CommandItem
                                                        value={p.id}
                                                        key={p.id}
                                                        onSelect={() => {
                                                            setProduct(p.name);
                                                            setProductId(p.id);
                                                            setPrice(p.price.toString());
                                                            setOpenProduct(false);
                                                        }}
                                                        className="text-gray-400 data-[selected=true]:bg-gray-600 data-[selected=true]:text-white text-white"
                                                    >
                                                        {p.name}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto text-white",
                                                                p.name === product
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

                            <Input type="number" placeholder="Quantity" className="mt-2" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                            <Button variant="gray" type="button" onClick={() => handleAddProduct()}>
                                <Plus className="h-4 w-4" />
                                Add
                            </Button>
                        </div>

                        <div className="space-y-2 border border-gray-600 p-2">
                            <h1 className="text-white">Product List</h1>
                            <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-700">
                                    <TableHead className="w-[100px]">Product</TableHead>
                                    <TableHead className="w-[100px]">Quantity</TableHead>
                                    <TableHead className="w-[100px]">Total</TableHead>
                                    <TableHead className="w-[100px]">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    form.watch().products.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell className="flex items-center gap-2">
                                                <Input type="number" value={product.quantity} onChange={(e) => handleQuantityChange(product.productId, e.target.value)} className="min-w-[60px]" />
                                            </TableCell>
                                            <TableCell>{Number(product.price) * Number(product.quantity)}</TableCell>
                                            <TableCell>
                                                <Button variant="gray" size="icon" type="button" onClick={() => handleRemoveProduct(product.productId)}>
                                                    <Trash2 className="h-4 w-4 text-rose-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow className="bg-gray-700">
                                    <TableHead className="w-[100px]" colSpan={2}>Total</TableHead>
                                    <TableHead className="w-[100px]">{form.watch().products.reduce((total, product) => total + Number(product.quantity) * Number(product.price), 0)}</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableFooter>
                        </Table>
                        </div>

                        <LoadingButton
                            type="submit"
                            title="Submit"
                            loadingTitle="Submitting..."
                            isLoading={false}
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
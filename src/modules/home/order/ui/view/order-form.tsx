"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Plus, PlusCircle, Send, Trash2 } from "lucide-react"
import { useMutation, useQueryClient, useSuspenseQueries } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { LoadingButton } from "@/components/loading-button"
import { Input } from "@/components/ui/input"
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
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { useTRPC } from "@/trpc/client"
import { OrderSchema, OrderSchemaType } from "@/schema/order"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useCreateShop } from "@/hooks/use-shop"
import { useOrderFilter } from "../../filter/use-order-filter"

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

    const [filter] = useOrderFilter()

    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const { onOpen } = useCreateShop()

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

    const { mutate: createOrder, isPending } = useMutation(trpc.order.createOne.mutationOptions({
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
                trpc.order.getManyBySr.queryOptions({
                    ...filter,
                })
            );
            router.push("/order");
        },
    }))

    const form = useForm<OrderSchemaType>({
        resolver: zodResolver(OrderSchema),
        defaultValues: {
            shopId: "",
            orderItems: []
        }
    })

    const handleAddProduct = () => {
        if (!productId || !quantity || !price || !product) return

        if (form.getValues().orderItems.some((item) => item.productId === productId)) {
            toast.error("Product already added")
            return
        }

        form.setValue("orderItems", [...form.getValues().orderItems, { quantity, productId, price, name: product }])

        form.trigger("orderItems")
        setProductId("")
        setSearchProduct("")
        setProduct("")
        setQuantity("")
    }

    const handleRemoveProduct = (id: string) => {
        const updatedProducts = form.getValues().orderItems.filter(
            (item) => item.productId !== id
        );

        form.setValue("orderItems", updatedProducts);
        form.trigger("orderItems");
    };

    const handleQuantityChange = (id: string, value: string) => {
        form.setValue("orderItems", form.getValues().orderItems.map((item) => {
            if (item.productId === id) {
                return {
                    ...item,
                    quantity: value
                }
            }
            return item
        }))
    }

    const handlePriceChange = (id: string, value: string) => {
        form.setValue("orderItems", form.getValues().orderItems.map((item) => {
            if (item.productId === id) {
                return {
                    ...item,
                    price: value
                }
            }
            return item
        }))
    }

    const onSubmit = (data: OrderSchemaType) => {
        createOrder(data)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Order</CardTitle>
            </CardHeader>
            <CardContent className="p-1 md:p-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="shopId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Shop</FormLabel>
                                    <Popover open={openShop} onOpenChange={setOpenShop}>
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
                                                    {shop ? shop : "Select shop"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 border-gray-600">
                                            <Command className="space-y-2 bg-gray-700 w-full min-w-[350px] p-2">
                                                <div className="flex items-center gap-x-3">
                                                    <Input
                                                        type="search"
                                                        placeholder="Search category..."
                                                        value={searchShop}
                                                        onChange={(e) => setSearchShop(e.target.value)}
                                                        className="w-full bg-gray-600 placeholder:text-gray-400 rounded-full text-white"
                                                    />
                                                    <Button size="icon" variant="gray" type="button" onClick={onOpen}>
                                                        <PlusCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
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
                            <h1 className="text-gray-400">Product Form</h1>
                            <Popover open={openProduct} onOpenChange={setOpenProduct}>
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
                                            {product ? product : "Select product"}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0 border-gray-600">
                                    <Command className="space-y-2 bg-gray-700 w-full min-w-[350px] p-2">
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
                                                        <span className="mr-2 min-h-5 min-w-5 rounded-full bg-gray-400 flex items-center justify-center">{p.productCode}</span>
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

                            <Button variant="gray" type="button" onClick={() => handleAddProduct()} disabled={!product || !quantity || !price || isPending}>
                                <Plus className="h-4 w-4" />
                                Add
                            </Button>
                        </div>

                        <div className="space-y-2 border border-gray-600 p-2">
                            <h1 className="text-gray-400">Product List</h1>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-700 border-gray-600">
                                        <TableHead className="w-[100px]">Product</TableHead>
                                        <TableHead className="w-[100px]">Price</TableHead>
                                        <TableHead className="w-[100px]">Quantity</TableHead>
                                        <TableHead className="w-[100px]">Total</TableHead>
                                        <TableHead className="w-[100px]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        form.watch().orderItems.map((product, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>
                                                    <Input type="number" value={product.price} onChange={(e) => handlePriceChange(product.productId, e.target.value)} className="min-w-[80px]" />
                                                </TableCell>
                                                <TableCell className="flex items-center gap-2">
                                                    <Input type="number" value={product.quantity} onChange={(e) => handleQuantityChange(product.productId, e.target.value)} className="min-w-[70px]" />
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
                                <TableFooter className={cn("", form.watch().orderItems.length === 0 && "hidden")}>
                                    <TableRow className="bg-gray-700">
                                        <TableHead className="w-[100px]" colSpan={3}>Total</TableHead>
                                        <TableHead className="w-[100px]">{form.watch().orderItems.reduce((total, product) => total + Number(product.quantity) * Number(product.price), 0)}</TableHead>
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
                            disabled={form.watch().orderItems.length === 0}
                            icon={Send}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Plus, Send, Trash2 } from "lucide-react"
import { useMutation, useQueryClient, useSuspenseQueries } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl } from "@/components/ui/form"
import { LoadingButton } from "@/components/loading-button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { useOutgoingFilter } from "../../filter/use-outgoing-filter"
import { OutgoingSchema, OutgoingSchemaType } from "@/schema/outgoing"
import { cn } from "@/lib/utils"

interface Props {
    id: string
}

export const EditOutgoingForm = ({ id }: Props) => {
    const [searchProduct, setSearchProduct] = useState("")
    const [product, setProduct] = useState("")
    const [productId, setProductId] = useState("")
    const [quantity, setQuantity] = useState("")
    const [price, setPrice] = useState("")
    const [openProduct, setOpenProduct] = useState(false)

    const [filter] = useOutgoingFilter()

    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const [outgoingQuery, productQuery] = useSuspenseQueries({
        queries: [
            {
                ...trpc.outgoing.getOne.queryOptions({ id }),
            },
            {
                ...trpc.product.forSelect.queryOptions({ search: searchProduct }),
            },
        ]
    })

    const { mutate: updateOutgoing, isPending } = useMutation(trpc.outgoing.updateOne.mutationOptions({
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
                trpc.outgoing.getMany.queryOptions({
                    ...filter,
                })
            );
            router.push("/dashboard/outgoing");
        },
    }))

    const form = useForm<OutgoingSchemaType>({
        resolver: zodResolver(OutgoingSchema),
        defaultValues: {
            items: outgoingQuery?.data?.items?.map((item) => ({ quantity: item.quantity.toString(), productId: item.productId, name: item.product?.name })) || [],
        },
    })

    const handleAddProduct = () => {
        if (!productId || !quantity || !price || !product) return

        if (form.getValues().items.some((item) => item.productId === productId)) {
            toast.error("Product already added")
            return
        }

        form.setValue("items", [...form.getValues().items, { quantity, productId, name: product, price }])

        form.trigger("items")
        setProductId("")
        setSearchProduct("")
        setProduct("")
        setQuantity("")
    }

    const handleRemoveProduct = (id: string) => {
        const updatedProducts = form.getValues().items.filter(
            (item) => item.productId !== id
        );

        form.setValue("items", updatedProducts);
        form.trigger("items");
    };

    const handleQuantityChange = (id: string, value: string) => {
        form.setValue("items", form.getValues().items.map((item) => {
            if (item.productId === id) {
                return {
                    ...item,
                    quantity: value
                }
            }
            return item
        }))
    }

    const onSubmit = (data: OutgoingSchemaType) => {
        updateOutgoing({
            id,
            ...data
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Outgoing</CardTitle>
                <CardDescription>Customize your outgoing</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                        <TableHead className="w-[100px]">Total</TableHead>
                                        <TableHead className="w-[100px]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        form.watch().items.map((product, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>
                                                    <Input type="number" value={product.quantity} onChange={(e) => handleQuantityChange(product.productId, e.target.value)} className="min-w-[70px]" />
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" type="button" onClick={() => handleRemoveProduct(product.productId)} className="hover:bg-gray-700">
                                                        <Trash2 className="h-4 w-4 text-rose-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                                <TableFooter className={cn("", form.watch().items.length === 0 && "hidden")}>
                                    <TableRow className="bg-gray-700">
                                        <TableCell>Total</TableCell>
                                        <TableCell colSpan={2}>
                                            {form.watch().items.reduce((acc, item) => acc + Number(item.quantity), 0)}
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>

                        <LoadingButton
                            type="submit"
                            title="Update"
                            loadingTitle="Updating..."
                            isLoading={isPending}
                            onClick={form.handleSubmit(onSubmit)}
                            variant="gray"
                            disabled={form.watch().items.length === 0}
                            icon={Send}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
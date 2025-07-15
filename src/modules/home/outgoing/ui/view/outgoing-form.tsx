"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Plus, Send, Trash2 } from "lucide-react"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
import { useOutgoingFilter } from "../../filter/use-outgoing-filter"
import { OutgoingSchema, OutgoingSchemaType } from "@/schema/outgoing"
import { useState } from "react"
import { cn } from "@/lib/utils"

export const OutgoingForm = () => {
    const [searchProduct, setSearchProduct] = useState("")
    const [product, setProduct] = useState<string>("")
    const [openProduct, setOpenProduct] = useState(false)
    const [productId, setProductId] = useState<string>("")
    const [quantity, setQuantity] = useState("")

    const [filter] = useOutgoingFilter()

    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { data } = useSuspenseQuery(trpc.product.forSelect.queryOptions({ search: searchProduct }));

    const { mutate: createOutgoing, isPending } = useMutation(trpc.outgoing.createOne.mutationOptions({
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
            queryClient.invalidateQueries(
                trpc.outgoing.forSelect.queryOptions({
                    search: "",
                })
            );
            router.push("/outgoing");
        },
    }))

    const form = useForm<OutgoingSchemaType>({
        resolver: zodResolver(OutgoingSchema),
        defaultValues: {
            items: []
        },
    })

    const handleAddProduct = () => {
        if (!productId || !quantity) return

        if (form.getValues().items.some((item) => item.productId === productId)) {
            toast.error("Product already added")
            return
        }

        form.setValue("items", [...form.getValues().items, { quantity, productId, name: product }])

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

    const onSubmit = (data: OutgoingSchemaType) => {
        createOutgoing(data)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Outgoing</CardTitle>
                <CardDescription>Add your outgoing details below</CardDescription>
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
                                                {data?.map((p) => (
                                                    <CommandItem
                                                        value={p.id}
                                                        key={p.id}
                                                        onSelect={() => {
                                                            setProduct(p.name);
                                                            setProductId(p.id);
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

                            <Button variant="gray" type="button" onClick={() => handleAddProduct()} disabled={!productId || !quantity || isPending}>
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
                                                <TableCell>{product.quantity}</TableCell>
                                                <TableCell>
                                                    <Button variant="gray" size="icon" type="button" onClick={() => handleRemoveProduct(product.productId)}>
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
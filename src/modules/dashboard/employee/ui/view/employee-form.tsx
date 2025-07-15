"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Send, Trash2 } from "lucide-react"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { LoadingButton } from "@/components/loading-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { useEmployeeFilter } from "../../filter/use-employee-filter"
import { EmployeeSchema, EmployeeSchemaType } from "@/schema/employee"
import { UploadButton } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"

export const EmployeeForm = () => {
    const [searchUser, setSearchUser] = useState<string>("")
    const [user, setUser] = useState<string>("")
    const [openUser, setOpenUser] = useState<boolean>(false)

    const [filter] = useEmployeeFilter()

    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { data } = useSuspenseQuery(trpc.user.forSelect.queryOptions({ search: searchUser }))

    const { mutate: createEmployee, isPending } = useMutation(trpc.employee.createOne.mutationOptions({
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
                trpc.employee.getMany.queryOptions({
                    ...filter,
                })
            );
            queryClient.invalidateQueries(
                trpc.employee.forSelect.queryOptions({
                    search: "",
                })
            );
            router.push("/dashboard/employee");
        },
    }))

    const form = useForm<EmployeeSchemaType>({
        resolver: zodResolver(EmployeeSchema),
        defaultValues: {
            userId: "",
            name: "",
            phone: "",
            avatar: "",
            address: "",
            nid: "",
            status: CATEGORY_STATUS.ACTIVE
        },
    })

    const onSubmit = (data: EmployeeSchemaType) => {
        createEmployee(data)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Employee</CardTitle>
                <CardDescription>Add your employee details below</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>User</FormLabel>
                                    <Popover open={openUser} onOpenChange={setOpenUser}>
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
                                                    {user ? user : "Select user"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 border-gray-600">
                                            <Command className="space-y-2 bg-gray-700 w-full min-w-[350px] p-2">
                                                <Input
                                                    type="search"
                                                    placeholder="Search brand..."
                                                    value={searchUser}
                                                    onChange={(e) => setSearchUser(e.target.value)}
                                                    className="w-full bg-gray-600 placeholder:text-gray-400 rounded-full text-white"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No brand found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {data?.map((user) => (
                                                            <CommandItem
                                                                value={user.id}
                                                                key={user.id}
                                                                onSelect={() => {
                                                                    form.setValue("userId", user.id);
                                                                    setUser(user.name);
                                                                    form.trigger("userId");
                                                                    setOpenUser(false);
                                                                }}
                                                                className="text-gray-400 data-[selected=true]:bg-gray-600 data-[selected=true]:text-white text-white flex justify-between items-center"
                                                            >
                                                                <Avatar>
                                                                    <AvatarImage src={user.avatar || ""} />
                                                                    <AvatarFallback>{user.name}</AvatarFallback>
                                                                </Avatar>
                                                                {user.name}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto text-white",
                                                                        user.id === field.value
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Employee name" {...field} disabled={isPending} />
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
                                        <Input placeholder="Employee phone" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nid</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Employee nid" {...field} disabled={isPending} />
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
                                        <Textarea placeholder="Employee address" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avatar</FormLabel>
                                    {form.watch("avatar") ? (
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarImage src={form.getValues("avatar")} />
                                            </Avatar>
                                            <Button
                                                type="button"
                                                onClick={() => form.setValue("avatar", "")}
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0"
                                                disabled={isPending}
                                            >
                                                <Trash2 className="w-5 h-5 text-rose-500" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                field.onChange(res[0].ufsUrl);
                                                toast.success("Image uploaded");
                                            }}
                                            onUploadError={() => {
                                                toast.error("Image upload failed");
                                            }}
                                            disabled={isPending}
                                        />
                                    )}
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
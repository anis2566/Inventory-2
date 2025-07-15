"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send, Trash2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { LoadingButton } from "@/components/loading-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { useTRPC } from "@/trpc/client"
import { CATEGORY_STATUS } from "@/constant"
import { useEmployeeFilter } from "../../filter/use-employee-filter"
import { EmployeeSchema, EmployeeSchemaType } from "@/schema/employee"
import { UploadButton } from "@/lib/uploadthing"

export const EmployeeForm = () => {
    const [filter] = useEmployeeFilter()

    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()

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
            router.push("/employee");
        },
    }))

    const form = useForm<EmployeeSchemaType>({
        resolver: zodResolver(EmployeeSchema),
        defaultValues: {
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
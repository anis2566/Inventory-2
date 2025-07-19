"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { LoadingButton } from "@/components/loading-button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

import { useTRPC } from "@/trpc/client"
import { EXPENSE_TYPE, MONTHS } from "@/constant"
import { useExpenseFilter } from "../../filter/use-expense-filter"
import { ExpenseSchema, ExpenseSchemaType } from "@/schema/expense"

export const ExpenseForm = () => {
    const [showCustomType, setShowCustomType] = useState(false)

    const [filter] = useExpenseFilter()

    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { mutate: createExpense, isPending } = useMutation(trpc.expense.createOne.mutationOptions({
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
                trpc.expense.getMany.queryOptions({
                    ...filter,
                })
            );
            router.push("/dashboard/expense");
        },
    }))

    const form = useForm<ExpenseSchemaType>({
        resolver: zodResolver(ExpenseSchema),
        defaultValues: {
            type: undefined,
            month: Object.values(MONTHS)[new Date().getMonth()],
            amount: "",
        },
    })

    const onSubmit = (data: ExpenseSchemaType) => {
        createExpense(data)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Expense</CardTitle>
                <CardDescription>Add your expense details below</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select
                                        onValueChange={value => {
                                            if (value === EXPENSE_TYPE.Other) {
                                                setShowCustomType(true)
                                            } else {
                                                setShowCustomType(false)
                                                field.onChange(value)
                                            }
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(EXPENSE_TYPE).map((type) => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Collapsible open={showCustomType}>
                            <CollapsibleContent>
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Custom Type</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Custom Type" {...field} disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        <FormField
                            control={form.control}
                            name="month"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Month</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a month" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(MONTHS).map((month) => (
                                                    <SelectItem key={month} value={month}>{month}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Amount"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            disabled={isPending}
                                            type="number"
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
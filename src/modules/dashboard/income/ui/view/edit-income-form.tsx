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
} from "@/components/ui/form";
import { LoadingButton } from "@/components/loading-button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

import { useTRPC } from "@/trpc/client";
import { INCOME_TYPE, MONTHS } from "@/constant";
import { useIncomeFilter } from "../../filter/use-income-filter";
import { IncomeSchema, IncomeSchemaType } from "@/schema/income";
import { useState } from "react";

interface Props {
    id: string;
}

export const EditIncomeForm = ({ id }: Props) => {
    const [showCustomType, setShowCustomType] = useState(false)

    const [filter] = useIncomeFilter();

    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data } = useSuspenseQuery(
        trpc.income.getOne.queryOptions({
            id,
        })
    );

    const { mutate: updateIncome, isPending } = useMutation(
        trpc.income.updateOne.mutationOptions({
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
                    trpc.income.getMany.queryOptions({
                        ...filter,
                    })
                );
                queryClient.invalidateQueries(trpc.income.getOne.queryOptions({ id }));
                router.push("/dashboard/income");
            },
        })
    );

    const form = useForm<IncomeSchemaType>({
        resolver: zodResolver(IncomeSchema),
        defaultValues: {
            type: data?.type as INCOME_TYPE || "",
            amount: data?.amount.toString() || "0",
            month: data?.month.toString() as MONTHS || undefined,
        },
    });

    const onSubmit = (data: IncomeSchemaType) => {
        updateIncome({
            id,
            ...data,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Income</CardTitle>
                <CardDescription>Customize your income information</CardDescription>
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
                                            if (value === INCOME_TYPE.Other) {
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
                                                Object.values(INCOME_TYPE).map((type) => (
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

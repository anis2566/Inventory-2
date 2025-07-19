"use client";

import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";

import { useTRPC } from "@/trpc/client";
import { useSummaryFilter } from "../../filter/use-summary-filter";

export const SummaryView = () => {
    const [date, setDate] = useState<Date>()

    const [filter, setFilter] = useSummaryFilter()

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(trpc.order.summaryBySr.queryOptions({
        ...filter
    }));

    const parseDate = (value?: string) => {
        const date = value ? new Date(value) : null
        return date && !isNaN(date.getTime()) ? date : null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Order Summary</CardTitle>
                <CardDescription>
                    {format(parseDate(filter.date) ?? new Date(), "yyyy-MM-dd")}
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2 space-y-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="gray"
                            data-empty={!date}
                            className="text-gray-400 w-[200px] justify-start text-left font-normal"
                        >
                            <CalendarIcon />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-700 text-white border-gray-600">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(value) => {
                                if (value) {
                                    const fixedDate = new Date(value);
                                    fixedDate.setHours(12, 0, 0, 0);
                                    setDate(fixedDate);
                                    setFilter({ date: fixedDate.toISOString() });
                                }
                            }}
                        />
                    </PopoverContent>
                </Popover>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-700">
                            <TableHead>SL</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>F. Quantity</TableHead>
                            <TableHead>T. Quantity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data?.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>{order.freeQuantity}</TableCell>
                                    <TableCell>{order.quantity + order.freeQuantity}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
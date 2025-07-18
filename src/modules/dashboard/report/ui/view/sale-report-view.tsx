"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useTRPC } from "@/trpc/client";
import Filter from "./filter";
import { useSaleReportFilter } from "../../filter/use-sale-report-filter";


export const SaleReportView = () => {
    const [filter] = useSaleReportFilter()

    const trpc = useTRPC()

    const { data } = useSuspenseQuery(trpc.report.sale.queryOptions({
        ...filter
    }));


    return (
        <Card>
            <CardHeader>
                <CardTitle>Sale Report</CardTitle>
                <CardDescription>{format(new Date(), "dd MMM yyyy")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Filter />

                <div className="space-y-4">
                    {
                        data?.map((item, index) => (
                            <Accordion type="single" collapsible key={index} className="bg-gray-700/80 p-2">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger defaultChecked={index === 0}>{item.employeeName}</AccordionTrigger>
                                    <AccordionContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-700 border-gray-600">
                                                    <TableHead>Product Name</TableHead>
                                                    <TableHead>Price</TableHead>
                                                    <TableHead>Quantity</TableHead>
                                                    <TableHead>T. Amount</TableHead>
                                                    <TableHead>R. Quantity</TableHead>
                                                    <TableHead>R. Amount</TableHead>
                                                    <TableHead>Net Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {item.items.map((i) => (
                                                    <TableRow key={i.productName}>
                                                        <TableCell>{i.productName}</TableCell>
                                                        <TableCell className="font-bengali tracking-wider">৳{i.price}</TableCell>
                                                        <TableCell>{i.totalQuantity}</TableCell>
                                                        <TableCell className="font-bengali tracking-wider">৳{i.totalAmount}</TableCell>
                                                        <TableCell>{i.returnedQuantity}</TableCell>
                                                        <TableCell className="font-bengali tracking-wider">৳{i.returnedQuantity * i.price}</TableCell>
                                                        <TableCell className="font-bengali tracking-wider">৳{i.totalAmount - i.returnedQuantity * i.price}</TableCell>

                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow className="bg-gray-800 font-semibold text-white">
                                                    <TableCell colSpan={2}>Total</TableCell>
                                                    <TableCell>
                                                        {item.items.reduce((acc, i) => acc + i.totalQuantity, 0)}
                                                    </TableCell>
                                                    <TableCell className="font-bengali tracking-wider">
                                                        ৳{item.items.reduce((acc, i) => acc + i.totalAmount, 0)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.items.reduce((acc, i) => acc + i.returnedQuantity, 0)}
                                                    </TableCell>
                                                    <TableCell className="font-bengali tracking-wider">
                                                        ৳{item.items.reduce((acc, i) => acc + i.returnedQuantity * i.price, 0)}
                                                    </TableCell>
                                                    <TableCell className="font-bengali tracking-wider">
                                                        ৳{item.items.reduce((acc, i) => acc + (i.totalAmount - i.returnedQuantity * i.price), 0)}
                                                    </TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    )
}
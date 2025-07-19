"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useTRPC } from "@/trpc/client";
import Filter from "./filter";
import { useProductReportFilter } from "../../filter/use-product-report-filter";


export const ProductReportView = () => {
    const [filter] = useProductReportFilter()

    const trpc = useTRPC()

    const { data } = useSuspenseQuery(trpc.report.product.queryOptions({
        ...filter
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Report</CardTitle>
                <CardDescription>{format(new Date(), "dd MMM yyyy")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Filter />
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-700 border-gray-600">
                            <TableHead>Product Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>T. Amount</TableHead>
                            <TableHead>R. Quantity</TableHead>
                            <TableHead>R. Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(item => (
                            <TableRow key={item.productName}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell className="font-bengali tracking-wider">৳{item.price}</TableCell>
                                <TableCell>{item.totalQuantity}</TableCell>
                                <TableCell className="font-bengali tracking-wider">৳{item.totalAmount}</TableCell>
                                <TableCell>{item.returnedQuantity}</TableCell>
                                <TableCell className="font-bengali tracking-wider">৳{item.price * item.returnedQuantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow className="bg-gray-900 font-semibold text-white">
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell>{data.reduce((total, item) => total + item.totalQuantity, 0)}</TableCell>
                            <TableCell className="font-bengali tracking-wider">৳{data.reduce((total, item) => total + item.totalAmount, 0)}</TableCell>
                            <TableCell>{data.reduce((total, item) => total + item.returnedQuantity, 0)}</TableCell>
                            <TableCell className="font-bengali tracking-wider">৳{data.reduce((total, item) => total + item.price * item.returnedQuantity, 0)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    )
}
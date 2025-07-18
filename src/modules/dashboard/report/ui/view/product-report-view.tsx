"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
                            <TableHead>Amount</TableHead>
                            <TableHead>Returned Quantity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(item => (
                            <TableRow key={item.productName}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.totalQuantity}</TableCell>
                                <TableCell>{item.totalAmount}</TableCell>
                                <TableCell>{item.returnedQuantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
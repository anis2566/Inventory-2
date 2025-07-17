"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarDays, Clock, CreditCard, Package, TrendingUp, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useTRPC } from "@/trpc/client";

interface Props {
    id: string
}

export function OutgoingDetails({ id }: Props) {
    const trpc = useTRPC();

    const { data: outgoing } = useSuspenseQuery(trpc.outgoing.getOneBySr.queryOptions({ id }));

    const totalItems = outgoing?.items?.length || 0;
    const totalQuantity = outgoing?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const averageQuantityPerItem = totalItems > 0 ? Math.round(totalQuantity / totalItems) : 0;

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Outgoing Details</h1>
                        <p className="text-gray-400 mt-1">Outgoing #{outgoing?.id.slice(0, 6)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Outgoing Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Outgoing Items */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Outgoing Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-700 hover:bg-gray-600 border-gray-600">
                                            <TableHead className="text-gray-300 font-medium">Product</TableHead>
                                            <TableHead className="text-gray-300 font-medium">Product Code</TableHead>
                                            <TableHead className="text-gray-300 font-medium text-center">Quantity</TableHead>
                                            <TableHead className="text-gray-300 font-medium text-right">Unit Price</TableHead>
                                            <TableHead className="text-gray-300 font-medium text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {outgoing?.items?.map((item) => {
                                            const itemTotal = item.product.price * item.quantity;
                                            return (
                                                <TableRow key={item.id} className="border-gray-600 hover:bg-gray-750">
                                                    <TableCell className="font-medium text-white">
                                                        <div>
                                                            <p className="font-medium">{item.product.name}</p>
                                                            {item.product.description && (
                                                                <p className="text-gray-400 text-sm truncate max-w-xs">
                                                                    {item.product.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-300">
                                                        {item.product.productCode || 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="text-center text-gray-300">
                                                        <Badge className="bg-gray-700 text-white border-gray-600">
                                                            {item.quantity}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right text-gray-300 font-bengali">
                                                        ৳{item.product.price.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-right text-white font-medium font-bengali">
                                                        ৳{itemTotal.toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Financial Summary */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Financial Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Total Value</span>
                                    <span className="text-white font-medium font-bengali">৳{outgoing?.total?.toLocaleString() || '0'}</span>
                                </div>
                                <Separator className="bg-gray-600" />
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Grand Total</span>
                                    <span className="text-white font-semibold text-lg font-bengali">৳{outgoing?.total?.toLocaleString() || '0'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Employee Information */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Employee Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">Employee Name</p>
                                        <p className="text-white font-medium">{outgoing?.employee?.name || 'N/A'}</p>
                                    </div>
                                    {outgoing?.employee?.phone && (
                                        <div>
                                            <p className="text-gray-400 text-sm">Phone</p>
                                            <p className="text-white font-medium">{outgoing.employee.phone}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Outgoing Summary Sidebar */}
                    <div className="space-y-6">
                        {/* Outgoing Timeline */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-white font-medium">Outgoing Created</p>
                                            <p className="text-gray-400 text-sm flex items-center gap-1">
                                                <CalendarDays className="w-4 h-4" />
                                                {format(outgoing?.createdAt || new Date(), 'PPP')}
                                            </p>
                                            <p className="text-gray-400 text-sm flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {format(outgoing?.createdAt || new Date(), 'p')}
                                            </p>
                                        </div>
                                    </div>
                                    {outgoing?.updatedAt && outgoing.updatedAt !== outgoing.createdAt && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <div>
                                                <p className="text-white font-medium">Last Updated</p>
                                                <p className="text-gray-400 text-sm flex items-center gap-1">
                                                    <CalendarDays className="w-4 h-4" />
                                                    {format(outgoing.updatedAt, 'PPP')}
                                                </p>
                                                <p className="text-gray-400 text-sm flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {format(outgoing.updatedAt, 'p')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                                        <p className="text-2xl font-bold text-white">{totalItems}</p>
                                        <p className="text-gray-400 text-sm">Items</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                                        <p className="text-2xl font-bold text-white">{totalQuantity}</p>
                                        <p className="text-gray-400 text-sm">Total Qty</p>
                                    </div>
                                </div>
                                <div className="text-center p-3 bg-gray-700 rounded-lg">
                                    <p className="text-2xl font-bold text-white">{averageQuantityPerItem}</p>
                                    <p className="text-gray-400 text-sm">Avg Qty/Item</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Categories */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Product Categories</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {outgoing?.items?.reduce((acc, item) => {
                                    const categoryName = item.product.category?.name || 'Uncategorized';
                                    const existing = acc.find(cat => cat.name === categoryName);
                                    if (existing) {
                                        existing.count += item.quantity;
                                    } else {
                                        acc.push({ name: categoryName, count: item.quantity });
                                    }
                                    return acc;
                                }, [] as { name: string; count: number }[])?.map((category) => (
                                    <div key={category.name} className="flex justify-between items-center">
                                        <span className="text-gray-300">{category.name}</span>
                                        <Badge className="bg-gray-700 text-white border-gray-600">
                                            {category.count}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, CreditCard, MapPin, Package, User } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { ORDER_STATUS } from "@/constant";
import { useTRPC } from "@/trpc/client";

interface OrderDetailsProps {
    id: string
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case ORDER_STATUS.Delivered:
            return 'bg-green-600 hover:bg-green-700';
        case ORDER_STATUS.Placed:
            return 'bg-yellow-600 hover:bg-yellow-700';
        case ORDER_STATUS.Shipped:
            return 'bg-blue-600 hover:bg-blue-700';
        case ORDER_STATUS.Cancelled:
            return 'bg-red-600 hover:bg-red-700';
        default:
            return 'bg-gray-600 hover:bg-gray-700';
    }
};

export const OrderDetails = ({ id }: OrderDetailsProps) => {
    const trpc = useTRPC();

    const { data: order } = useSuspenseQuery(trpc.order.getOne.queryOptions({ id }));

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Order Details</h1>
                    </div>
                    <Badge className={`${getStatusColor(order?.status as string)} text-white px-4 py-2 text-sm font-medium`}>
                        {order?.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-700 hover:bg-gray-600 border-gray-600">
                                            <TableHead className="text-gray-300 font-medium">Product</TableHead>
                                            <TableHead className="text-gray-300 font-medium">SKU</TableHead>
                                            <TableHead className="text-gray-300 font-medium text-center">Quantity</TableHead>
                                            <TableHead className="text-gray-300 font-medium text-right">Unit Price</TableHead>
                                            <TableHead className="text-gray-300 font-medium text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order?.orderItems.map((item) => (
                                            <TableRow key={item.id} className="border-gray-600 hover:bg-gray-750">
                                                <TableCell className="font-medium text-white">
                                                    <div>
                                                        <p className="font-medium">{item.product.name}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-300">
                                                    {item.product.productCode || 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-center text-gray-300">
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell className="text-right text-gray-300 font-bengali tracking-wider">
                                                    ৳{item.price}
                                                </TableCell>
                                                <TableCell className="text-right text-white font-medium font-bengali tracking-wider">
                                                    ৳{item.total}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Shop Information */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Shop Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">Shop Name</p>
                                        <p className="text-white font-medium">{order?.shop.name}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-gray-400 text-sm">Address</p>
                                        <p className="text-white font-medium">{order?.shop?.address}</p>
                                    </div>
                                    {order?.shop.phone && (
                                        <div>
                                            <p className="text-gray-400 text-sm">Phone</p>
                                            <p className="text-white font-medium">{order?.shop.phone}</p>
                                        </div>
                                    )}
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
                                        <p className="text-white font-medium">{order?.employee.name}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="space-y-6">
                        {/* Financial Summary */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Payment Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white font-medium font-bengali tracking-wider">৳{order?.totalAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Paid</span>
                                    <span className="text-white font-medium font-bengali tracking-wider">৳{order?.paidAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Due</span>
                                    <span className="text-white font-medium font-bengali tracking-wider">৳{order?.dueAmount}</span>
                                </div>
                                <Separator className="bg-gray-600" />
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Total</span>
                                    <span className="text-white font-semibold text-lg font-bengali tracking-wider">৳{order?.totalAmount}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Timeline */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Order Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-white font-medium">Order Created</p>
                                            <p className="text-gray-400 text-sm flex items-center gap-1">
                                                <CalendarDays className="w-4 h-4" />
                                                {format(order?.createdAt || new Date(), 'PPP')}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                {format(order?.createdAt || new Date(), 'p')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-white">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                                        <p className="text-2xl font-bold text-white">{order?.orderItems.length}</p>
                                        <p className="text-gray-400 text-sm">Items</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                                        <p className="text-2xl font-bold text-white">
                                            {order?.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                                        </p>
                                        <p className="text-gray-400 text-sm">Quantity</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
};
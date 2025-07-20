"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, Clock, DollarSign, Eye, Package, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useTRPC } from "@/trpc/client";
import { MobileOrderView } from "./mobile-view-order";

export const DailySellReport = () => {
    const trpc = useTRPC();

    const { data } = useSuspenseQuery(trpc.sellReport.daily.queryOptions());

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-900/30 border border-blue-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-400 text-sm">Total Sales</p>
                            <p className="text-3xl font-bold text-white font-bengali tracking-wider">৳{data?.overview?.totalAmount?.toLocaleString()}</p>
                            <p className="text-blue-300 text-sm mt-1">+12% vs yesterday</p>
                        </div>
                        <div className="bg-gray-700 rounded-full p-3">
                            <DollarSign className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-green-900/30 border border-green-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-400 text-sm">Orders</p>
                            <p className="text-3xl font-bold text-white">{data?.overview?.totalOrder?.toLocaleString()}</p>
                            <p className="text-green-300 text-sm mt-1">+3 new orders</p>
                        </div>
                        <div className="bg-gray-700 rounded-full p-3">
                            <ShoppingCart className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-purple-900/30 border border-purple-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-400 text-sm">Items Sold</p>
                            <p className="text-3xl font-bold text-white">{data?.overview?.totalQuantity?.toLocaleString()}</p>
                            <p className="text-purple-300 text-sm mt-1">Across all orders</p>
                        </div>
                        <div className="bg-gray-700 rounded-full p-3">
                            <Package className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-orange-900/30 border border-orange-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-400 text-sm">Pending Payment</p>
                            <p className="text-3xl font-bold text-white">${data?.overview?.unPaidAmount?.toLocaleString()}</p>
                            <p className="text-orange-300 text-sm mt-1">Follow up required</p>
                        </div>
                        <div className="bg-gray-700 rounded-full p-3">
                            <Clock className="w-6 h-6 text-orange-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2 bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Today&apos;s Orders</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>{data?.overview?.totalOrder} orders processed</span>
                    </div>
                </div>

                <MobileOrderView orders={data.orders ?? []} />

                <Table className="hidden md:table rounded-lg">
                    <TableHeader>
                        <TableRow className="bg-gray-700 hover:bg-gray-600 text-white">
                            <TableCell>Shop</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>T. Quantity</TableCell>
                            <TableCell>F. Quantity</TableCell>
                            <TableCell>R. Quantity</TableCell>
                            <TableCell>D. Quantity</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>P. Amount</TableCell>
                            <TableCell>D. Amount</TableCell>
                            <TableCell>P. Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data?.orders?.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.shop.name}</TableCell>
                                    <TableCell>{order._count.orderItems}</TableCell>
                                    <TableCell>{order.totalQuantity}</TableCell>
                                    <TableCell>{order.freeQuantity}</TableCell>
                                    <TableCell>{order.returnedQuantity}</TableCell>
                                    <TableCell>{order.damageQuantity}</TableCell>
                                    <TableCell>৳{order.totalAmount.toLocaleString()}</TableCell>
                                    <TableCell>৳{order.paidAmount.toLocaleString()}</TableCell>
                                    <TableCell>৳{(order.totalAmount - order.paidAmount).toLocaleString()}</TableCell>
                                    <TableCell className="capitalize">{order.paymentStatus}</TableCell>
                                    <TableCell>
                                        <Button asChild variant="gray" size="icon" className="hover:bg-gray-700">
                                            <Link href={`/order/${order.id}`} className="text-blue-400 hover:underline" prefetch>
                                                <Eye className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>

                <Button asChild variant="link" className="mt-4 text-gray-400 mx-auto w-full max-w-fit block">
                    <Link href="/order" className="text-blue-400 hover:underline" prefetch>View All</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Outgoing Items */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 bg-orange-900/30 border border-orange-800 rounded-lg">
                            <ArrowUpRight className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Stock Out</h3>
                            <p className="text-sm text-gray-400">Items stock out today</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-white">{data?.outgoings?.total}</span>
                            <span className="text-sm text-gray-400">Total Items</span>
                        </div>
                        {data?.outgoings?.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between items-center border-b border-gray-600 last:border-b-0">
                                <div>
                                    <p className="font-medium text-white">{item.product}</p>
                                    <p className="text-sm text-gray-400">{item.productCode}</p>
                                </div>
                                <span className="font-semibold text-orange-400">{item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Incoming Items */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-900/30 border border-green-800 rounded-lg">
                            <ArrowDownRight className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Stock In Items</h3>
                            <p className="text-sm text-gray-400">Items stock in today</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-white">{data?.incomings?.total}</span>
                            <span className="text-sm text-gray-400">Total Items</span>
                        </div>
                        {data?.incomings?.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between items-center border-b border-gray-600 last:border-b-0">
                                <div>
                                    <p className="font-medium text-white">{item.product}</p>
                                    <p className="text-sm text-gray-400">{item.productCode}</p>
                                </div>
                                <span className="font-semibold text-green-400">+{item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpDown, DollarSign, Package, TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useTRPC } from "@/trpc/client";
import { cn } from "@/lib/utils";

export const DailySellReport = () => {
    const trpc = useTRPC();

    const { data } = useSuspenseQuery(trpc.sellReport.daily.queryOptions());

    const { totalOutgoingCount, totalIncomingCount, totalDueCount } = data;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Outgoing Stats */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                        Total Outgoing
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-red-400" />
                                <span className="text-xs text-gray-400">Amount</span>
                            </div>
                            <div className="text-2xl font-bold text-white font-bengali tracking-wider">
                                ৳{totalOutgoingCount.amount}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-red-400" />
                                <span className="text-xs text-gray-400">Quantity</span>
                            </div>
                            <div className="text-lg font-semibold text-gray-300">
                                {totalOutgoingCount.quantity}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                        <p className="text-xs text-red-300">
                            Total value of products going out
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Incoming Stats */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                        Total Incoming
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-400" />
                                <span className="text-xs text-gray-400">Amount</span>
                            </div>
                            <div className="text-2xl font-bold text-white font-bengali tracking-wider">
                                ৳{totalIncomingCount.amount}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-green-400" />
                                <span className="text-xs text-gray-400">Quantity</span>
                            </div>
                            <div className="text-lg font-semibold text-gray-300">
                                {totalIncomingCount.quantity}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-800/30">
                        <p className="text-xs text-green-300">
                            Total value of products coming in
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Due/Balance Stats */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                        Net Balance
                    </CardTitle>
                    <ArrowUpDown className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-blue-400" />
                                <span className="text-xs text-gray-400">Amount</span>
                            </div>
                            <div
                                className={cn(
                                    "text-2xl font-bold font-bengali tracking-wider",
                                    totalDueCount.amount >= 0 ? "text-red-400" : "text-green-400"
                                )}
                            >
                                ৳{totalDueCount.amount}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-blue-400" />
                                <span className="text-xs text-gray-400">Quantity</span>
                            </div>
                            <div
                                className={cn(
                                    "text-lg font-semibold",
                                    totalDueCount.quantity >= 0 ? "text-red-300" : "text-green-300"
                                )}
                            >
                                {totalDueCount.quantity}
                            </div>
                        </div>
                    </div>
                    <div
                        className={cn(
                            "mt-4 p-3 rounded-lg border",
                            totalDueCount.amount >= 0 ? "bg-red-900/20 border-red-800/30" : "bg-green-900/20 border-green-800/30"
                        )}
                    >
                        <p
                            className={cn(
                                "text-xs",
                                totalDueCount.amount >= 0 ? "text-red-300" : "text-green-300"
                            )}
                        >
                            {totalDueCount.amount >= 0
                                ? 'Net outgoing exceeds incoming'
                                : 'Net incoming exceeds outgoing'
                            }
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Row */}
            <div className="md:col-span-2 lg:col-span-3">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Daily Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-gray-700 rounded-lg">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-red-400" />
                                    <span className="text-gray-300 font-medium">Outgoing</span>
                                </div>
                                <p className="text-2xl font-bold text-white mb-1 font-bengali tracking-wider">
                                    ৳{totalOutgoingCount.amount}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {totalOutgoingCount.quantity} items
                                </p>
                            </div>

                            <div className="text-center p-4 bg-gray-700 rounded-lg">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <TrendingDown className="w-5 h-5 text-green-400" />
                                    <span className="text-gray-300 font-medium">Incoming</span>
                                </div>
                                <p className="text-2xl font-bold text-white mb-1 font-bengali tracking-wider">
                                    ৳{totalIncomingCount.amount}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {totalIncomingCount.quantity} items
                                </p>
                            </div>

                            <div className="text-center p-4 bg-gray-700 rounded-lg">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <ArrowUpDown className="w-5 h-5 text-blue-400" />
                                    <span className="text-gray-300 font-medium">Net Balance</span>
                                </div>
                                <p
                                    className={cn(
                                        "text-2xl font-bold font-bengali tracking-wider",
                                        totalDueCount.amount >= 0 ? "text-red-400" : "text-green-400"
                                    )}
                                >
                                    ৳{totalDueCount.amount >= 0 ? '+' : ''}{totalDueCount.amount}
                                </p>
                                <p
                                    className={cn(
                                        "text-sm",
                                        totalDueCount.quantity >= 0 ? "text-red-300" : "text-green-300"
                                    )}
                                >
                                    {totalDueCount.quantity >= 0 ? '+' : ''}{totalDueCount.quantity} items
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
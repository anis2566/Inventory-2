"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpDown, Clock, DollarSign, PieChart, ShoppingCart, TrendingDown, TrendingUp } from "lucide-react";
import { endOfMonth, format, startOfMonth } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useTRPC } from "@/trpc/client";
import { cn } from "@/lib/utils";

export const SaleOverview = () => {
    const getGrowthColor = (rate: number) => {
        return rate >= 0 ? 'text-green-400' : 'text-red-400';
    };

    const getGrowthIcon = (rate: number) => {
        return rate >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
    };
    const trpc = useTRPC();

    const { data } = useSuspenseQuery(trpc.sellReport.overall.queryOptions());

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Overview</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">
                                This Week
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white font-bengali tracking-wider">
                                ৳{data.weeklyOverview.totalSale}
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                                {getGrowthIcon(data.weeklyOverview.growthRate)}
                                <span
                                    className={cn(
                                        "text-xs",
                                        data.weeklyOverview.growthRate >= 0 ? "text-green-400" : "text-red-400"
                                    )}
                                >
                                    {data.weeklyOverview.growthRate >= 0 ? '+' : ''}{data.weeklyOverview.growthRate.toFixed(1)}%
                                </span>
                                <span className="text-xs text-gray-400">from last week</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">
                                This Month
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white font-bengali tracking-wider">
                                ৳{data.monthlyOverview.totalSale}
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                                {getGrowthIcon(data.monthlyOverview.growthRate)}
                                <span className={`text-xs ${getGrowthColor(data.monthlyOverview.growthRate)}`}>
                                    {data.monthlyOverview.growthRate >= 0 ? '+' : ''}{data.monthlyOverview.growthRate.toFixed(1)}%
                                </span>
                                <span className="text-xs text-gray-400">from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">
                                Avg Order Value
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white font-bengali tracking-wider">
                                ৳{data.avergeOrderOverview.averageOrderValue}
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpDown className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-gray-400">per transaction</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">
                                Total Orders
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">
                                {data.totalOrders}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">
                                Total Sale
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white font-bengali tracking-wider">
                                ৳{data.totalSale}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Net Balance */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">
                                Net Balance
                            </CardTitle>
                            <ArrowUpDown className="h-4 w-4 text-yellow-400" />
                        </CardHeader>
                        <CardContent>
                            <div
                                className={cn(
                                    "text-2xl font-bold font-bengali tracking-wider",
                                    data.netBalance >= 0 ? "text-green-400" : "text-red-400",
                                )}
                            >
                                ৳{data.netBalance}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <PieChart className="w-5 h-5" />
                                Weekly Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.weeklyTrends.slice(0, 5).map((trend, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            <span className="text-gray-300 text-sm">
                                                {format(new Date(trend.date), 'MMM dd')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-red-400 text-sm">
                                                -{trend.outgoing}
                                            </span>
                                            <span className="text-green-400 text-sm">
                                                +{trend.incoming}
                                            </span>
                                            <span
                                                className={cn(
                                                    "text-sm font-medium",
                                                    trend.balance >= 0 ? "text-red-400" : "text-green-400",
                                                )}
                                            >
                                                {trend.balance >= 0 ? '+' : ''}{trend.balance}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700 max-h-fit">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Report Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-4 bg-gray-700 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-2">Report Generated</p>
                                    <p className="text-white font-medium">
                                        {format(new Date(), 'PPP')} at {format(new Date(), 'p')}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-gray-700 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-2">Data Period</p>
                                    <p className="text-white font-medium">
                                        {format(startOfMonth(new Date()), 'MMM dd')} - {format(endOfMonth(new Date()), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-gray-700 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-2">Next Update</p>
                                    <p className="text-white font-medium">
                                        {format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'PPP')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
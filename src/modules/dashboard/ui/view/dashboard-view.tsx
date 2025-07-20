"use client";

import { DollarSign, Package, ShoppingBag } from "lucide-react";
import StatCard from "../components/stat-card";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import BalanceCard from "../components/balance-card";
import Loader from "@/components/loader";

export const DashboardView = () => {
    const trpc = useTRPC();

    const { data, isLoading } = useQuery(trpc.adminDashboard.get.queryOptions());

    if(isLoading) {
        return <Loader />
    }

    if(!data) return null;

    return (
        <div className="space-y-6 bg-gray-900 min-h-screen">
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-gray-400">Welcome back! Here's what's happening with your business today.</p>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-x-3">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl w-10 h-10 border-gray-600 flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Products</h1>
                        <p className="text-gray-400 text-sm">Total product overview</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Products"
                        value={data?.productOverview?.totalProduct.toString() || 0}
                        change={{ value: data?.productOverview?.growthRate, type: data?.productOverview?.type as "increase" || "decrease" }}
                        icon={Package}
                        color="green"
                        darkMode={true}
                    />

                    <StatCard
                        title="Damage Products"
                        value={data?.damageOverview?.totalProduct.toString() || 0}
                        change={{ value: data?.damageOverview?.growthRate, type: data?.damageOverview?.type as "increase" || "decrease" }}
                        icon={Package}
                        color="red"
                        darkMode={true}
                    />

                    <StatCard
                        title="Out of Stock Products"
                        value={data?.outOfStockOverview?.totalProduct.toString() || 0}
                        change={{ value: data?.outOfStockOverview?.growthRate, type: data?.outOfStockOverview?.type as "increase" || "decrease" }}
                        icon={Package}
                        color="purple"
                        darkMode={true}
                    />

                    <StatCard
                        title="Total Product Quantity"
                        value={data?.productOverview?.totalProductQuantity.toString() || 0}
                        icon={Package}
                        color="blue"
                        darkMode={true}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-x-3">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl w-10 h-10 border-gray-600 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Orders</h1>
                        <p className="text-gray-400 text-sm">Total order overview</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Today Orders"
                        value={data?.todayTotalOrders.toString() || 0}
                        icon={ShoppingBag}
                        color="green"
                        darkMode={true}
                    />

                    <StatCard
                        title="This Week Orders"
                        value={data?.thisWeekOrderOverview?.totalOrder.toString() || 0}
                        change={{ value: data?.thisWeekOrderOverview?.growthRate, type: data?.thisWeekOrderOverview?.type as "increase" || "decrease" }}
                        icon={ShoppingBag}
                        color="blue"
                        darkMode={true}
                    />

                    <StatCard
                        title="This Month Orders"
                        value={data?.thisMonthOrderOverview?.totalOrder.toString() || 0}
                        change={{ value: data?.thisMonthOrderOverview?.growthRate, type: data?.thisMonthOrderOverview?.type as "increase" || "decrease" }}
                        icon={ShoppingBag}
                        color="purple"
                        darkMode={true}
                    />

                    <StatCard
                        title="Due Orders"
                        value={data?.totalDueOrders.toString() || 0}
                        icon={ShoppingBag}
                        color="red"
                        darkMode={true}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-x-3">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl w-10 h-10 border-gray-600 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Income & Expenses</h1>
                        <p className="text-gray-400 text-sm">Total income & expenses overview</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <BalanceCard
                        title="Today Summary"
                        value={data?.todayTotalOrders.toString() || 0}
                        icon={ShoppingBag}
                        change={{ type: data?.todayIncomeExpense?.income > data?.todayIncomeExpense?.expense ? 'increase' : 'decrease', value: 5 }}
                        income={data?.todayIncomeExpense?.income || 0}
                        expense={data?.todayIncomeExpense?.expense || 0}
                        color="green"
                        darkMode={true}
                    />

                    <BalanceCard
                        title="This Month Summary"
                        value={data?.thisMonthIncomeExpense.toString() || 0}
                        icon={ShoppingBag}
                        change={{ type: data?.thisMonthIncomeExpense?.income > data?.thisMonthIncomeExpense?.expense ? 'increase' : 'decrease', value: 5 }}
                        income={data?.thisMonthIncomeExpense?.income || 0}
                        expense={data?.thisMonthIncomeExpense?.expense || 0}
                        color="green"
                        darkMode={true}
                    />

                    <BalanceCard
                        title="This Week Summary"
                        value={data?.thisWeekIncomeExpense.toString() || 0}
                        icon={ShoppingBag}
                        change={{ type: data?.thisWeekIncomeExpense?.income > data?.thisWeekIncomeExpense?.expense ? 'increase' : 'decrease', value: 5 }}
                        income={data?.thisWeekIncomeExpense?.income || 0}
                        expense={data?.thisWeekIncomeExpense?.expense || 0}
                        color="green"
                        darkMode={true}
                    />

                    <BalanceCard
                        title="Total Summary"
                        value={data?.totalIncomeExpense.income - data?.todayIncomeExpense.expense || 0}
                        icon={ShoppingBag}
                        change={{ type: data?.totalIncomeExpense?.income > data?.totalIncomeExpense?.expense ? 'increase' : 'decrease', value: 5 }}
                        income={data?.totalIncomeExpense?.income || 0}
                        expense={data?.totalIncomeExpense?.expense || 0}
                        color="green"
                        darkMode={true}
                    />
                </div>
            </div>
        </div>
    )
};
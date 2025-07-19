"use client";

import { Calendar, Clock, Edit, Eye, MoreVertical, Package, ShoppingBag, TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MobileFilter } from "../components/mobile-filter"
import { NoResultFound } from "@/components/no-result-found";

import { Order } from "@/generated/prisma"
import { PaymentStatusButton } from "../table/payment-status-button"
import { OrderStatusButton } from "../table/return-status-button"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PAYMENT_STATUS } from "@/constant"
import { useOrderFilter } from "../../filter/use-order-filter";
import { MobilePagination } from "../components/mobile-pagination";

type OrderOmit = Omit<Order, "createdAt" | "updatedAt" | "date" | "deliveryDate"> & {
    createdAt: string
    updatedAt: string
    date: string
    deliveryDate: string | null
    shop: {
        name: string
    }
    _count: {
        orderItems: number
    }
}

interface Props {
    orders: OrderOmit[]
    totalCount: number;
    totalOrderCount: number;
    totalAmount: number
}

export const MobileOrderView = ({ orders, totalOrderCount, totalAmount, totalCount }: Props) => {
    const [filter, setFilter] = useOrderFilter();

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return "bg-green-900/30 text-green-400 border-green-800";
            case 'pending':
                return "bg-orange-900/30 text-orange-400 border-orange-800";
            case 'unpaid':
                return "bg-red-900/30 text-red-400 border-red-800";
            default:
                return "bg-gray-700 text-gray-300 border-gray-600";
        }
    };

    const getOrderStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return "bg-green-900/30 text-green-400 border-green-800";
            case 'placed':
                return "bg-blue-900/30 text-blue-400 border-blue-800";
            case 'cancelled':
                return "bg-red-900/30 text-red-400 border-red-800";
            case 'shipped':
                return "bg-purple-900/30 text-purple-400 border-purple-800";
            default:
                return "bg-gray-700 text-gray-300 border-gray-600";
        }
    };

    const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getDeliveryStatus = (deliveryDate: string | null, orderStatus: string) => {
        if (!deliveryDate) return null;

        const today = new Date();
        const delivery = new Date(deliveryDate);
        const diffTime = delivery.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (orderStatus.toLowerCase() === 'delivered') {
            return { text: 'Delivered', color: 'text-green-400' };
        } else if (diffDays < 0) {
            return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-400' };
        } else if (diffDays === 0) {
            return { text: 'Due today', color: 'text-orange-400' };
        } else if (diffDays <= 3) {
            return { text: `${diffDays} days left`, color: 'text-orange-400' };
        } else {
            return { text: `${diffDays} days left`, color: 'text-blue-400' };
        }
    };

    const handleClear = () => {
        setFilter({
            search: "",
            limit: DEFAULT_PAGE_SIZE,
            page: DEFAULT_PAGE,
            sort: "",
            status: "",
            date: "",
            paymentStatus: ""
        });
    };

    return (
        <div className="w-full md:hidden space-y-4 bg-gray-900 min-h-screen">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 bg-gray-800 border-gray-700">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-blue-600" />
                        <div>
                            <p className="text-xs text-gray-400">Total Orders</p>
                            <p className="text-lg font-semibold text-white">{totalOrderCount}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3 bg-gray-800 border-gray-700">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <div>
                            <p className="text-xs text-gray-400">Total Value</p>
                            <p className="text-lg font-semibold font-bengali text-white">
                                {formatCurrency(totalAmount)}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {
                totalCount !== 0 && (
                    <MobileFilter />
                )
            }

            {
                totalCount === 0 ? (
                    <NoResultFound title="No order Found" onClear={handleClear} />
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => {
                            const dueAmount = order.totalAmount - order.paidAmount;
                            const paymentProgress = (order.paidAmount / order.totalAmount) * 100;

                            return (
                                <Card key={order.id} className="transition-all duration-200 hover:shadow-md bg-gray-800 border-gray-700 hover:border-gray-600 p-2">
                                    <CardHeader className="p-2 pb-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-base leading-tight truncate text-white pb-1">
                                                    {order.shop.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}
                                                    >
                                                        {order.paymentStatus}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs rounded-full ${getOrderStatusColor(order.status)}`}
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/order/${order.id}`}
                                                            className="flex items-center gap-2 text-gray-300 hover:text-white"
                                                            prefetch
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            <span>View</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/order/edit/${order.id}`}
                                                            className="flex items-center gap-2 text-gray-300 hover:text-white"
                                                            prefetch
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                            <span>Edit</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <PaymentStatusButton id={order.id} status={order.paymentStatus as PAYMENT_STATUS} />
                                                    <OrderStatusButton id={order.id} />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-2 pt-0">
                                        {/* Quantity Information */}
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                    <Package className="h-3 w-3 text-blue-600" />
                                                    <span className="text-xs text-gray-400">Items</span>
                                                </div>
                                                <p className="text-sm font-medium text-white">{order._count.orderItems}</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                                    <span className="text-xs text-gray-400">Total Qty</span>
                                                </div>
                                                <p className="text-sm font-medium text-white">{order.totalQuantity}</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                    <TrendingDown className="h-3 w-3 text-red-600" />
                                                    <span className="text-xs text-gray-400">Returned</span>
                                                </div>
                                                <p className="text-sm font-medium text-white">{order.returnedQuantity}</p>
                                            </div>
                                        </div>

                                        {/* Financial Information */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-400">Total Amount</span>
                                                <span className="font-semibold font-bengali text-white">{formatCurrency(order.totalAmount)}</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-400">Paid Amount</span>
                                                <span className="font-medium text-green-600 font-bengali">{formatCurrency(order.paidAmount)}</span>
                                            </div>

                                            {dueAmount > 0 && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-400">Due Amount</span>
                                                    <span className="font-medium text-red-600 font-bengali">{formatCurrency(dueAmount)}</span>
                                                </div>
                                            )}

                                            {/* Payment Progress Bar */}
                                            <div className="space-y-1 ">
                                                <div className="flex justify-between text-xs text-gray-400">
                                                    <span>Payment Progress</span>
                                                    <span>{Math.round(paymentProgress)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${paymentProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date Information */}
                                        <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-blue-400" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Order Date</p>
                                                    <p className="text-sm font-medium text-white">{formatDate(order.date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-purple-400" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Delivery Date</p>
                                                    {order.deliveryDate ? (
                                                        <div>
                                                            <p className="text-sm font-medium text-white">{formatDate(order.deliveryDate)}</p>
                                                            {(() => {
                                                                const deliveryStatus = getDeliveryStatus(order.deliveryDate, order.status);
                                                                return deliveryStatus ? (
                                                                    <p className={`text-xs ${deliveryStatus.color}`}>
                                                                        {deliveryStatus.text}
                                                                    </p>
                                                                ) : null;
                                                            })()}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500">Not set</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        {(order.returnedQuantity > 0 || order.damageQuantity > 0) && (
                                            <div className="mt-3 pt-3 border-t border-gray-700">
                                                <div className="flex justify-between text-xs">
                                                    {order.returnedQuantity > 0 && (
                                                        <span className="text-orange-600">
                                                            Returned: {order.returnedQuantity}
                                                        </span>
                                                    )}
                                                    {order.damageQuantity > 0 && (
                                                        <span className="text-red-600">
                                                            Damaged: {order.damageQuantity}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )
            }

            <MobilePagination totalCount={totalCount} />
        </div>
    )
} 
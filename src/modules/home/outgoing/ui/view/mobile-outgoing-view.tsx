import { Calendar, Eye, MoreVertical, Package, ShoppingCart, TrendingUp } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Outgoing } from "@/generated/prisma"
import { MobileFilter } from "../components/mobile-filter"
import { useOutgoingFilter } from "../../filter/use-outgoing-filter"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constant"
import { NoResultFound } from "@/components/no-result-found"

type OutgoingOmit = Omit<Outgoing, 'createdAt' | 'updatedAt'> & {
    createdAt: string
    updatedAt: string
    _count: {
        items: number
    }
}

interface Props {
    outgoings: OutgoingOmit[]
    totalCount: number
    totalOutgoingCount: number
    totalAmount: number
}

export const MobileOutgoingView = ({ outgoings, totalCount, totalOutgoingCount, totalAmount }: Props) => {
    const [filter, setFilter] = useOutgoingFilter();

    const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleClear = () => {
        setFilter({
            limit: DEFAULT_PAGE_SIZE,
            page: DEFAULT_PAGE,
            sort: "",
            date: "",
        });
    };

    return (
        <div className="w-full md:hidden space-y-4 bg-gray-900 min-h-screen">
            <div className="space-y-3">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <Card className="p-3 bg-gray-800 border-gray-700">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-orange-400" />
                            <div>
                                <p className="text-xs text-gray-400">Total Outgoing</p>
                                <p className="text-lg font-semibold text-white">{totalOutgoingCount}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-3 bg-gray-800 border-gray-700">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <div>
                                <p className="text-xs text-gray-400">Total Value</p>
                                <p className="text-lg font-semibold font-bengali text-white">
                                    {formatCurrency(totalAmount)}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
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
                        {outgoings.map((outgoing) => (
                            <Card key={outgoing.id} className="transition-all duration-200 hover:shadow-md bg-gray-800 border-gray-700 hover:border-gray-600">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base leading-tight text-white">
                                                Outgoing #{outgoing.id.slice(-8).toUpperCase()}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-blue-400" />
                                                    <span className="text-sm text-gray-400">{formatDate(outgoing.createdAt)}</span>
                                                </div>
                                                <span className="text-gray-600">•</span>
                                                <span className="text-sm text-gray-400">{formatTime(outgoing.createdAt)}</span>
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
                                                        href={`/outgoing/${outgoing.id}`}
                                                        className="flex items-center gap-2 text-gray-300 hover:text-white"
                                                        prefetch
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span>View</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    {/* Quantity and Product Information */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <Package className="h-3 w-3 text-purple-400" />
                                                <span className="text-xs text-gray-400">Products</span>
                                            </div>
                                            <p className="text-sm font-medium text-white">{outgoing._count.items}</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <TrendingUp className="h-3 w-3 text-orange-400" />
                                                <span className="text-xs text-gray-400">Total Qty</span>
                                            </div>
                                            <p className="text-sm font-medium text-white">{outgoing.totalQuantity}</p>
                                        </div>
                                    </div>

                                    {/* Financial Information */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Total Amount</span>
                                            <span className="font-semibold font-bengali text-white text-lg">{formatCurrency(outgoing.total)}</span>
                                        </div>

                                        {/* Amount per item calculation */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Avg per Product</span>
                                            <span className="font-medium text-blue-400 font-bengali">
                                                {formatCurrency(Math.round(outgoing.total / outgoing._count.items))}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Additional Metrics */}
                                    <div className="mt-4 pt-3 border-t border-gray-700">
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Avg Qty per Product</span>
                                            <span className="text-gray-300">
                                                {(outgoing.totalQuantity / outgoing._count.items).toFixed(1)} units
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )
            }
        </div>
    )
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";

interface DueCardProps {
    dueAmount: number;
    dueShops: number;
}

export const DueCard = ({ dueAmount, dueShops }: DueCardProps) => {
    // Format currency with proper commas and currency symbol
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="font-medium text-gray-300 text-sm">
                    Total Due Amount
                </CardTitle>
                <div className="bg-red-500/20 p-2 rounded-full">
                    <DollarSign className="h-4 w-4 text-red-400" />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Main amount display */}
                <div className="flex items-baseline gap-1">
                    <div className="text-3xl font-bold text-white font-bengali tracking-wider">
                        ৳{formatCurrency(dueAmount)}
                    </div>
                    {dueAmount > 0 && (
                        <div className="flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-full">
                            <AlertCircle className="w-3 h-3 text-red-400" />
                            <span className="text-xs text-red-300 font-medium">
                                OVERDUE
                            </span>
                        </div>
                    )}
                </div>

                {/* Customers count */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-300">
                            Customers with dues
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-semibold text-white">
                            {dueShops}
                        </span>
                        <span className="text-xs text-gray-400">
                            {dueShops === 1 ? 'customer' : 'customers'}
                        </span>
                    </div>
                </div>

                {/* Progress indicator */}
                {dueAmount > 0 && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Payment Status</span>
                            <span>Urgent</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div className="bg-gradient-to-r from-red-500 to-red-400 h-1.5 rounded-full w-full"></div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
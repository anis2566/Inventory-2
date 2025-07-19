import React from 'react';
import { Calculator, LogIn, LogOut, LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

interface StatCardProps {
    title: string;
    income: number;
    expense: number;
    value: string | number;
    change: {
        value: number;
        type: 'increase' | 'decrease';
    };
    icon: LucideIcon;
    color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
    darkMode?: boolean;
}

const BalanceCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    color = 'blue',
    darkMode = false,
    income,
    expense
}) => {
    const lightColorClasses = {
        blue: 'bg-blue-500 text-blue-600 bg-blue-50',
        green: 'bg-emerald-500 text-emerald-600 bg-emerald-50',
        orange: 'bg-amber-500 text-amber-600 bg-amber-50',
        purple: 'bg-purple-500 text-purple-600 bg-purple-50',
        red: 'bg-rose-500 text-rose-600 bg-rose-50',
    };

    const darkColorClasses = {
        blue: 'bg-blue-900/30 text-blue-400 border-blue-800',
        green: 'bg-green-900/30 text-green-400 border-green-800',
        orange: 'bg-orange-900/30 text-orange-400 border-orange-800',
        purple: 'bg-purple-900/30 text-purple-400 border-purple-800',
        red: 'bg-red-900/30 text-red-400 border-red-800',
    };

    const colorClasses = darkMode ? darkColorClasses : lightColorClasses;
    const [bgColor, textColor, bgLight] = darkMode
        ? colorClasses[color].split(' ')
        : lightColorClasses[color].split(' ');

    return (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border p-6`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{title}</p>
                    <div>
                        <div className='grid grid-cols-2'>
                            <div className='flex items-center gap-2'>
                                <LogIn className="text-green-400 w-4 h-4" />
                                <p className={`text-xl font-bold font-bengali tracking-wider ${darkMode ? 'text-white' : 'text-gray-900'}`}>৳{income}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <LogOut className="text-red-400 w-4 h-4" />
                                <p className={`text-xl font-bold font-bengali tracking-wider ${darkMode ? 'text-white' : 'text-gray-900'}`}>৳{expense}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Calculator className="text-purple-400 w-4 h-4" />
                            <p className={`text-xl font-bold font-bengali tracking-wider ${darkMode ? 'text-white' : 'text-gray-900'}`}>৳{ income - expense}</p>
                        </div>
                    </div>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? `${bgColor} border border-gray-700` : bgLight} `}>
                    {
                        change.type === "increase" ? (
                            <TrendingUp className="w-4 h-4 text-white" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-white" />
                        )
                    }
                </div>
            </div>
        </div>
    );
};
/*******  9ded0bb6-f0a7-444b-8379-e49697557265  *******/

export default BalanceCard;
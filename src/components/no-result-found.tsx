"use client";

import { Filter, RotateCcw, Search } from "lucide-react"

interface NoResultFoundProps {
    title: string;
    onClear: () => void;
}

export const NoResultFound = ({ title, onClear }: NoResultFoundProps) => {
    const handleClearFilters = () => {
        onClear();
    }

    return (
        <div className="flex flex-col items-center justify-center py-4 px-6 text-center">
            <div className="relative mb-2">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border border-gray-600">
                    <Search className="w-8 h-8 text-gray-400" />
                </div>

                <div className="absolute -top-1 -right-1 animate-pulse">
                    <div className="w-6 h-6 bg-orange-900/40 border border-orange-800 rounded-full flex items-center justify-center">
                        <Filter className="w-3 h-3 text-orange-300" />
                    </div>
                </div>
            </div>

            <div className="mb-2 max-w-sm">
                <h3 className="text-xl font-bold text-white mb-3">
                    {title}
                </h3>

            </div>

            <div className="flex flex-col gap-3 w-full max-w-sm">
                <button
                    className="group flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0"
                    onClick={handleClearFilters}
                >
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <RotateCcw className="w-3 h-3 text-rose-300" />
                    </div>
                    <span className="text-rose-300">Clear All Filters</span>
                </button>
            </div>
        </div>
    )
}
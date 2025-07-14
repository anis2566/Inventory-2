"use client";

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const ErrorBoundryUI = () => {
    const router = useRouter()

    const onRetry = () => {
        window.location.reload();
    }

    const onGoHome = () => {
        router.push('/')
    }

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-red-500/5 opacity-50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="text-center">
                    {/* Error Icon with Enhanced Animation */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/30 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg shadow-red-500/20">
                                <AlertTriangle className="w-12 h-12 text-red-300" />
                            </div>
                            {/* Multiple pulsing rings for better effect */}
                            <div className="absolute inset-0 w-24 h-24 border-2 border-red-500/30 rounded-full animate-ping"></div>
                            <div className="absolute inset-2 w-20 h-20 border border-red-500/20 rounded-full animate-pulse"></div>
                            <div className="absolute -inset-2 w-28 h-28 border border-red-500/10 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                        </div>
                    </div>

                    {/* Error Content */}
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                            Something went wrong
                        </h2>
                        <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 max-w-2xl mx-auto">
                            <p className="text-lg text-gray-300 leading-relaxed">
                                We&apos;re sorry, but an unexpected error occurred. Please try refreshing the page or come back later.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <button
                            onClick={onRetry}
                            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/25 border border-blue-500/20 hover:border-blue-400/30 backdrop-blur-sm gap-3 relative overflow-hidden"
                        >
                            {/* Button background animation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
                            <span className="relative z-10">Try Again</span>
                        </button>

                        <button
                            onClick={onGoHome}
                            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm border border-white/10 hover:border-white/20 gap-3 relative overflow-hidden"
                        >
                            {/* Button background animation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                            <span className="relative z-10">Go Home</span>
                        </button>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-sm text-gray-400 mb-4">
                            If the problem persists, please contact our support team
                        </p>
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>System Status: Monitoring</span>
                            </div>
                            <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <span>Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-orange-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
    );
};
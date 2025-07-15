import React from 'react';
import {
    Shield,
    ShieldX,
    Lock,
    AlertTriangle,
} from 'lucide-react';



export function UnAuthorized() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Main Error Card */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-red-600/20 rounded-2xl blur-xl"></div>
                    <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">

                        {/* Animated Icon Stack */}
                        <div className="relative mb-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-800 rounded-full">
                                <ShieldX className="w-10 h-10 text-red-400" />
                            </div>

                            {/* Floating Warning Icon */}
                            <div className="absolute -top-1 -right-1 animate-pulse">
                                <div className="w-8 h-8 bg-orange-900/40 border border-orange-800 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-4 h-4 text-orange-300" />
                                </div>
                            </div>

                            {/* Floating Lock Icon */}
                            <div className="absolute -bottom-1 -left-1 animate-bounce">
                                <div className="w-6 h-6 bg-red-900/40 border border-red-800 rounded-full flex items-center justify-center">
                                    <Lock className="w-3 h-3 text-red-300" />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-white mb-3">
                                Access Denied
                            </h1>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Your current role (User) doesn&apos;t have permission to access this resource. Only users with Senior Role (SR) can access this feature.
                            </p>
                        </div>

                        {/* Error Code */}
                        <div className="mb-6">
                            <div className="inline-flex items-center gap-2 bg-red-900/20 border border-red-800 text-red-300 px-4 py-2 rounded-lg text-sm font-mono">
                                <Shield className="w-4 h-4" />
                                <span>Error 403 - Forbidden</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import { LucideIcon, Plus } from "lucide-react";
import Link from "next/link";

interface EmptyStatViewProps {
    title: string;
    description: string;
    buttonTitle?: string;
    buttonLink?: string;
    showButtonIcon?: boolean;
    animatedIcon: LucideIcon;
    floatingIcon: LucideIcon;
    floatingIcon2: LucideIcon;
}

export const EmptyStatView = ({ title, description, buttonTitle, buttonLink, animatedIcon: AnimatedIcon, floatingIcon: FloatingIcon, floatingIcon2: FloatingIcon2, showButtonIcon = true }: EmptyStatViewProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {/* Animated Icon Stack */}
            <div className="relative mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border border-gray-600">
                    <AnimatedIcon className="w-10 h-10 text-gray-400" />
                </div>

                {/* Floating Icons */}
                <div className="absolute -top-2 -right-2 animate-bounce">
                    <div className="w-8 h-8 bg-blue-900/40 border border-blue-800 rounded-full flex items-center justify-center">
                        <FloatingIcon className="w-4 h-4 text-blue-300" />
                    </div>
                </div>

                <div className="absolute -bottom-1 -left-2 animate-pulse">
                    <div className="w-6 h-6 bg-purple-900/40 border border-purple-800 rounded-full flex items-center justify-center">
                        <FloatingIcon2 className="w-3 h-3 text-purple-300" />
                    </div>
                </div>
            </div>

            {/* Main Message */}
            <div className="mb-8 max-w-sm">
                <h3 className="text-xl font-bold text-white mb-3">
                    {title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Action Button */}
            {
                buttonTitle && buttonLink && (
                    <Link href={buttonLink} prefetch>
                        <button
                            className="group flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {
                                showButtonIcon && (
                                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        <Plus className="w-3 h-3" />
                                    </div>
                                )
                            }
                            <span>{buttonTitle}</span>
                        </button>
                    </Link>
                )
            }
        </div>
    )
};
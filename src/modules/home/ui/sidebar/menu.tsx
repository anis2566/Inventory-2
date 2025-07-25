"use client";

import Link from "next/link";
import { Ellipsis } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider
} from "@/components/ui/tooltip";
import { getUserMenuList } from "@/lib/menu-list";
import { CollapseMenuButton } from "./collapse-menu-button";

interface MenuProps {
    isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
    const pathname = usePathname();
    const menuList = getUserMenuList(pathname);

    return (
        <ScrollArea className="[&>div>div[style]]:!block">
            <nav className="mt-8 h-full w-full">
                <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
                    {menuList.map(({ groupLabel, menus }, index) => (
                        <li className={cn("w-full list-none", groupLabel ? "pt-5" : "")} key={index}>
                            {(isOpen && groupLabel) || isOpen === undefined ? (
                                <p className="text-sm font-medium text-gray-500 px-4 pb-2 max-w-[248px] truncate">
                                    {groupLabel}
                                </p>
                            ) : !isOpen && isOpen !== undefined && groupLabel ? (
                                <TooltipProvider>
                                    <Tooltip delayDuration={100}>
                                        <TooltipTrigger className="w-full">
                                            <div className="w-full flex justify-center items-center">
                                                <Ellipsis className="h-5 w-5 text-gray-300" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p className="text-white">{groupLabel}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <p className="pb-2"></p>
                            )}
                            {menus.map(
                                ({ href, label, icon: Icon, active, submenus }, index) =>
                                    submenus.length === 0 ? (
                                        <div className="w-full" key={index}>
                                            <TooltipProvider disableHoverableContent>
                                                <Tooltip delayDuration={100}>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className={cn(
                                                                "w-full justify-start h-8 mb-1 text-white hover:bg-gray-600",
                                                                active && "bg-gray-600"
                                                            )}
                                                            asChild
                                                        >
                                                            <Link href={href} prefetch>
                                                                <span
                                                                    className={cn(isOpen === false ? "" : "mr-2")}
                                                                >
                                                                    <Icon size={18} className="text-gray-300" />
                                                                </span>
                                                                <p
                                                                    className={cn(
                                                                        "max-w-[200px] truncate text-gray-300",
                                                                        isOpen === false
                                                                            ? "-translate-x-96 opacity-0"
                                                                            : "translate-x-0 opacity-100"
                                                                    )}
                                                                >
                                                                    {label}
                                                                </p>
                                                            </Link>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    {isOpen === false && (
                                                        <TooltipContent side="right">
                                                            {label}
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    ) : (
                                        <div className="w-full" key={index}>
                                            <CollapseMenuButton
                                                icon={Icon}
                                                label={label}
                                                active={active}
                                                submenus={submenus}
                                                isOpen={isOpen}
                                            />
                                        </div>
                                    )
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </ScrollArea>
    );
} 
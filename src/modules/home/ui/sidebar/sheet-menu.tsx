"use client";

import { ChevronDown, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { getUserMenuList } from "@/lib/menu-list";
import { cn } from "@/lib/utils"

export const SheetMentu = () => {
    const pathname = usePathname();
    const menuList = getUserMenuList(pathname);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-gray-700 text-white h-6 w-6 hover:bg-gray-600 hover:text-white md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-gray-900 w-2/4 border-r border-gray-700">
                <SheetHeader className="hidden">
                    <SheetTitle className="hidden"></SheetTitle>
                </SheetHeader>
                <div className="flex items-center justify-between bg-gray-800 h-18 border-b border-r border-gray-700 px-4">
                    <SheetClose asChild>
                        <Link href="/" className="flex items-center gap-2" prefetch>
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={24}
                                height={24}
                            />
                            <div>
                                <h1 className="text-white font-semibold">Hayat Haven</h1>
                            </div>
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button className="h-7 w-7 p-0 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
                            <X />
                        </Button>
                    </SheetClose>
                </div>

                <nav className="h-full w-full">
                    <ul className="flex flex-col items-start space-y-3 px-2">
                        {menuList.map(({ groupLabel, menus }, index) => (
                            <li className={cn("w-full list-none", groupLabel ? "pt-5" : "")} key={index}>
                                <p className="text-sm font-medium text-white px-4 pb-2 max-w-[248px] truncate">
                                    {groupLabel}
                                </p>
                                {menus.map(
                                    ({ href, label, icon: Icon, active, submenus }, index) =>
                                        submenus.length === 0 ? (
                                            <div className="w-full" key={index}>
                                                <SheetClose className="w-full">
                                                    <Button
                                                        variant="ghost"
                                                        className={cn(
                                                            "w-full justify-start h-8 mb-1 hover:bg-gray-600 w-full",
                                                            active && "bg-gray-600"
                                                        )}
                                                        asChild
                                                    >
                                                        <Link href={href} prefetch>
                                                            <span
                                                                className="mr-2"
                                                            >
                                                                <Icon size={18} className="text-gray-300" />
                                                            </span>
                                                            <p
                                                                className="max-w-[200px] truncate text-gray-300">
                                                                {label}
                                                            </p>
                                                        </Link>
                                                    </Button>
                                                </SheetClose>
                                            </div>
                                        ) : (
                                            <Collapsible key={index}>
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className={cn("w-full justify-start h-8 hover:bg-gray-700 text-white hover:text-white my-1", active && "bg-gray-800 text-white hover:bg-gray-600 hover:text-white")}
                                                    >
                                                        <div className="w-full items-center flex justify-between">
                                                            <div className="flex items-center">
                                                                <span className="mr-4">
                                                                    <Icon size={18} />
                                                                </span>
                                                                <p
                                                                    className={cn(
                                                                        "max-w-[150px] truncate",
                                                                    )}
                                                                >
                                                                    {label}
                                                                </p>
                                                            </div>
                                                            <div
                                                                className={cn(
                                                                    "whitespace-nowrap",
                                                                )}
                                                            >
                                                                <ChevronDown
                                                                    size={18}
                                                                    className="transition-transform duration-200"
                                                                />
                                                            </div>
                                                        </div>
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                                    {submenus.map(({ href, label, active, icon: Icon }, index) => (
                                                        <SheetClose key={index} className="w-full">
                                                            <Button
                                                                variant="ghost"
                                                                className={cn(
                                                                    "w-full justify-start h-8 mb-1 hover:bg-gray-700 hover:text-white",
                                                                    active && "bg-gray-600 text-white"
                                                                )}
                                                                asChild
                                                            >
                                                                <Link href={href}>
                                                                    <span className="mr-4 ml-2">
                                                                        <Icon className="w-4 h-4 text-gray-400" />
                                                                    </span>
                                                                    <p
                                                                        className={cn(
                                                                            "max-w-[170px] truncate text-white text-gray-400",
                                                                            active && "text-white"
                                                                        )}
                                                                    >
                                                                        {label}
                                                                    </p>
                                                                </Link>
                                                            </Button>
                                                        </SheetClose>
                                                    ))}
                                                </CollapsibleContent>
                                            </Collapsible>
                                        )
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
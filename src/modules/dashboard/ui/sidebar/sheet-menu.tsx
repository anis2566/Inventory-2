"use client";

import { Menu, X } from "lucide-react"
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

import { getAdminMenuList } from "@/lib/menu-list";
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area";

export const SheetMentu = () => {
    const pathname = usePathname();
    const menuList = getAdminMenuList(pathname);

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
                        <Link href="/user" className="flex items-center gap-2" prefetch>
                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={24}
                                height={24}
                            />
                            <div>
                                <h1 className="text-white font-semibold">Shikhonary</h1>
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
                    <ul className="flex flex-col items-start space-y-1 px-2">
                        <ScrollArea>
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
                                                                "w-full justify-start h-7 mb-1 hover:bg-gray-600 w-full",
                                                                active && "bg-gray-600"
                                                            )}
                                                            asChild
                                                        >
                                                            <Link href={href} prefetch>
                                                                <span
                                                                    className="mr-4"
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
                                            ) : null
                                    )}
                                </li>
                            ))}
                        </ScrollArea>
                    </ul>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
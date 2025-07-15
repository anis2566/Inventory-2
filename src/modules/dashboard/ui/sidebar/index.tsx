"use client"

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { Menu } from "./menu";
import { SidebarToggle } from "./sidebar-toggle";

export function Sidebar() {
    const sidebar = useSidebar(useSidebarToggle, (state) => state);

    if (!sidebar) return null;

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-20 h-screen bg-gray-800 -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
                sidebar?.isOpen === false ? "w-[60px]" : "w-64"
            )}
        >
            <div className="relative h-full flex flex-col shadow-md">
                <div className="flex items-center justify-between bg-gray-800 h-16 border-b border-r border-gray-700 px-4">
                    <Link href="/user" className="flex items-center gap-2">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={24}
                            height={24}
                        />
                        <div className={cn("", !sidebar.isOpen && "hidden")}>
                            <h1 className="text-white font-semibold">POS</h1>
                            <p className="text-gray-400 text-sm">Armanitola Library</p>
                        </div>
                    </Link>
                    <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
                </div>
                <Menu isOpen={sidebar?.isOpen} />
            </div>
        </aside>
    );
}
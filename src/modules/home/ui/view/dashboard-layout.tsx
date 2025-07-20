"use client";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { Sidebar } from "../sidebar";
import { User } from "@/generated/prisma";
import { usePathname } from "next/navigation";

interface Props {
    children: React.ReactNode;
    user: User | null;
}

export function DashboardLayout({
    children,
    user
}: Props) {
    const pathname = usePathname();
    const sidebar = useSidebar(useSidebarToggle, (state) => state);

    const isNoLayout = pathname === "/unauthorized"

    if (!sidebar) return null;

    if (!user) return null

    return (
        <>
            {!isNoLayout && <Sidebar />}
            <main
                className={cn(
                    "min-h-[calc(100vh_-_56px)] transition-[margin-left] ease-in-out duration-300",
                    sidebar?.isOpen === false ? "lg:ml-[60px]" : "lg:ml-64",
                    isNoLayout && "lg:ml-0"
                )}
            >
                {children}
            </main>
        </>
    );
}
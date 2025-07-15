"use client";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { Sidebar } from "../sidebar";

export function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const sidebar = useSidebar(useSidebarToggle, (state) => state);
    if (!sidebar) return null;

    return (
        <>
            <Sidebar />
            <main
                className={cn(
                    "min-h-[calc(100vh_-_56px)] transition-[margin-left] ease-in-out duration-300",
                    sidebar?.isOpen === false ? "lg:ml-[60px]" : "lg:ml-64"
                )}
            >
                {children}
            </main>
        </>
    );
}
"use client";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { Sidebar } from "../sidebar";
import { User } from "@/generated/prisma";
import { ROLE } from "@/constant";
import { UnAuthorized } from "./unauthorized";

interface Props {
    children: React.ReactNode;
    user: User | null;
}

export function DashboardLayout({
    children,
    user
}: Props) {
    const sidebar = useSidebar(useSidebarToggle, (state) => state);

    if (!sidebar) return null;

    if (!user) return null

    if (user.role !== ROLE.SR) {
        return <UnAuthorized />
    }

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
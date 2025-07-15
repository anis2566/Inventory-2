"use client";

import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface SidebarToggleProps {
    isOpen: boolean | undefined;
    setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
    return (
        <Button
            onClick={() => setIsOpen?.()}
            className="rounded-md w-6 h-6 bg-gray-600 text-white absolute right-0"
            variant="outline"
            size="icon"
        >
            <ChevronLeft
                className={cn(
                    "h-4 w-4 transition-transform ease-in-out duration-700",
                    isOpen === false ? "rotate-180" : "rotate-0"
                )}
            />
        </Button>
    );
}
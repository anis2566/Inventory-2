"use client";

import { type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useOrderFilter } from "../../filter/use-order-filter";

export interface PaginationWithLinksProps {
    totalCount: number;
}

export function MobilePagination({
    totalCount,
}: PaginationWithLinksProps) {
    const [filter, setFilter] = useOrderFilter();

    const page = filter.page;
    const pageSize = filter.limit;

    const totalPageCount = Math.ceil(totalCount / pageSize);

    const renderPageNumbers = () => {
        const items: ReactNode[] = [];
        const maxVisiblePages = 5;

        if (totalPageCount <= maxVisiblePages) {
            for (let i = 1; i <= totalPageCount; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <Button variant="gray" size="sm" className={cn("rounded-full h-7 w-7", page === i && "bg-gray-800 hover:bg-gray-700 text-white hover:text-white mr-1")} onClick={() => setFilter({ page: i })}>
                            {i}
                        </Button>
                    </PaginationItem>,
                );
            }
        } else {
            items.push(
                <PaginationItem key={1}>
                    <Button variant="gray" size="sm" className={cn("rounded-full h-7 w-7", page === 1 && "bg-gray-800 hover:bg-gray-700 text-white hover:text-white mr-1")} onClick={() => setFilter({ page: 1 })}>
                        1
                    </Button>
                </PaginationItem>,
            );

            if (page > 3) {
                items.push(
                    <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                    </PaginationItem>,
                );
            }

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPageCount - 1, page + 1);

            for (let i = start; i <= end; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <Button variant="gray" size="sm" className={cn("rounded-full h-7 w-7", page === i && "bg-gray-800 hover:bg-gray-700 text-white hover:text-white mr-1")} onClick={() => setFilter({ page: i })}>
                            {i}
                        </Button>
                    </PaginationItem>,
                );
            }

            if (page < totalPageCount - 2) {
                items.push(
                    <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                    </PaginationItem>,
                );
            }

            items.push(
                <PaginationItem key={totalPageCount}>
                    <Button variant="gray" size="sm" className={cn("rounded-full h-7 w-7", page === totalPageCount && "bg-gray-800 text-white")} onClick={() => setFilter({ page: totalPageCount })}>
                        {totalPageCount}
                    </Button>
                </PaginationItem>,
            );
        }

        return items;
    };

    return (
        <div className={cn("flex md:hidden fixed bg-gray-900 bottom-0 right-0 left-0 flex-col md:flex-row items-center gap-3 w-full", totalCount === 0 && "hidden")}>
            <Pagination className="bg-gray-700 w-[93%] py-1">
                <PaginationContent className="max-sm:gap-0">
                    <PaginationItem>
                        <Button disabled={page === 1} variant="gray" size="icon" className="mr-1 h-7 w-7" onClick={() => setFilter({ page: page - 1 })}>
                            <ChevronLeft />
                        </Button>
                    </PaginationItem>
                    {renderPageNumbers()}
                    <PaginationItem>
                        <Button disabled={page === totalPageCount} variant="gray" size="icon" className="ml-1 h-7 w-7" onClick={() => setFilter({ page: page + 1 })}>
                            <ChevronRight />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

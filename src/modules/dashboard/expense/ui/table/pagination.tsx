"use client";

import { Table } from "@tanstack/react-table";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectItem,
    SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/constant";
import { useExpenseFilter } from "../../filter/use-expense-filter";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    totalCount: number;
}
export function DataTablePagination<TData>({
    table,
    totalCount,
}: DataTablePaginationProps<TData>) {
    const [filter, setFilter] = useExpenseFilter();

    const numberOfPages = Math.ceil(totalCount / filter.limit);

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 gap-y-2">
            <div className="text-muted-foreground flex-1 text-sm text-white">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="hidden md:block text-sm font-medium text-white">Rows per page</p>
                    <Select
                        value={filter.limit.toString()}
                        onValueChange={(value) => {
                            setFilter({ limit: Number(value) });
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue className="text-white" placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {DEFAULT_PAGE_SIZE_OPTIONS.map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium text-white">
                    Page {filter.page} of {numberOfPages}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="gray"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => setFilter({ page: filter.page - 2 })}
                        disabled={filter.page <= 2}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="gray"
                        size="icon"
                        className="size-8"
                        onClick={() => setFilter({ page: filter.page - 1 })}
                        disabled={filter.page < 2}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="gray"
                        size="icon"
                        className="size-8"
                        onClick={() => setFilter({ page: filter.page + 1 })}
                        disabled={filter.page === numberOfPages}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="gray"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => setFilter({ page: filter.page + 2 })}
                        disabled={filter.page + 1 >= numberOfPages}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
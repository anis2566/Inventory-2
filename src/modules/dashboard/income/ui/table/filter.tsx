"use client";

import { Table } from "@tanstack/react-table";
import { CalendarIcon, CircleX, Trash2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { DataTableViewOptions } from "@/components/data-table-view-option";
import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    DEFAULT_SORT_OPTIONS,
    MONTHS,
} from "@/constant";
import { useIncomeFilter } from "../../filter/use-income-filter";
import { useDeleteManyBrand } from "@/hooks/use-brand";

interface HasId {
    id: string;
}

interface FilterProps<TData extends HasId> {
    table: Table<TData>;
}

export const Filter = <TData extends HasId>({ table }: FilterProps<TData>) => {
    const [date, setDate] = useState<Date>()

    const { onOpen } = useDeleteManyBrand();
    const [filter, setFilter] = useIncomeFilter();

    const handleSortChange = (value: string) => {
        setFilter({ sort: value });
    };

    const handleMonthChange = (value: string) => {
        setFilter({ month: value });
    };

    const handleClear = () => {
        setFilter({
            limit: DEFAULT_PAGE_SIZE,
            page: DEFAULT_PAGE,
            sort: "",
            month: "",
            date: ""
        });
    };

    const isAnyModified =
        filter.limit !== 5 ||
        filter.page !== 1 ||
        filter.sort !== "" ||
        filter.month !== "" ||
        filter.date !== "";

    const isMultipleSelected =
        table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

    const onClick = () => {
        const selectedIds = table
            .getSelectedRowModel()
            .rows.map((row) => row.original.id || "");

        onOpen(selectedIds);
    };

    return (
        <div className="w-full flex items-center justify-between">
            <div className="hidden md:flex items-center gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="gray"
                            data-empty={!date}
                            className="text-gray-400 w-[200px] justify-start text-left font-normal"
                        >
                            <CalendarIcon />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-700 text-white border-gray-600">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(value) => {
                                if (value) {
                                    const fixedDate = new Date(value);
                                    fixedDate.setHours(12, 0, 0, 0);
                                    setDate(fixedDate);
                                    setFilter({ date: fixedDate.toISOString() });
                                }
                            }}
                        />
                    </PopoverContent>
                </Popover>
                <Select
                    value={filter.month}
                    onValueChange={(value) => handleMonthChange(value)}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(MONTHS).map((v, i) => (
                            <SelectItem value={v} key={i}>
                                {v}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={filter.sort}
                    onValueChange={(value) => handleSortChange(value)}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        {DEFAULT_SORT_OPTIONS.map((v, i) => (
                            <SelectItem value={v.value} key={i}>
                                {v.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {isAnyModified && (
                    <Button
                        variant="outline"
                        className="text-red-500"
                        onClick={handleClear}
                    >
                        <CircleX />
                        Clear
                    </Button>
                )}
                {isMultipleSelected && (
                    <Button
                        variant="outline"
                        className="text-red-500"
                        onClick={onClick}
                    >
                        <Trash2 />
                        Delete
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
};
"use client";

import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { CalendarIcon, CircleX } from "lucide-react";
import { format } from "date-fns";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { DataTableViewOptions } from "@/components/data-table-view-option";
import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    DEFAULT_SORT_OPTIONS,
} from "@/constant";
import { useIncomingFilter } from "../../filter/use-incoming-filter";
import { useDebounce } from "@/hooks/use-debounce";

interface HasId {
    id: string;
}

interface FilterProps<TData extends HasId> {
    table: Table<TData>;
}

export const Filter = <TData extends HasId>({ table }: FilterProps<TData>) => {
    const [date, setDate] = useState<Date>()
    const [search, setSearch] = useState("")

    const [filter, setFilter] = useIncomingFilter();
    const debouceValue = useDebounce(search, 500);

    useEffect(() => {
        setFilter({ employee: debouceValue });
    }, [debouceValue]);

    const handleSortChange = (value: string) => {
        setFilter({ sort: value });
    };

    const handleClear = () => {
        setSearch("");
        setFilter({
            limit: DEFAULT_PAGE_SIZE,
            page: DEFAULT_PAGE,
            sort: "",
            date: "",
            employee: "",
        });
    };

    const isAnyModified =
        filter.limit !== 5 ||
        filter.page !== 1 ||
        filter.sort !== "" ||
        filter.date !== "" ||
        filter.employee !== "";

    return (
        <div className="w-full flex items-center justify-between">
            <div className="hidden md:flex items-center gap-4">
                <Input 
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search employee..."
                />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="gray"
                            data-empty={!date}
                            className="text-gray-400 w-[150px] justify-start text-left font-normal"
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
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
};
"use client";

import { CalendarIcon, CircleX } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
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

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT_OPTIONS } from "@/constant";
import { useOutgoingFilter } from "../../filter/use-outgoing-filter";

export const MobileFilter = () => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>()

    const [filter, setFilter] = useOutgoingFilter();

    const handleDateChange = (value: Date) => {
        try {
            setFilter({ date: format(value, "yyyy-MM-dd") })
        } finally {
            setOpen(false)
        }
    };

    const handleSortChange = (value: string) => {
        try {
            setFilter({ sort: value });
        } finally {
            setOpen(false)
        }
    };

    const isAnyModified =
        filter.limit !== 5 ||
        filter.page !== 1 ||
        filter.sort !== "" ||
        filter.date !== ""

    const handleClear = () => {
        setFilter({
            limit: DEFAULT_PAGE_SIZE,
            page: DEFAULT_PAGE,
            sort: "",
            date: "",
        });
    };

    return (
        <div className="shadow-sm px-2 py-2 mt-4 sticky top-16 bg-gray-800 border border-gray-700 z-50">
            <div className="flex gap-x-3 w-full">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="gray"
                            data-empty={!date}
                            className="text-gray-400 flex-1 justify-start text-left font-normal"
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
                                    handleDateChange(fixedDate);
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
                        variant="gray"
                        className="text-red-500"
                        onClick={handleClear}
                    >
                        <CircleX />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    )
}
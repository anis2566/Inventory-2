"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { format } from "date-fns"
import { CalendarIcon, CircleX } from "lucide-react"
import * as React from "react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { useSaleReportFilter } from "../../filter/use-sale-report-filter"

export default function Filter({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    const [filter, setFilter] = useSaleReportFilter()

    const isAnyModified =
        filter.startDate !== "" ||
        filter.endDate !== ""

    const handleClear = () => {
        setDate({
            from: new Date(),
            to: new Date(),
        });
        setFilter({
            startDate: "",
            endDate: "",
        });
    };
    return (
        <div className="flex items-center gap-2">
            <div className={cn("grid gap-2", className)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant="gray"
                            className={cn(
                                "w-[230px] justify-start text-left font-normal",
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-700 text-white border-gray-600" align="start">
                        <Calendar
                            autoFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={(range) => {
                                setDate(range)
                                setFilter({
                                    startDate: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
                                    endDate: range?.to ? format(range.to, "yyyy-MM-dd") : undefined
                                })
                            }}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>
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
    )
}
"use client";

import { CalendarIcon, CircleX, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT_OPTIONS, ORDER_STATUS, PAYMENT_STATUS } from "@/constant";
import { useDebounce } from "@/hooks/use-debounce";
import { useOrderFilter } from "../../filter/use-order-filter";

export const MobileFilter = () => {
    const [open, setOpen] = useState(false);
    const [shop, setShop] = useState("")
    const [date, setDate] = useState<Date>()

    const [filter, setFilter] = useOrderFilter();
    const debounceShopValue = useDebounce(shop, 500);

    useEffect(() => {
        setFilter({ search: debounceShopValue });
    }, [debounceShopValue, setFilter]);

    const handlePaymentStatusChange = (value: string) => {
        try {
            setFilter({ paymentStatus: value })
        } finally {
            setOpen(false)
        }
    };

    const handleStatusChange = (value: string) => {
        try {
            setFilter({ status: value })
        } finally {
            setOpen(false)
        }
    };

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
        !!filter.search ||
        filter.limit !== 5 ||
        filter.page !== 1 ||
        filter.sort !== "" ||
        filter.status !== "" ||
        filter.date !== "" ||
        filter.paymentStatus !== ""

    const handleClear = () => {
        setShop("");
        setFilter({
            search: "",
            limit: DEFAULT_PAGE_SIZE,
            page: DEFAULT_PAGE,
            sort: "",
            status: "",
            date: "",
            paymentStatus: ""
        });
    };

    return (
        <div className="shadow-sm px-2 py-2 mt-4 sticky top-16 bg-gray-800 border border-gray-700 z-50">
            <div className="flex gap-x-3 w-full">
                <Input
                    type="search"
                    placeholder="search by transaction id..."
                    value={shop}
                    onChange={(e) => setShop(e.target.value)}
                    className="flex-1 bg-trasparent"
                />

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

                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                        <Button variant="gray">
                            <Filter />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="bg-gray-800 border border-gray-700">
                        <DrawerHeader>
                            <DrawerTitle className="text-white">Filter</DrawerTitle>
                        </DrawerHeader>

                        <div className="px-4 space-y-4">
                            <div className="flex gap-4">
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
                                    value={filter.paymentStatus}
                                    onValueChange={(value) => handlePaymentStatusChange(value)}
                                >
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="P. Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(PAYMENT_STATUS).map((v, i) => (
                                            <SelectItem value={v} key={i}>
                                                {v}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-4">
                                <Select
                                    value={filter.status}
                                    onValueChange={(value) => handleStatusChange(value)}
                                >
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(ORDER_STATUS).map((v, i) => (
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
                                    <SelectTrigger className="flex-1">
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
                            </div>
                        </div>

                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button variant="gray" className="text-rose-400">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    )
}
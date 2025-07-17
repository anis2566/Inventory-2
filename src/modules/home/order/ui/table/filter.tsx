"use client";

import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { CircleX } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/data-table-view-option";

import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    DEFAULT_SORT_OPTIONS,
    ORDER_STATUS,
} from "@/constant";
import { useDebounce } from "@/hooks/use-debounce";
import { useDeleteManyBrand } from "@/hooks/use-brand";
import { useOrderFilter } from "../../filter/use-order-filter";

interface HasId {
    id: string;
}

interface FilterProps<TData extends HasId> {
    table: Table<TData>;
}

export const Filter = <TData extends HasId>({ table }: FilterProps<TData>) => {
    const [search, setSearch] = useState<string>("");

    const { onOpen } = useDeleteManyBrand();
    const [filter, setFilter] = useOrderFilter();
    const debounceSearchValue = useDebounce(search, 500);

    useEffect(() => {
        setFilter({ search: debounceSearchValue });
    }, [debounceSearchValue, setFilter]);

    const handleSortChange = (value: string) => {
        setFilter({ sort: value });
    };

    const handleStatusChange = (value: string) => {
        setFilter({ status: value });
    };

    const handleClear = () => {
        setSearch("");
        setFilter({
            search: "",
            limit: DEFAULT_PAGE_SIZE,
            page: DEFAULT_PAGE,
            sort: "",
            status: "",
        });
    };

    const isAnyModified =
        !!filter.search ||
        filter.limit !== 5 ||
        filter.page !== 1 ||
        filter.sort !== "" ||
        filter.status !== "";

    return (
        <div className="w-full flex items-center justify-between">
            <div className="hidden md:flex items-center gap-4">
                <Input
                    type="search"
                    placeholder="search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Select
                    value={filter.status}
                    onValueChange={(value) => handleStatusChange(value)}
                >
                    <SelectTrigger className="w-[150px]">
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
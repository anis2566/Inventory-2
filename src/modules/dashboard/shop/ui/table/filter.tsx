"use client";

import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { CircleX, Trash2 } from "lucide-react";

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
} from "@/constant";
import { useDebounce } from "@/hooks/use-debounce";
import { useShopFilter } from "../../filter/use-shop-filter";
import { useDeleteManyShop } from "@/hooks/use-shop";

interface HasId {
    id: string;
}

interface FilterProps<TData extends HasId> {
    table: Table<TData>;
}

export const Filter = <TData extends HasId>({ table }: FilterProps<TData>) => {
    const [search, setSearch] = useState<string>("");

    const { onOpen } = useDeleteManyShop();
    const [filter, setFilter] = useShopFilter();
    const debounceSearchValue = useDebounce(search, 500);

    useEffect(() => {
        setFilter({ search: debounceSearchValue });
    }, [debounceSearchValue, setFilter]);

    const handleSortChange = (value: string) => {
        setFilter({ sort: value });
    };

    const handleClear = () => {
        setSearch("");
        setFilter({
            search: "",
            limit: DEFAULT_PAGE_SIZE,
            page: DEFAULT_PAGE,
            sort: "",
        });
    };

    const isAnyModified =
        !!filter.search ||
        filter.limit !== 5 ||
        filter.page !== 1 ||
        filter.sort !== ""

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
                <Input
                    type="search"
                    placeholder="search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
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
import { parseAsString, parseAsInteger, useQueryStates } from "nuqs";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constant";

export const useExpenseFilter = () => {
    return useQueryStates({
        month: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        date: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger
            .withDefault(DEFAULT_PAGE)
            .withOptions({ clearOnDefault: true }),
        limit: parseAsInteger
            .withDefault(DEFAULT_PAGE_SIZE)
            .withOptions({ clearOnDefault: true }),
        sort: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    });
};
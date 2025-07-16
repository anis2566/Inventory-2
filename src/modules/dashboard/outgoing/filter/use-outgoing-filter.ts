import { parseAsString, parseAsInteger, useQueryStates } from "nuqs";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constant";

export const useOutgoingFilter = () => {
    return useQueryStates({
        page: parseAsInteger
            .withDefault(DEFAULT_PAGE)
            .withOptions({ clearOnDefault: true }),
        limit: parseAsInteger
            .withDefault(DEFAULT_PAGE_SIZE)
            .withOptions({ clearOnDefault: true }),
        sort: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        date: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        employee: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    });
};
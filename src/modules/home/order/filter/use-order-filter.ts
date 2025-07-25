import { parseAsString, parseAsInteger, useQueryStates } from "nuqs";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constant";

export const useOrderFilter = () => {
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        status: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        paymentStatus: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger
            .withDefault(DEFAULT_PAGE)
            .withOptions({ clearOnDefault: true }),
        limit: parseAsInteger
            .withDefault(DEFAULT_PAGE_SIZE)
            .withOptions({ clearOnDefault: true }),
        sort: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        date: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    });
};
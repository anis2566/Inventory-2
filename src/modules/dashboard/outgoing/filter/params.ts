import { parseAsString, parseAsInteger, createLoader } from "nuqs/server";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constant";

const filterParmas = {
    page: parseAsInteger
        .withDefault(DEFAULT_PAGE)
        .withOptions({ clearOnDefault: true }),
    limit: parseAsInteger
        .withDefault(DEFAULT_PAGE_SIZE)
        .withOptions({ clearOnDefault: true }),
    sort: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    date: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    employee: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};

export const outgoingSearchParams = createLoader(filterParmas);
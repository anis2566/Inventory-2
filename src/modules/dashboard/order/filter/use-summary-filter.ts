import { parseAsString, useQueryStates } from "nuqs";

export const useSummaryFilter = () => {
    return useQueryStates({
        date: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    });
};
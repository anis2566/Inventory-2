import { parseAsString, useQueryStates } from "nuqs";

export const useSaleReportFilter = () => {
    return useQueryStates({
        startDate: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        endDate: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    });
};
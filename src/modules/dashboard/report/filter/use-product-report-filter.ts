import { parseAsString, useQueryStates } from "nuqs";

export const useProductReportFilter = () => {
    return useQueryStates({
        startDate: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        endDate: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    });
};
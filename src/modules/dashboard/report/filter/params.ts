import { parseAsString, createLoader } from "nuqs/server";

const filterParmas = {
    startDate: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    endDate: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};

export const productReportSearchParams = createLoader(filterParmas);

const saleFilterParmas = {
    startDate: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    endDate: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};

export const saleReportSearchParams = createLoader(saleFilterParmas);
"use client";

import { useTRPC } from "@/trpc/client";
import { PDFViewer } from "@react-pdf/renderer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Invoice } from "./invoice";

export const InvoiceView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.order.invoices.queryOptions())

  return (
    <div>
      <h1 className="text-xl font-semibold text-white">Invoice</h1>
      <p className="text-gray-400 mb-4">
        This is the invoice view. It will display the invoices fetched from the server.
      </p>

      <PDFViewer style={{ width: "100%", height: "1000px" }}>
        {/* <Invoice order={data} /> */}
      </PDFViewer>
    </div>
  )
}
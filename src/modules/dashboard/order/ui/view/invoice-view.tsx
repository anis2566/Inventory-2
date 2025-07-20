"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
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

      <div className="flex items-center justify-center">
        <PDFViewer style={{ width: "50%", height: "1000px" }}>
          <Invoice orders={data} />
        </PDFViewer>
      </div>
    </div>
  )
}
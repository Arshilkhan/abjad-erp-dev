import { createFileRoute } from "@tanstack/react-router";
import { InvoiceForm } from "@/components/invoice-form";
import { isDocumentType } from "@/lib/document-types";

export const Route = createFileRoute("/_authenticated/invoices/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    type: typeof search.type === "string" && isDocumentType(search.type) ? search.type : "tax_invoice",
  }),
  head: () => ({
    meta: [
      { title: "New Document — ABJAD ERP" },
      { name: "description", content: "Create an ABJAD quotation, proforma invoice, tax invoice, or delivery challan." },
      { property: "og:title", content: "New Document — ABJAD ERP" },
      { property: "og:description", content: "Create an ABJAD quotation, proforma invoice, tax invoice, or delivery challan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewDocumentPage,
});

function NewDocumentPage() {
  const { type } = Route.useSearch();
  return <InvoiceForm initialType={type} />;
}
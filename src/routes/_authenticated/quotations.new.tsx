import { createFileRoute } from "@tanstack/react-router";
import { InvoiceForm } from "@/components/invoice-form";
export const Route = createFileRoute("/_authenticated/quotations/new")({
  head: () => ({ meta: [
    { title: "New Quotation — ABJAD ERP" }, { name: "description", content: "Create a new customer quotation." },
    { property: "og:title", content: "New Quotation — ABJAD ERP" }, { property: "og:description", content: "Create a new customer quotation." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: () => <InvoiceForm documentType="quotation" />,
});
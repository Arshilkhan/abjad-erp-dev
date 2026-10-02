import { createFileRoute } from "@tanstack/react-router";
import { InvoiceForm } from "@/components/invoice-form";

export const Route = createFileRoute("/_authenticated/invoices/new")({
  head: () => ({ meta: [
    { title: "New Tax Invoice — ABJAD ERP" },
    { name: "description", content: "Create a new GST tax invoice." },
    { property: "og:title", content: "New Tax Invoice — ABJAD ERP" },
    { property: "og:description", content: "Create a new GST tax invoice." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <InvoiceForm />,
});
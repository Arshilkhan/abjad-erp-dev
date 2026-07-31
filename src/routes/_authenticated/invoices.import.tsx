import { createFileRoute } from "@tanstack/react-router";
import { InvoiceForm } from "@/components/invoice-form";

export const Route = createFileRoute("/_authenticated/invoices/import")({
  head: () => ({ meta: [{ title: "Import Invoice — ABJAD ERP" }] }),
  component: () => <InvoiceForm importMode />,
});
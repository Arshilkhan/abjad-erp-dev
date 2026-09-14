import { createFileRoute } from "@tanstack/react-router";
import { InvoiceForm } from "@/components/invoice-form";

export const Route = createFileRoute("/_authenticated/invoices/new")({
  head: () => ({ meta: [{ title: "New Invoice — ABJAD ERP" }] }),
  component: () => <InvoiceForm />,
});
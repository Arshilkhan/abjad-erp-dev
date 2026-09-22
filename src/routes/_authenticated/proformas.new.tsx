import { createFileRoute } from "@tanstack/react-router";
import { InvoiceForm } from "@/components/invoice-form";

export const Route = createFileRoute("/_authenticated/proformas/new")({
  head: () => ({ meta: [
    { title: "New Proforma Invoice — ABJAD ERP" },
    { name: "description", content: "Create a new proforma invoice." },
    { property: "og:title", content: "New Proforma Invoice — ABJAD ERP" },
    { property: "og:description", content: "Create a new proforma invoice." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <InvoiceForm documentType="proforma" />,
});
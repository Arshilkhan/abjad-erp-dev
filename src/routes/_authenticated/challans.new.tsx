import { createFileRoute } from "@tanstack/react-router";
import { InvoiceForm } from "@/components/invoice-form";
export const Route = createFileRoute("/_authenticated/challans/new")({
  head: () => ({ meta: [
    { title: "New Delivery Challan — ABJAD ERP" }, { name: "description", content: "Create a new delivery challan." },
    { property: "og:title", content: "New Delivery Challan — ABJAD ERP" }, { property: "og:description", content: "Create a new delivery challan." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: () => <InvoiceForm documentType="delivery_challan" />,
});
import { createFileRoute } from "@tanstack/react-router";
import { InvoiceForm } from "@/components/invoice-form";

export const Route = createFileRoute("/_authenticated/invoices/$id/edit")({
  head: () => ({ meta: [{ title: "Edit Invoice — ABJAD ERP" }] }),
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  return <InvoiceForm editId={id} />;
}
import { createFileRoute } from "@tanstack/react-router";
import { InvoiceForm } from "@/components/invoice-form";
import { isSalesDocumentKind, type SalesDocumentKind } from "@/lib/sales-documents";

export const Route = createFileRoute("/_authenticated/invoices/$id/edit")({
  validateSearch: (search: Record<string, unknown>): { kind?: SalesDocumentKind } => {
    const k = typeof search.kind === "string" ? search.kind : "";
    return isSalesDocumentKind(k) ? { kind: k } : {};
  },
  head: () => ({ meta: [{ title: "Edit Invoice — ABJAD ERP" }] }),
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  const { kind } = Route.useSearch();
  return <InvoiceForm key={`${kind}-${id}`} editId={id} documentType={kind ?? "tax_invoice"} />;
}
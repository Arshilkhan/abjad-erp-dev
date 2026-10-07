import { createFileRoute } from "@tanstack/react-router";
import { DocumentFolderView } from "@/components/documents/document-folder-view";

export const Route = createFileRoute("/_authenticated/quotations/")({
  head: () => ({
    meta: [
      { title: "Quotations — ABJAD ERP" },
      { name: "description", content: "All customer quotations and proforma documents in one place." },
      { property: "og:title", content: "Quotations — ABJAD ERP" },
      { property: "og:description", content: "All customer quotations and proforma documents in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QuotationsPage,
});

function QuotationsPage() {
  return (
    <DocumentFolderView
      title="Quotations"
      description="Quotations are stored separately from invoices."
      table="quotation"
      kind="quotation"
      storageKey="abjad-erp-quotations-view"
      folderBasePath="/quotations/folder"
      createPath="/quotations/new"
    />
  );
}

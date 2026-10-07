import { createFileRoute } from "@tanstack/react-router";
import { DocumentFolderView } from "@/components/documents/document-folder-view";

export const Route = createFileRoute("/_authenticated/proformas/")({
  head: () => ({
    meta: [
      { title: "Proforma Invoices — ABJAD ERP" },
      { name: "description", content: "Create and manage customer proforma invoices." },
      { property: "og:title", content: "Proforma Invoices — ABJAD ERP" },
      { property: "og:description", content: "Create and manage customer proforma invoices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProformasPage,
});

function ProformasPage() {
  return (
    <DocumentFolderView
      title="Proforma Invoices"
      description="Proforma invoices are stored separately from tax invoices."
      table="performa"
      kind="proforma"
      storageKey="abjad-erp-proformas-view"
      folderBasePath="/proformas/folder"
      createPath="/proformas/new"
    />
  );
}

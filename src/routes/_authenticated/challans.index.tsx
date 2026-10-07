import { createFileRoute } from "@tanstack/react-router";
import { DocumentFolderView } from "@/components/documents/document-folder-view";

export const Route = createFileRoute("/_authenticated/challans/")({
  head: () => ({
    meta: [
      { title: "Delivery Challans — ABJAD ERP" },
      {
        name: "description",
        content: "Every delivery challan issued to customers, filed in one place.",
      },
      { property: "og:title", content: "Delivery Challans — ABJAD ERP" },
      {
        property: "og:description",
        content: "Every delivery challan issued to customers, filed in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChallansPage,
});

function ChallansPage() {
  return (
    <DocumentFolderView
      title="Delivery Challans"
      description="Delivery challans are filed here and are not given a bill number."
      table="challan"
      kind="delivery_challan"
      storageKey="abjad-erp-challans-view"
      folderBasePath="/challans/folder"
      createPath="/challans/new"
    />
  );
}

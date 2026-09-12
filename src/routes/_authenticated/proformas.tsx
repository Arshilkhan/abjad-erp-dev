import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FilePlus2, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { InvoiceTable } from "@/components/invoice-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useInvoiceFolders } from "@/lib/invoice-folders";

export const Route = createFileRoute("/_authenticated/proformas")({
  head: () => ({
    meta: [
      { title: "Proforma Invoices — ABJAD ERP" },
      { name: "description", content: "Create and manage ABJAD proforma invoices." },
      { property: "og:title", content: "Proforma Invoices — ABJAD ERP" },
      { property: "og:description", content: "Create and manage ABJAD proforma invoices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProformasPage,
});

function ProformasPage() {
  const { folders, isLoading } = useInvoiceFolders({ only: ["proforma"] });
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const rows = folders.flatMap((folder) => folder.rows).filter((row: any) =>
    !search || [row.invoice_number, row.customer_name_snapshot].filter(Boolean)
      .some((value: string) => String(value).toLowerCase().includes(search)),
  );

  return (
    <>
      <PageHeader
        title="Proforma Invoices"
        description="Proforma documents are kept separate from finalized tax invoices."
        actions={<Button asChild><Link to="/invoices/new" search={{ type: "proforma" }}><FilePlus2 className="mr-1 h-4 w-4" /> New Proforma</Link></Button>}
      />
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="h-9 pl-9" placeholder="Search proforma invoices…" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <Card>
        <CardContent className="p-0">
          {!isLoading && rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No proforma invoices yet.</p>
          ) : <InvoiceTable rows={rows} isLoading={isLoading} />}
        </CardContent>
      </Card>
    </>
  );
}
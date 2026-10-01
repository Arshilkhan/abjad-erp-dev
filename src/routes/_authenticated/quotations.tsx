import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { InvoiceTable } from "@/components/invoice-table";
import { useInvoiceFolders } from "@/lib/invoice-folders";

export const Route = createFileRoute("/_authenticated/quotations")({
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
  const { folders, isLoading } = useInvoiceFolders({ table: "quotation", kind: "quotation" });
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();

  const rows = folders.flatMap((f) => f.rows).filter((r: any) =>
    !s || [r.invoice_number, r.customer_name_snapshot].filter(Boolean)
      .some((v: string) => String(v).toLowerCase().includes(s)),
  );

  return (
    <>
      <PageHeader
        title="Quotations"
        description="Quotations are stored separately from invoices."
      />
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="h-9 pl-9" placeholder="Search quotations…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <Card>
        <CardContent className="p-0">
          {!isLoading && rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
               No quotations yet. <Link to="/quotations/new" className="text-primary hover:underline">Create one</Link>.
            </p>
          ) : (
            <InvoiceTable rows={rows} isLoading={isLoading} />
          )}
        </CardContent>
      </Card>
    </>
  );
}

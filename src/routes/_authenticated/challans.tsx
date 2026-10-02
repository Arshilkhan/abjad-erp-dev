import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { InvoiceTable } from "@/components/invoice-table";
import { useInvoiceFolders } from "@/lib/invoice-folders";

export const Route = createFileRoute("/_authenticated/challans")({
  head: () => ({
    meta: [
      { title: "Delivery Challans — ABJAD ERP" },
      { name: "description", content: "Every delivery challan issued to customers, filed in one place." },
      { property: "og:title", content: "Delivery Challans — ABJAD ERP" },
      { property: "og:description", content: "Every delivery challan issued to customers, filed in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChallansLayout,
});

function ChallansLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return path === "/challans" ? <ChallansPage /> : <Outlet />;
}

function ChallansPage() {
  const { folders, isLoading } = useInvoiceFolders({ table: "challan", kind: "delivery_challan" });
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();

  const rows = folders.flatMap((f) => f.rows).filter((r: any) =>
    !s || [r.customer_name_snapshot, r.challan_number, r.po_number].filter(Boolean)
      .some((v: string) => String(v).toLowerCase().includes(s)),
  );

  return (
    <>
      <PageHeader
        title="Delivery Challans"
        description="Delivery challans are filed here and are not given a bill number."
      />
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="h-9 pl-9" placeholder="Search challans…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <Card>
        <CardContent className="p-0">
          {!isLoading && rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
               No challans yet. <Link to="/challans/new" className="text-primary hover:underline">Create one</Link>.
            </p>
          ) : (
            <InvoiceTable rows={rows} isLoading={isLoading} />
          )}
        </CardContent>
      </Card>
    </>
  );
}

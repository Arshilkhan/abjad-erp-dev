import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InvoiceTable } from "@/components/invoice-table";
import { useInvoiceFolders } from "@/lib/invoice-folders";

export const Route = createFileRoute("/_authenticated/proformas")({
  head: () => ({ meta: [
    { title: "Proforma Invoices — ABJAD ERP" },
    { name: "description", content: "Create and manage customer proforma invoices." },
    { property: "og:title", content: "Proforma Invoices — ABJAD ERP" },
    { property: "og:description", content: "Create and manage customer proforma invoices." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ProformasLayout,
});

function ProformasLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return path === "/proformas" ? <ProformasPage /> : <Outlet />;
}

function ProformasPage() {
  const { folders, isLoading } = useInvoiceFolders({ table: "performa", kind: "proforma" });
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();
  const rows = folders.flatMap((f) => f.rows).filter((r: any) => !s || [r.invoice_number, r.customer_name_snapshot].filter(Boolean).some((v) => String(v).toLowerCase().includes(s)));
  return <>
    <PageHeader title="Proforma Invoices" description="Proforma invoices are stored separately from tax invoices." />
    <div className="relative mb-4 max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="h-9 pl-9" placeholder="Search proforma invoices…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
    <Card><CardContent className="p-0"><InvoiceTable rows={rows} isLoading={isLoading} /></CardContent></Card>
  </>;
}
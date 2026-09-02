import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatINR, formatDate, billNo } from "@/lib/format";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cancelled-invoices")({
  head: () => ({ meta: [{ title: "Cancelled Invoices — ABJAD ERP" }] }),
  component: CancelledInvoicesPage,
});

function CancelledInvoicesPage() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["cancelled-invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("status", "cancelled")
        .order("cancelled_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r: any) =>
      r.invoice_number.toLowerCase().includes(s) ||
      (r.customer_name_snapshot ?? "").toLowerCase().includes(s) ||
      (r.cancellation_reason ?? "").toLowerCase().includes(s));
  }, [rows, q]);

  return (
    <>
      <PageHeader title="Cancelled Invoices" description="Cancelled invoices are retained here permanently and cannot be edited or deleted." />
      <Card>
        <CardContent className="p-4">
          <div className="relative mb-3 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search invoice #, customer, reason…" value={q} onChange={(e) => setQ(e.target.value)} className="h-9 pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Cancelled On</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Loading…</TableCell></TableRow>}
              {!isLoading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No cancelled invoices.</TableCell></TableRow>
              )}
              {filtered.map((r: any) => (
                <TableRow key={r.id} className="hover:bg-muted/40">
                  <TableCell className="font-mono text-sm">
                    <Link to="/invoices/$id" params={{ id: r.id }} className="text-primary hover:underline">{billNo(r.invoice_number)}</Link>
                  </TableCell>
                  <TableCell>{r.customer_name_snapshot ?? "—"}</TableCell>
                  <TableCell>{formatDate(r.invoice_date)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatINR(r.grand_total)}</TableCell>
                  <TableCell>{r.cancelled_at ? formatDate(r.cancelled_at) : "—"}</TableCell>
                  <TableCell className="max-w-[280px] truncate text-muted-foreground">{r.cancellation_reason ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
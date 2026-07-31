import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatINR, formatDate } from "@/lib/format";
import { Plus, Pencil, Ban, Upload } from "lucide-react";
import { CancelInvoiceDialog } from "@/components/cancel-invoice-dialog";

export const Route = createFileRoute("/_authenticated/invoices")({
  head: () => ({ meta: [{ title: "Invoices — ABJAD ERP" }] }),
  component: InvoicesLayout,
});

function InvoicesLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  if (path !== "/invoices") return <Outlet />;
  return <InvoicesIndex />;
}

const statusStyles: Record<string, string> = {
  paid: "bg-[color:oklch(0.92_0.06_155)] text-[color:oklch(0.35_0.14_155)] border-transparent",
  sent: "bg-secondary text-secondary-foreground",
  partial: "bg-[color:oklch(0.94_0.09_75)] text-[color:oklch(0.40_0.15_75)] border-transparent",
  draft: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive border-transparent",
};

function InvoicesIndex() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("invoices")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <>
      <PageHeader
        title="Invoices"
        description="All tax invoices, proformas, and challans."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/invoices/import"><Upload className="mr-1 h-4 w-4" /> Import Invoice</Link>
            </Button>
            <Button asChild>
              <Link to="/invoices/new"><Plus className="mr-1 h-4 w-4" /> New Invoice</Link>
            </Button>
          </div>
        }
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Loading…</TableCell></TableRow>}
              {!isLoading && rows.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No invoices yet. <Link to="/invoices/new" className="text-primary hover:underline">Create your first invoice</Link>.
                </TableCell></TableRow>
              )}
              {rows.map((r: any) => (
                <TableRow key={r.id} className={`cursor-pointer hover:bg-muted/40 ${r.status === "cancelled" ? "opacity-60" : ""}`}>
                  <TableCell className="font-mono text-sm font-medium">
                    <Link to="/invoices/$id" params={{ id: r.id }} className="text-primary hover:underline">{r.invoice_number}</Link>
                    {r.is_imported && <Badge variant="outline" className="ml-2 text-[9px] uppercase">Imported</Badge>}
                  </TableCell>
                  <TableCell><span className="text-xs uppercase tracking-wider text-muted-foreground">{r.invoice_type.replace("_", " ")}</span></TableCell>
                  <TableCell>{r.customer_name_snapshot ?? "—"}</TableCell>
                  <TableCell>{formatDate(r.invoice_date)}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatINR(r.grand_total)}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] font-medium uppercase ${statusStyles[r.status] ?? ""}`}>{r.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {r.status !== "cancelled" && (
                        <>
                          <Button size="icon" variant="ghost" asChild title="Edit">
                            <Link to="/invoices/$id/edit" params={{ id: r.id }}><Pencil className="h-3.5 w-3.5" /></Link>
                          </Button>
                          <CancelInvoiceDialog
                            invoiceId={r.id}
                            invoiceNumber={r.invoice_number}
                            onCancelled={() => qc.invalidateQueries({ queryKey: ["invoices"] })}
                            trigger={
                              <Button size="icon" variant="ghost" title="Cancel invoice"><Ban className="h-3.5 w-3.5 text-destructive" /></Button>
                            }
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
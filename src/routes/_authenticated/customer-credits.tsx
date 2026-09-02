import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, formatDate, billNo } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/customer-credits")({
  head: () => ({ meta: [{ title: "Customer Credits — ABJAD ERP" }] }),
  component: CustomerCreditsPage,
});

function CustomerCreditsPage() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["customer-credits"],
    queryFn: async () => {
      const { data } = await (supabase.from("customer_credits") as any)
        .select("*, customers(name), invoices(invoice_number)")
        .order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const markRefunded = async (id: string) => {
    const { error } = await (supabase.from("customer_credits") as any).update({ status: "refunded" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Marked as refunded");
    qc.invalidateQueries({ queryKey: ["customer-credits"] });
  };
  const markApplied = async (id: string) => {
    const { error } = await (supabase.from("customer_credits") as any).update({ status: "applied" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Marked as applied to next invoice");
    qc.invalidateQueries({ queryKey: ["customer-credits"] });
  };

  const total = rows.reduce((s: number, r: any) => s + Number(r.credit_amount), 0);
  const open = rows.filter((r: any) => r.status === "open").reduce((s: number, r: any) => s + Number(r.credit_amount), 0);

  return (
    <>
      <PageHeader title="Customer Credits" description="Auto-generated from rejected items. Refund customer or apply against the next invoice." />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total Credits" value={formatINR(total)} />
        <StatCard label="Open Credits" value={formatINR(open)} accent />
        <StatCard label="Entries" value={String(rows.length)} />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Source Invoice</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Loading…</TableCell></TableRow>}
              {!isLoading && rows.length === 0 && <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No credits yet.</TableCell></TableRow>}
              {rows.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs">{formatDate(r.created_at)}</TableCell>
                  <TableCell>{r.customers?.name ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {r.source_invoice_id ? (
                      <Link to="/invoices/$id" params={{ id: r.source_invoice_id }} className="text-primary hover:underline">{billNo(r.invoices?.invoice_number) || "—"}</Link>
                    ) : "—"}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatINR(r.credit_amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase text-[10px]">{r.status}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-muted-foreground">{r.notes ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    {r.status === "open" && (
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="outline" onClick={() => markRefunded(r.id)}>Refund</Button>
                        <Button size="sm" variant="outline" onClick={() => markApplied(r.id)}>Apply</Button>
                      </div>
                    )}
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

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`mt-1 text-2xl font-semibold tabular-nums ${accent ? "text-primary" : ""}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
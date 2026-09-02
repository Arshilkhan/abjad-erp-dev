import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatINR, formatDate, billNo } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/rejected-items")({
  head: () => ({ meta: [{ title: "Rejected Items — ABJAD ERP" }] }),
  component: RejectedItemsPage,
});

function RejectedItemsPage() {
  return (
    <>
      <PageHeader title="Rejected Items" description="All returned / defective items across invoices, plus the rejected inventory holding stock." />
      <Tabs defaultValue="rejections">
        <TabsList>
          <TabsTrigger value="rejections">Rejections</TabsTrigger>
          <TabsTrigger value="inventory">Rejected Inventory</TabsTrigger>
        </TabsList>
        <TabsContent value="rejections"><RejectionsList /></TabsContent>
        <TabsContent value="inventory"><RejectedInventoryList /></TabsContent>
      </Tabs>
    </>
  );
}

function RejectionsList() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["all-rejections"],
    queryFn: async () => {
      const { data } = await (supabase.from("invoice_rejections") as any)
        .select("*, invoices(invoice_number, customer_name_snapshot), invoice_items(description)")
        .order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Disposition</TableHead>
              <TableHead className="text-right">Deduction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">Loading…</TableCell></TableRow>}
            {!isLoading && rows.length === 0 && <TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">No rejections recorded.</TableCell></TableRow>}
            {rows.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="text-xs">{formatDate(r.created_at)}</TableCell>
                <TableCell className="font-mono text-xs">
                  <Link to="/invoices/$id" params={{ id: r.invoice_id }} className="text-primary hover:underline">{billNo(r.invoices?.invoice_number) || "—"}</Link>
                </TableCell>
                <TableCell>{r.invoices?.customer_name_snapshot ?? "—"}</TableCell>
                <TableCell className="max-w-[220px] truncate">{r.invoice_items?.description ?? "—"}</TableCell>
                <TableCell className="text-right tabular-nums">{Number(r.rejected_quantity)}</TableCell>
                <TableCell>{r.rejection_reason}</TableCell>
                <TableCell className="text-xs uppercase text-muted-foreground">{r.disposition}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{formatINR(r.total_deduction)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RejectedInventoryList() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["rejected-inventory"],
    queryFn: async () => {
      const { data } = await (supabase.from("rejected_inventory") as any).select("*").order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead>UOM</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Disposition</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Loading…</TableCell></TableRow>}
            {!isLoading && rows.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">Rejected inventory is empty.</TableCell></TableRow>}
            {rows.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="text-xs">{formatDate(r.created_at)}</TableCell>
                <TableCell className="max-w-[280px] truncate">{r.description}</TableCell>
                <TableCell className="text-right tabular-nums">{Number(r.quantity)}</TableCell>
                <TableCell>{r.uom ?? "—"}</TableCell>
                <TableCell>{r.reason ?? "—"}</TableCell>
                <TableCell className="text-xs uppercase">{r.disposition}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
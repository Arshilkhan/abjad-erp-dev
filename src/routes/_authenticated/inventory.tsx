import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatINR } from "@/lib/format";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/inventory")({
  head: () => ({ meta: [{ title: "Inventory — ABJAD ERP" }] }),
  component: InventoryPage,
});

function InventoryPage() {
  const { data: products = [] } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => (await supabase.from("products").select("*").order("stock_quantity", { ascending: true })).data ?? [],
  });

  const totalValue = products.reduce((a: number, p: any) => a + Number(p.stock_quantity) * Number(p.purchase_price), 0);
  const lowStock = products.filter((p: any) => Number(p.stock_quantity) <= Number(p.minimum_stock) && Number(p.minimum_stock) > 0);

  return (
    <>
      <PageHeader title="Inventory" description="Real-time stock levels and valuation across all products." />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total SKUs" value={String(products.length)} />
        <StatCard label="Inventory Value" value={formatINR(totalValue)} />
        <StatCard label="Low Stock Items" value={String(lowStock.length)} accent={lowStock.length > 0 ? "warning" : undefined} />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>HSN</TableHead>
                <TableHead className="text-right">On Hand</TableHead>
                <TableHead className="text-right">Min</TableHead>
                <TableHead className="text-right">Max</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p: any) => {
                const low = Number(p.stock_quantity) <= Number(p.minimum_stock) && Number(p.minimum_stock) > 0;
                const value = Number(p.stock_quantity) * Number(p.purchase_price);
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.product_name}</div>
                      <div className="font-mono text-xs text-muted-foreground">{p.product_code ?? "—"}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.hsn_code ?? "—"}</TableCell>
                    <TableCell className="text-right tabular-nums">{p.stock_quantity} {p.unit}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{p.minimum_stock}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{p.maximum_stock}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatINR(value)}</TableCell>
                    <TableCell>
                      {low ? (
                        <Badge variant="outline" className="border-transparent bg-[color:oklch(0.94_0.09_75)] text-[color:oklch(0.40_0.15_75)]">
                          <AlertTriangle className="mr-1 h-3 w-3" /> Low
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-transparent bg-[color:oklch(0.92_0.06_155)] text-[color:oklch(0.35_0.14_155)]">In stock</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {products.length === 0 && <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No products yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-y-0 left-0 w-1 ${accent === "warning" ? "bg-warning" : "bg-primary"}`} />
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
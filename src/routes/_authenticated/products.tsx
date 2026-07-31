import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/products")({
  head: () => ({ meta: [{ title: "Products — ABJAD ERP" }] }),
  component: ProductsPage,
});

const empty = {
  product_name: "", product_code: "", hsn_code: "", description: "",
  unit: "NOS", gst_percentage: 18, selling_price: 0, purchase_price: 0,
  stock_quantity: 0, minimum_stock: 0, maximum_stock: 0,
  drawing_number: "", material: "", weight: 0, dimensions: "",
};

function ProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ ...empty });

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("product_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        gst_percentage: Number(form.gst_percentage) || 0,
        selling_price: Number(form.selling_price) || 0,
        purchase_price: Number(form.purchase_price) || 0,
        stock_quantity: Number(form.stock_quantity) || 0,
        minimum_stock: Number(form.minimum_stock) || 0,
        maximum_stock: Number(form.maximum_stock) || 0,
        weight: Number(form.weight) || null,
      };
      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Product updated" : "Product added");
      qc.invalidateQueries({ queryKey: ["products"] });
      setOpen(false); setEditingId(null); setForm({ ...empty });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["products"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = rows.filter((r: any) =>
    !search ||
    [r.product_name, r.product_code, r.hsn_code, r.material]
      .filter(Boolean).some((v: string) => v.toLowerCase().includes(search.toLowerCase()))
  );

  const openEdit = (row: any) => {
    setEditingId(row.id); setForm({ ...empty, ...row }); setOpen(true);
  };

  const fields: [keyof typeof empty, string, string?][] = [
    ["product_name", "Product Name *"],
    ["product_code", "Product Code"],
    ["hsn_code", "HSN Code"],
    ["unit", "Unit (NOS/KG/M)"],
    ["gst_percentage", "GST %", "number"],
    ["selling_price", "Selling Price (₹)", "number"],
    ["purchase_price", "Purchase Price (₹)", "number"],
    ["stock_quantity", "Stock Qty", "number"],
    ["minimum_stock", "Minimum Stock", "number"],
    ["maximum_stock", "Maximum Stock", "number"],
    ["drawing_number", "Drawing Number"],
    ["material", "Material"],
    ["weight", "Weight (kg)", "number"],
    ["dimensions", "Dimensions"],
  ];

  return (
    <>
      <PageHeader
        title="Products"
        description={`${rows.length} products in catalog.`}
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditingId(null); setForm({ ...empty }); } }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" /> New Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader><DialogTitle>{editingId ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
              <div className="grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-3">
                {fields.map(([k, label, type]) => (
                  <div key={k as string} className="space-y-1.5">
                    <Label className="text-xs">{label}</Label>
                    <Input type={type ?? "text"} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                  </div>
                ))}
                <div className="space-y-1.5 sm:col-span-3">
                  <Label className="text-xs">Description</Label>
                  <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => save.mutate()} disabled={!form.product_name || save.isPending}>
                  {save.isPending ? "Saving…" : "Save Product"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b p-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, code, HSN…" className="h-9 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>HSN</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Loading…</TableCell></TableRow>}
              {!isLoading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No products.</TableCell></TableRow>
              )}
              {filtered.map((r: any) => {
                const low = Number(r.stock_quantity) <= Number(r.minimum_stock) && Number(r.minimum_stock) > 0;
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium">{r.product_name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{r.product_code ?? "—"}{r.material && ` • ${r.material}`}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{r.hsn_code ?? "—"}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatINR(r.selling_price)}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.gst_percentage}%</TableCell>
                    <TableCell className="text-right tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        {low && <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
                        {r.stock_quantity} {r.unit}
                      </span>
                      {low && <Badge variant="outline" className="ml-1 text-[10px]">Low</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => confirm("Delete this product?") && remove.mutate(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
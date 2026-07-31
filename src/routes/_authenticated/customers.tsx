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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/customers")({
  head: () => ({ meta: [{ title: "Customers — ABJAD ERP" }] }),
  component: CustomersPage,
});

const empty = {
  customer_name: "", company_name: "", billing_address: "", shipping_address: "",
  contact_person: "", mobile: "", email: "", gst_number: "", pan_number: "",
  state: "Maharashtra", state_code: "27", place_of_supply: "Maharashtra",
  credit_limit: 0, payment_terms: "30 Days", notes: "",
};

function CustomersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...empty });

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = { ...form, credit_limit: Number(form.credit_limit) || 0 };
      if (editingId) {
        const { error } = await supabase.from("customers").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("customers").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Customer updated" : "Customer added");
      qc.invalidateQueries({ queryKey: ["customers"] });
      setOpen(false); setEditingId(null); setForm({ ...empty });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["customers"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = rows.filter((r: any) =>
    !search ||
    [r.customer_name, r.company_name, r.gst_number, r.mobile, r.email]
      .filter(Boolean).some((v: string) => v.toLowerCase().includes(search.toLowerCase()))
  );

  const openEdit = (row: any) => {
    setEditingId(row.id);
    setForm({ ...empty, ...row, credit_limit: row.credit_limit ?? 0 });
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Customers"
        description={`${rows.length} customer${rows.length === 1 ? "" : "s"} in your directory.`}
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditingId(null); setForm({ ...empty }); } }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" /> New Customer</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader><DialogTitle>{editingId ? "Edit Customer" : "New Customer"}</DialogTitle></DialogHeader>
              <div className="grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
                {([
                  ["customer_name", "Customer Name *"],
                  ["company_name", "Company Name"],
                  ["contact_person", "Contact Person"],
                  ["mobile", "Mobile"],
                  ["email", "Email"],
                  ["gst_number", "GST Number"],
                  ["pan_number", "PAN Number"],
                  ["state", "State"],
                  ["state_code", "State Code"],
                  ["place_of_supply", "Place of Supply"],
                  ["credit_limit", "Credit Limit (₹)", "number"],
                  ["payment_terms", "Payment Terms"],
                ] as const).map(([k, label, type]) => (
                  <div key={k} className="space-y-1.5">
                    <Label className="text-xs">{label}</Label>
                    <Input
                      type={type ?? "text"}
                      value={(form as any)[k] ?? ""}
                      onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    />
                  </div>
                ))}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs">Billing Address</Label>
                  <Textarea rows={2} value={form.billing_address} onChange={(e) => setForm({ ...form, billing_address: e.target.value })} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs">Shipping Address</Label>
                  <Textarea rows={2} value={form.shipping_address} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs">Notes</Label>
                  <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => save.mutate()} disabled={!form.customer_name || save.isPending}>
                  {save.isPending ? "Saving…" : "Save Customer"}
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
              <Input placeholder="Search by name, GST, mobile…" className="h-9 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Credit Limit</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Loading…</TableCell></TableRow>}
              {!isLoading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No customers found.</TableCell></TableRow>
              )}
              {filtered.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{r.company_name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{r.contact_person ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{r.mobile} {r.email && `• ${r.email}`}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{r.gst_number ?? "—"}</TableCell>
                  <TableCell><span className="text-sm">{r.state}</span> <span className="text-xs text-muted-foreground">({r.state_code})</span></TableCell>
                  <TableCell className="text-right tabular-nums">{formatINR(r.credit_limit)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => confirm("Delete this customer?") && remove.mutate(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
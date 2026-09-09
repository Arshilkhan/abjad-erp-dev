import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatINR, formatDate } from "@/lib/format";
import { TypeaheadInput, type TypeaheadOption } from "@/components/typeahead-input";
import { Plus, Trash2, Download, Mail } from "lucide-react";
import { buildPOHtml, printPOHtml } from "@/lib/po-print";
import { useServerFn } from "@tanstack/react-start";
import { sendPoEmail } from "@/lib/po-email.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/purchases")({
  head: () => ({ meta: [{ title: "Purchases — ABJAD ERP" }] }),
  component: PurchasesPage,
});

function PurchasesPage() {
  return (
    <>
      <PageHeader title="Purchases" description="Vendor directory and purchase orders." />
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>
        <TabsContent value="orders"><PurchaseOrdersTab /></TabsContent>
        <TabsContent value="vendors"><VendorsTab /></TabsContent>
      </Tabs>
    </>
  );
}

function VendorsTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => (await supabase.from("vendors").select("*").order("vendor_name")).data ?? [],
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex justify-end">
          <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="mr-1 h-4 w-4" /> Add Vendor
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>GSTIN</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>City / State</TableHead>
              <TableHead>Terms</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No vendors yet.</TableCell></TableRow>}
            {vendors.map((v: any) => (
              <TableRow key={v.id} className="cursor-pointer" onClick={() => { setEditing(v); setOpen(true); }}>
                <TableCell className="font-medium">{v.vendor_name}{v.company_name && <div className="text-xs text-muted-foreground">{v.company_name}</div>}</TableCell>
                <TableCell>{v.contact_person ?? "—"}</TableCell>
                <TableCell className="font-mono text-xs">{v.gst_number ?? "—"}</TableCell>
                <TableCell>{v.mobile ?? "—"}</TableCell>
                <TableCell className="text-xs">{[v.city, v.state].filter(Boolean).join(", ") || "—"}</TableCell>
                <TableCell className="text-xs">{v.payment_terms ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <VendorDialog open={open} onClose={() => setOpen(false)} vendor={editing} onSaved={() => qc.invalidateQueries({ queryKey: ["vendors"] })} />
      </CardContent>
    </Card>
  );
}

function VendorDialog({ open, onClose, vendor, onSaved }: { open: boolean; onClose: () => void; vendor: any; onSaved: () => void }) {
  const isEdit = !!vendor;
  const [form, setForm] = useState<any>(vendor ?? {});
  // reset when vendor changes
  const key = vendor?.id ?? "new";
  if ((form as any).__key !== key) { setForm({ ...(vendor ?? {}), __key: key }); }
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.vendor_name) return toast.error("Vendor name is required");
    const { __key, id, created_at, updated_at, created_by, ...payload } = form;
    if (isEdit) {
      const { error } = await supabase.from("vendors").update(payload).eq("id", vendor.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("vendors").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success(isEdit ? "Vendor updated" : "Vendor added");
    onSaved(); onClose();
  };

  const del = async () => {
    if (!confirm("Delete this vendor?")) return;
    const { error } = await supabase.from("vendors").delete().eq("id", vendor.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); onSaved(); onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{isEdit ? "Edit Vendor" : "Add Vendor"}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Vendor Name *</Label><Input value={form.vendor_name ?? ""} onChange={(e) => set("vendor_name", e.target.value)} /></div>
          <div><Label>Company Name</Label><Input value={form.company_name ?? ""} onChange={(e) => set("company_name", e.target.value)} /></div>
          <div><Label>Contact Person</Label><Input value={form.contact_person ?? ""} onChange={(e) => set("contact_person", e.target.value)} /></div>
          <div><Label>Mobile</Label><Input value={form.mobile ?? ""} onChange={(e) => set("mobile", e.target.value)} /></div>
          <div><Label>Email</Label><Input value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} /></div>
          <div><Label>GSTIN</Label><Input value={form.gst_number ?? ""} onChange={(e) => set("gst_number", e.target.value)} /></div>
          <div><Label>PAN</Label><Input value={form.pan_number ?? ""} onChange={(e) => set("pan_number", e.target.value)} /></div>
          <div><Label>State</Label><Input value={form.state ?? ""} onChange={(e) => set("state", e.target.value)} /></div>
          <div><Label>State Code</Label><Input value={form.state_code ?? ""} onChange={(e) => set("state_code", e.target.value)} /></div>
          <div><Label>City</Label><Input value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} /></div>
          <div className="col-span-2"><Label>Address</Label><Textarea rows={2} value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} /></div>
          <div><Label>Bank Name</Label><Input value={form.bank_name ?? ""} onChange={(e) => set("bank_name", e.target.value)} /></div>
          <div><Label>Account No.</Label><Input value={form.bank_account ?? ""} onChange={(e) => set("bank_account", e.target.value)} /></div>
          <div><Label>IFSC</Label><Input value={form.bank_ifsc ?? ""} onChange={(e) => set("bank_ifsc", e.target.value)} /></div>
          <div><Label>Payment Terms</Label><Input value={form.payment_terms ?? ""} onChange={(e) => set("payment_terms", e.target.value)} /></div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <div>{isEdit && <Button variant="destructive" size="sm" onClick={del}>Delete</Button>}</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={save}>{isEdit ? "Save" : "Add Vendor"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============ PURCHASE ORDERS ============ */

function PurchaseOrdersTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<any>(null);
  const { data: pos = [] } = useQuery({
    queryKey: ["purchase_orders"],
    queryFn: async () => (await supabase.from("purchase_orders").select("*").order("po_date", { ascending: false })).data ?? [],
  });


  const statusColor: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    sent: "bg-secondary text-secondary-foreground",
    received: "bg-[color:oklch(0.92_0.06_155)] text-[color:oklch(0.35_0.14_155)]",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex justify-end">
          <Button size="sm" onClick={() => setOpen(true)}><Plus className="mr-1 h-4 w-4" /> New PO</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pos.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No purchase orders yet.</TableCell></TableRow>}
            {pos.map((p: any) => (
              <TableRow key={p.id} className="cursor-pointer" onClick={() => setViewing(p)}>
                <TableCell className="font-mono">{p.po_number}</TableCell>
                <TableCell>{formatDate(p.po_date)}</TableCell>
                <TableCell>{p.vendor_name_snapshot ?? "—"}</TableCell>
                <TableCell className="text-right tabular-nums font-semibold">{formatINR(p.grand_total)}</TableCell>
                <TableCell><Badge variant="outline" className={`text-[10px] uppercase ${statusColor[p.status] ?? ""}`}>{p.status}</Badge></TableCell>
                <TableCell>{p.expected_date ? formatDate(p.expected_date) : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <NewPODialog open={open} onClose={() => setOpen(false)} onSaved={() => qc.invalidateQueries({ queryKey: ["purchase_orders"] })} />
        <ViewPODialog po={viewing} onClose={() => setViewing(null)} onSent={() => qc.invalidateQueries({ queryKey: ["purchase_orders"] })} />
      </CardContent>
    </Card>
  );
}

type POLine = { product_id: string | null; product_name: string; description: string; hsn: string; qty: number; rate: number; tax_pct: number };

const emptyLine = (): POLine => ({ product_id: null, product_name: "", description: "", hsn: "", qty: 1, rate: 0, tax_pct: 18 });

function NewPODialog({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const qc = useQueryClient();
  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors-select"],
    queryFn: async () => (await supabase.from("vendors").select("*").order("vendor_name")).data ?? [],
  });
  const { data: products = [] } = useQuery({
    queryKey: ["products-po-select"],
    queryFn: async () => (await supabase.from("products").select("*").order("product_name")).data ?? [],
  });
  const productOptions: TypeaheadOption[] = products.map((p: any) => ({
    id: p.id,
    label: p.product_name ?? "",
    sublabel: p.hsn_code ?? undefined,
  }));



  const [poNumber, setPoNumber] = useState("");
  const [poDate, setPoDate] = useState(new Date().toISOString().slice(0, 10));
  const [expected, setExpected] = useState("");
  const [vendorId, setVendorId] = useState<string>("");
  const [vendor, setVendor] = useState<any>({});
  const setV = (k: string, v: any) => setVendor((f: any) => ({ ...f, [k]: v }));
  const [isIgst, setIsIgst] = useState(false);
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<POLine[]>([emptyLine()]);
  const [saving, setSaving] = useState(false);
  const emailPo = useServerFn(sendPoEmail);

  const isNewVendor = !vendorId && !!(vendor.vendor_name ?? "").trim();

  const pickVendor = (id: string) => {
    const v = vendors.find((x: any) => x.id === id);
    if (!v) return;
    setVendorId(v.id);
    setVendor({ ...v });
  };

  const addLine = () => setLines((l) => [...l, emptyLine()]);
  const rmLine = (i: number) => setLines((l) => l.filter((_, idx) => idx !== i));
  const setLine = (i: number, k: keyof POLine, v: any) => setLines((l) => l.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

  const netValue = lines.reduce((a, l) => a + Number(l.qty) * Number(l.rate), 0);
  const totalTax = lines.reduce((a, l) => a + Number(l.qty) * Number(l.rate) * Number(l.tax_pct) / 100, 0);
  const sgst = isIgst ? 0 : totalTax / 2;
  const cgst = isIgst ? 0 : totalTax / 2;
  const igst = isIgst ? totalTax : 0;
  const rawTotal = netValue + totalTax;
  const rounded = Math.round(rawTotal);
  const roundOff = rounded - rawTotal;

  const save = async (send = false) => {
    if (saving) return;
    if (!poNumber.trim()) return toast.error("PO number required");
    const name = (vendor.vendor_name ?? "").trim();
    if (!name) return toast.error("Vendor name is required");
    if (lines.some((l) => !l.description)) return toast.error("Every line needs a description");
    setSaving(true);

    try {
      let vId = vendorId;
      if (!vId) {
        const existing = vendors.find((v: any) => (v.vendor_name ?? "").toLowerCase() === name.toLowerCase());
        if (existing) {
          vId = existing.id;
        } else {
          const { data: newVendor, error: vErr } = await supabase.from("vendors").insert({
            vendor_name: name,
            company_name: vendor.company_name || null,
            contact_person: vendor.contact_person || null,
            mobile: vendor.mobile || null,
            email: vendor.email || null,
            gst_number: vendor.gst_number || null,
            pan_number: vendor.pan_number || null,
            address: vendor.address || null,
            state: vendor.state || null,
            state_code: vendor.state_code || null,
            payment_terms: vendor.payment_terms || null,
          }).select("id").single();
          if (vErr || !newVendor) { toast.error(vErr?.message ?? "Could not create vendor"); return; }
          vId = newVendor.id;
          qc.invalidateQueries({ queryKey: ["vendors"] });
          qc.invalidateQueries({ queryKey: ["vendors-select"] });
          toast.success(`Vendor "${name}" added`);
        }
      }

      const { data: po, error } = await supabase.from("purchase_orders").insert({
        po_number: poNumber.trim(), po_date: poDate,
        expected_date: expected || null,
        vendor_id: vId,
        vendor_name_snapshot: name,
        vendor_gst_snapshot: vendor.gst_number || null,
        vendor_address_snapshot: vendor.address || null,
        is_igst: isIgst,
        net_value: netValue, sub_total: netValue,
        sgst_amount: sgst, cgst_amount: cgst, igst_amount: igst,
        round_off: roundOff, grand_total: rounded,
        notes: notes || null, status: send ? "sent" : "draft",
      }).select("*").single();
      if (error || !po) {
        toast.error(error?.message?.includes("duplicate key") ? `PO number "${poNumber}" already exists` : (error?.message ?? "Could not create purchase order"));
        return;
      }
      const items = lines.map((l, i) => ({
        purchase_order_id: po.id, sr_no: i + 1,
        description: l.description, hsn_code: l.hsn || null,
        quantity: Number(l.qty) || 0, unit_rate: Number(l.rate) || 0, tax_pct: Number(l.tax_pct) || 0,
        tax_amount: Number(l.qty) * Number(l.rate) * Number(l.tax_pct) / 100,
        total_amount: Number(l.qty) * Number(l.rate) * (1 + Number(l.tax_pct) / 100),
      }));
      const { error: iErr } = await supabase.from("purchase_order_items").insert(items);
      if (iErr) { toast.error(iErr.message); return; }

      if (send) {
        const { data: company } = await supabase.from("company_profile").select("*").limit(1).maybeSingle();
        if (vendor.email) {
          try {
            const res: any = await emailPo({ data: { poId: po.id } });
            if (res?.sent) toast.success(`PO emailed to ${res.email}`);
            else toast.warning(`PO saved, but the email was not sent (${res?.reason ?? "unknown"})`);
          } catch (e: any) {
            toast.error(`PO saved, but the email could not be sent: ${e?.message ?? "unknown error"}`);
          }
        } else {
          toast.warning("PO saved and marked sent, but this vendor has no email on file");
        }
      } else {
        toast.success("Purchase order saved as draft");
      }

      setPoNumber(""); setNotes(""); setVendorId(""); setVendor({});
      setLines([emptyLine()]);
      onSaved(); onClose();
    } catch (e: any) {
      console.error("PO save failed", e);
      toast.error(e?.message ?? "Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Purchase Order</DialogTitle></DialogHeader>
        <div className="grid grid-cols-4 gap-3">
          <div><Label>PO Number *</Label><Input value={poNumber} onChange={(e) => setPoNumber(e.target.value)} placeholder="PO-2026-001" /></div>
          <div><Label>PO Date</Label><Input type="date" value={poDate} onChange={(e) => setPoDate(e.target.value)} /></div>
          <div><Label>Expected</Label><Input type="date" value={expected} onChange={(e) => setExpected(e.target.value)} /></div>
          <div>
            <Label>Tax Type</Label>
            <Select value={isIgst ? "igst" : "sgst"} onValueChange={(v) => setIsIgst(v === "igst")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sgst">SGST + CGST (intra-state)</SelectItem>
                <SelectItem value="igst">IGST (inter-state)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label>Vendor Name *</Label>
            <TypeaheadInput
              value={vendor.vendor_name ?? ""}
              onChange={(v: string) => { setVendorId(""); setV("vendor_name", v); }}
              onSelect={(o: TypeaheadOption) => pickVendor(o.id)}
              options={vendors.map((v: any) => ({ id: v.id, label: v.vendor_name, sublabel: v.company_name ?? v.gst_number ?? undefined }))}
              placeholder="Type to search or add new vendor"
            />
            {isNewVendor && <p className="mt-1 text-xs text-muted-foreground">New vendor — will be saved for reuse.</p>}
          </div>
          <div className="col-span-2"><Label>Company Name</Label><Input value={vendor.company_name ?? ""} onChange={(e) => setV("company_name", e.target.value)} /></div>
          <div><Label>Contact Person</Label><Input value={vendor.contact_person ?? ""} onChange={(e) => setV("contact_person", e.target.value)} /></div>
          <div><Label>Mobile</Label><Input value={vendor.mobile ?? ""} onChange={(e) => setV("mobile", e.target.value)} /></div>
          <div><Label>Email</Label><Input value={vendor.email ?? ""} onChange={(e) => setV("email", e.target.value)} /></div>
          <div><Label>GSTIN</Label><Input value={vendor.gst_number ?? ""} onChange={(e) => setV("gst_number", e.target.value)} /></div>
          <div><Label>PAN</Label><Input value={vendor.pan_number ?? ""} onChange={(e) => setV("pan_number", e.target.value)} /></div>
          <div><Label>State</Label><Input value={vendor.state ?? ""} onChange={(e) => setV("state", e.target.value)} /></div>
          <div><Label>State Code</Label><Input value={vendor.state_code ?? ""} onChange={(e) => setV("state_code", e.target.value)} /></div>
          <div><Label>Payment Terms</Label><Input value={vendor.payment_terms ?? ""} onChange={(e) => setV("payment_terms", e.target.value)} /></div>
          <div className="col-span-4"><Label>Address</Label><Textarea rows={2} value={vendor.address ?? ""} onChange={(e) => setV("address", e.target.value)} /></div>
        </div>


        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <Label>Line Items</Label>
            <Button type="button" size="sm" variant="outline" onClick={addLine}><Plus className="mr-1 h-3 w-3" /> Add Line</Button>
          </div>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase">
                <tr>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 w-20">HSN</th>
                  <th className="p-2 w-20">Qty</th>
                  <th className="p-2 w-24">Rate</th>
                  <th className="p-2 w-20">GST%</th>
                  <th className="p-2 w-24 text-right">Total</th>
                  <th className="p-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-1"><Input value={l.description} onChange={(e) => setLine(i, "description", e.target.value)} /></td>
                    <td className="p-1"><Input value={l.hsn} onChange={(e) => setLine(i, "hsn", e.target.value)} /></td>
                    <td className="p-1"><Input type="number" value={l.qty} onChange={(e) => setLine(i, "qty", Number(e.target.value))} /></td>
                    <td className="p-1"><Input type="number" step="0.01" value={l.rate} onChange={(e) => setLine(i, "rate", Number(e.target.value))} /></td>
                    <td className="p-1"><Input type="number" value={l.tax_pct} onChange={(e) => setLine(i, "tax_pct", Number(e.target.value))} /></td>
                    <td className="p-1 text-right tabular-nums">{formatINR(l.qty * l.rate * (1 + l.tax_pct / 100), { withSymbol: false })}</td>
                    <td className="p-1"><Button size="icon" variant="ghost" onClick={() => rmLine(i)} disabled={lines.length === 1}><Trash2 className="h-3.5 w-3.5" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div><Label>Notes</Label><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <div className="space-y-1 text-sm">
            <Row k="Net Value" v={formatINR(netValue)} />
            {isIgst ? <Row k="IGST" v={formatINR(igst)} /> : <><Row k="SGST" v={formatINR(sgst)} /><Row k="CGST" v={formatINR(cgst)} /></>}
            <Row k="Round Off" v={formatINR(roundOff)} />
            <Row k="Grand Total" v={formatINR(rounded)} strong />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="outline" onClick={() => save(false)} disabled={saving}>{saving ? "Saving…" : "Save as Draft"}</Button>
          <Button onClick={() => save(true)} disabled={saving}>
            <Mail className="mr-1 h-4 w-4" /> {saving ? "Saving…" : "Save & Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "border-t pt-1 font-bold text-base" : "text-muted-foreground"}`}>
      <span>{k}</span><span className="tabular-nums text-foreground">{v}</span>
    </div>
  );
}
function ViewPODialog({ po, onClose, onSent }: { po: any; onClose: () => void; onSent?: () => void }) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["purchase_order_items", po?.id],
    enabled: !!po?.id,
    queryFn: async () =>
      (await supabase.from("purchase_order_items").select("*").eq("purchase_order_id", po.id).order("sr_no")).data ?? [],
  });
  const { data: company } = useQuery({
    queryKey: ["company_profile"],
    queryFn: async () => (await supabase.from("company_profile").select("*").limit(1).maybeSingle()).data,
  });
  const { data: vendor } = useQuery({
    queryKey: ["vendor", po?.vendor_id],
    enabled: !!po?.vendor_id,
    queryFn: async () => (await supabase.from("vendors").select("*").eq("id", po.vendor_id).maybeSingle()).data,
  });

  const download = () => {
    if (!printPOHtml(buildPOHtml(po, items, company, vendor))) {
      toast.error("Allow pop-ups to download the purchase order");
    }
  };

  const emailPo = useServerFn(sendPoEmail);
  const [sending, setSending] = useState(false);

  const sendToVendor = async () => {
    const email = vendor?.email;
    if (!email) return toast.error("This vendor has no email address on file");
    setSending(true);
    try {
      const res: any = await emailPo({ data: { poId: po.id } });
      if (res?.sent) {
        toast.success(`Purchase order emailed to ${res.email}`);
        onSent?.();
      } else {
        toast.warning(`Could not send the purchase order (${res?.reason ?? "unknown"})`);
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Could not send the purchase order");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={!!po} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Purchase Order {po?.po_number}</DialogTitle>
        </DialogHeader>
        {po && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-2 sm:grid-cols-2">
              <Row k="Vendor" v={po.vendor_name_snapshot ?? "—"} />
              <Row k="GST" v={po.vendor_gst_snapshot ?? "—"} />
              <Row k="PO Date" v={formatDate(po.po_date)} />
              <Row k="Expected" v={po.expected_date ? formatDate(po.expected_date) : "—"} />
              <Row k="Status" v={String(po.status)} />
              <Row k="Tax type" v={po.is_igst ? "IGST" : "CGST + SGST"} />
            </div>
            {po.vendor_address_snapshot && (
              <p className="text-xs text-muted-foreground">{po.vendor_address_snapshot}</p>
            )}
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>HSN</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Tax %</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && <TableRow><TableCell colSpan={7} className="py-6 text-center text-muted-foreground">Loading…</TableCell></TableRow>}
                  {!isLoading && items.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="py-6 text-center text-muted-foreground">No line items.</TableCell></TableRow>
                  )}
                  {items.map((it: any) => (
                    <TableRow key={it.id}>
                      <TableCell>{it.sr_no}</TableCell>
                      <TableCell>{it.description}</TableCell>
                      <TableCell className="text-xs">{it.hsn_code ?? "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">{Number(it.quantity)} {it.uom ?? ""}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatINR(it.unit_rate)}</TableCell>
                      <TableCell className="text-right tabular-nums">{Number(it.tax_pct)}%</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{formatINR(it.total_amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="ml-auto w-full max-w-xs space-y-1">
              <Row k="Net value" v={formatINR(po.net_value)} />
              {Number(po.discount_amount) > 0 && <Row k="Discount" v={formatINR(po.discount_amount)} />}
              {Number(po.freight) > 0 && <Row k="Freight" v={formatINR(po.freight)} />}
              {Number(po.packing_charges) > 0 && <Row k="Packing" v={formatINR(po.packing_charges)} />}
              <Row k="Sub total" v={formatINR(po.sub_total)} />
              {po.is_igst ? (
                <Row k="IGST" v={formatINR(po.igst_amount)} />
              ) : (
                <>
                  <Row k="CGST" v={formatINR(po.cgst_amount)} />
                  <Row k="SGST" v={formatINR(po.sgst_amount)} />
                </>
              )}
              <Row k="Grand total" v={formatINR(po.grand_total)} strong />
            </div>
            {po.notes && <p className="text-xs text-muted-foreground">Notes: {po.notes}</p>}
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="outline" onClick={download}><Download className="mr-1 h-4 w-4" /> Download PDF</Button>
          <Button onClick={sendToVendor} disabled={!vendor?.email || sending} title={vendor?.email ? `Send to ${vendor.email}` : "No vendor email on file"}>
            <Mail className="mr-1 h-4 w-4" /> {sending ? "Sending…" : "Send to Vendor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

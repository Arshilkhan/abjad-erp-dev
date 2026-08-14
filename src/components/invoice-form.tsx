import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { formatINR, amountInWords } from "@/lib/format";
import { logInvoiceEvent } from "@/lib/invoice-history";
import { TypeaheadInput } from "@/components/typeahead-input";
import { useInvoiceConfig } from "@/lib/invoice-config";

interface LineItem {
  sr_no: number;
  product_id: string | null;
  hsn_code: string;
  description: string;
  quantity: number;
  uom: string;
  unit_rate: number;
  discount_pct: number;
  tax_pct: number;
}

function emptyItem(sr: number): LineItem {
  return { sr_no: sr, product_id: null, hsn_code: "", description: "", quantity: 1, uom: "NOS", unit_rate: 0, discount_pct: 0, tax_pct: 18 };
}

function computeItem(it: LineItem) {
  const gross = it.quantity * it.unit_rate;
  const discount_amount = (gross * it.discount_pct) / 100;
  const net = gross - discount_amount;
  const tax_amount = (net * it.tax_pct) / 100;
  const total_amount = net + tax_amount;
  return { discount_amount, tax_amount, total_amount, net };
}

export function InvoiceForm({ editId, importMode }: { editId?: string; importMode?: boolean }) {
  const nav = useNavigate();
  const { user } = useAuth();
  const isEdit = !!editId;

  const [items, setItems] = useState<LineItem[]>([emptyItem(1)]);
  const [customerId, setCustomerId] = useState<string>("");
  const [customerText, setCustomerText] = useState<string>("");
  const [productTexts, setProductTexts] = useState<string[]>([""]);
  const [invoiceType, setInvoiceType] = useState<string>("tax_invoice");
  const [poNumber, setPoNumber] = useState("");
  const [poDate, setPoDate] = useState("");
  const [challanNumber, setChallanNumber] = useState("");
  const [challanDate, setChallanDate] = useState("");
  const [workOrder, setWorkOrder] = useState("");
  const [freight, setFreight] = useState(0);
  const [packing, setPacking] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [transportCharges, setTransportCharges] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [discountExtra, setDiscountExtra] = useState(0);
  const [deliveryMode, setDeliveryMode] = useState("By Road");
  const [paymentTerms, setPaymentTerms] = useState("30 Days");
  const [contactPerson, setContactPerson] = useState("");
  const [contactMobile, setContactMobile] = useState("");
  const [notes, setNotes] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [hydrated, setHydrated] = useState(false);

  const { data: customers = [] } = useQuery({
    queryKey: ["customers-list"],
    queryFn: async () => (await supabase.from("customers").select("id, customer_name, company_name, gst_number, billing_address, state, state_code")).data ?? [],
  });
  const { data: products = [] } = useQuery({
    queryKey: ["products-list"],
    queryFn: async () => (await supabase.from("products").select("id, product_name, product_code, hsn_code, unit, gst_percentage, selling_price")).data ?? [],
  });
  const { data: settings } = useQuery({
    queryKey: ["invoice-settings"],
    queryFn: async () => (await supabase.from("invoice_settings").select("*").limit(1).maybeSingle()).data,
  });
  const { cfg } = useInvoiceConfig();
  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: async () => (await supabase.from("company_profile").select("state_code").limit(1).maybeSingle()).data,
  });

  // Load existing invoice for edit
  const { data: existing } = useQuery({
    queryKey: ["invoice-edit", editId],
    enabled: isEdit,
    queryFn: async () => {
      const [inv, its] = await Promise.all([
        supabase.from("invoices").select("*").eq("id", editId!).single(),
        supabase.from("invoice_items").select("*").eq("invoice_id", editId!).order("sr_no"),
      ]);
      if (inv.error) throw inv.error;
      return { invoice: inv.data, items: its.data ?? [] };
    },
  });

  useEffect(() => {
    if (!existing || hydrated) return;
    const inv = existing.invoice;
    setCustomerId(inv.customer_id ?? "");
    setCustomerText(inv.customer_name_snapshot ?? "");
    setInvoiceType(inv.invoice_type);
    setInvoiceDate(inv.invoice_date);
    setPoNumber(inv.po_number ?? "");
    setPoDate(inv.po_date ?? "");
    setChallanNumber(inv.challan_number ?? "");
    setChallanDate(inv.challan_date ?? "");
    setWorkOrder(inv.work_order_number ?? "");
    setFreight(Number(inv.freight ?? 0));
    setPacking(Number(inv.packing_charges ?? 0));
    setOtherCharges(Number(inv.other_charges ?? 0));
    setTransportCharges(Number((inv as any).transportation_charges ?? 0));
    setDeliveryCharges(Number((inv as any).delivery_charges ?? 0));
    setDeliveryMode(inv.delivery_mode ?? "");
    setPaymentTerms(inv.payment_terms ?? "");
    setContactPerson(inv.contact_person ?? "");
    setContactMobile(inv.contact_mobile ?? "");
    setNotes(inv.notes ?? "");
    setItems(
      existing.items.length
        ? existing.items.map((it: any, i: number) => ({
            sr_no: it.sr_no ?? i + 1,
            product_id: it.product_id,
            hsn_code: it.hsn_code ?? "",
            description: it.description ?? "",
            quantity: Number(it.quantity ?? 1),
            uom: it.uom ?? "NOS",
            unit_rate: Number(it.unit_rate ?? 0),
            discount_pct: Number(it.discount_pct ?? 0),
            tax_pct: Number(it.tax_pct ?? 18),
          }))
        : [emptyItem(1)]
    );
    setProductTexts(
      existing.items.length
        ? existing.items.map((it: any) => it.description ?? "")
        : [""],
    );
    setHydrated(true);
  }, [existing, hydrated]);

  const customer = customers.find((c: any) => c.id === customerId);
  const isIGST = !!(customer?.state_code && company?.state_code && customer.state_code !== company.state_code);

  const totals = useMemo(() => {
    let net = 0, tax = 0, disc = 0;
    for (const it of items) {
      const c = computeItem(it);
      net += c.net; tax += c.tax_amount; disc += c.discount_amount;
    }
    const subtotal =
      net +
      Number(freight || 0) +
      Number(packing || 0) +
      Number(otherCharges || 0) +
      Number(transportCharges || 0) +
      Number(deliveryCharges || 0) -
      Number(discountExtra || 0);
    const preRound = subtotal + tax;
    const grand = Math.round(preRound);
    const round_off = grand - preRound;
    return { net, tax, disc, subtotal, grand, round_off };
  }, [items, freight, packing, otherCharges, transportCharges, deliveryCharges, discountExtra]);

  const setItem = (idx: number, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };
  const addItem = () => {
    setItems((p) => [...p, emptyItem(p.length + 1)]);
    setProductTexts((p) => [...p, ""]);
  };
  const removeItem = (idx: number) => {
    setItems((p) => p.filter((_, i) => i !== idx).map((it, i) => ({ ...it, sr_no: i + 1 })));
    setProductTexts((p) => p.filter((_, i) => i !== idx));
  };

  const applyProduct = (idx: number, pid: string) => {
    const p = products.find((x: any) => x.id === pid);
    if (!p) return;
    setItem(idx, {
      product_id: p.id, hsn_code: p.hsn_code ?? "", description: p.product_name,
      unit_rate: Number(p.selling_price ?? 0), uom: p.unit ?? "NOS", tax_pct: Number(p.gst_percentage ?? 18),
    });
    setProductTexts((prev) => prev.map((t, i) => (i === idx ? p.product_name : t)));
  };

  const save = useMutation({
    mutationFn: async (status: "draft" | "sent") => {
      if (!customer) throw new Error("Please select a customer");
      if (settings?.mandatory_gst_number && !customer.gst_number) throw new Error("Customer GST Number is mandatory");
      if (settings?.mandatory_po_number && !poNumber) throw new Error("PO Number is mandatory");
      if (settings?.mandatory_challan_number && !challanNumber) throw new Error("Challan Number is mandatory");
      const requireCharge = (key: string, val: number) => {
        const c = cfg(key);
        if (c.visible && c.mandatory && !Number(val)) throw new Error(`${c.label || key} is mandatory`);
      };
      requireCharge("freight_charges", freight);
      requireCharge("packing_charges", packing);
      requireCharge("other_charges", otherCharges);
      requireCharge("transportation_charges", transportCharges);
      requireCharge("delivery_charges", deliveryCharges);
      if (items.length === 0) throw new Error("Add at least one item");

      const sgst_amount = isIGST ? 0 : totals.tax / 2;
      const cgst_amount = isIGST ? 0 : totals.tax / 2;
      const igst_amount = isIGST ? totals.tax : 0;

      const payload: any = {
        invoice_type: invoiceType as any, invoice_date: invoiceDate,
        customer_id: customer.id,
        customer_name_snapshot: customer.company_name || customer.customer_name,
        customer_gst_snapshot: customer.gst_number,
        customer_address_snapshot: customer.billing_address,
        po_number: poNumber || null, po_date: poDate || null,
        challan_number: challanNumber || null, challan_date: challanDate || null,
        work_order_number: workOrder || null,
        place_of_supply: customer.state ?? null,
        is_igst: isIGST,
        net_value: totals.net,
        discount_amount: totals.disc + Number(discountExtra || 0),
        freight: Number(freight || 0),
        packing_charges: Number(packing || 0),
        other_charges: Number(otherCharges || 0),
        transportation_charges: Number(transportCharges || 0),
        delivery_charges: Number(deliveryCharges || 0),
        subtotal: totals.subtotal,
        sgst_amount, cgst_amount, igst_amount,
        round_off: totals.round_off,
        grand_total: totals.grand,
        amount_in_words: amountInWords(totals.grand),
        delivery_mode: deliveryMode || null,
        payment_terms: paymentTerms || null,
        contact_person: contactPerson || null,
        contact_mobile: contactMobile || null,
        notes: notes || null,
        status,
      };

      let invId: string;
      let invNumber: string;
      if (isEdit) {
        const { data: inv, error } = await supabase.from("invoices").update(payload).eq("id", editId!).select().single();
        if (error) throw error;
        invId = inv.id; invNumber = inv.invoice_number;
        const { error: dErr } = await supabase.from("invoice_items").delete().eq("invoice_id", invId);
        if (dErr) throw dErr;
      } else {
        const prefix = invoiceType === "quotation" ? "QTN" : invoiceType === "purchase_order" ? "PO" : "INV";
        const year = new Date().getFullYear().toString().slice(-2);
        const { count } = await supabase.from("invoices").select("id", { count: "exact", head: true }).eq("invoice_type", invoiceType as any);
        const invoice_number = importMode
          ? `${prefix}-IMP-${year}-${String((count ?? 0) + 1).padStart(4, "0")}`
          : `${prefix}-${year}-${String((count ?? 0) + 1).padStart(4, "0")}`;
        const insertPayload: any = { ...payload, invoice_number, created_by: user?.id };
        if (importMode) { insertPayload.is_imported = true; insertPayload.import_source = "manual"; }
        const { data: inv, error } = await supabase.from("invoices").insert(insertPayload).select().single();
        if (error) throw error;
        invId = inv.id; invNumber = inv.invoice_number;
      }

      const rows = items.map((it) => {
        const c = computeItem(it);
        return {
          invoice_id: invId, sr_no: it.sr_no, product_id: it.product_id,
          hsn_code: it.hsn_code || null, description: it.description,
          quantity: it.quantity, uom: it.uom, unit_rate: it.unit_rate,
          discount_pct: it.discount_pct, discount_amount: c.discount_amount,
          tax_pct: it.tax_pct, tax_amount: c.tax_amount, total_amount: c.total_amount,
        };
      });
      const { error: iErr } = await supabase.from("invoice_items").insert(rows);
      if (iErr) throw iErr;

      return { id: invId, invoice_number: invNumber };
    },
    onSuccess: async (inv) => {
      if (isEdit) {
        await logInvoiceEvent(inv.id, "edited", "Invoice edited");
      } else if (importMode) {
        await logInvoiceEvent(inv.id, "imported", `Imported invoice ${inv.invoice_number}`);
      } else {
        await logInvoiceEvent(inv.id, "created", `Created invoice ${inv.invoice_number}`);
      }
      toast.success(`Invoice ${inv.invoice_number} ${isEdit ? "updated" : importMode ? "imported" : "created"}`);
      nav({ to: "/invoices/$id", params: { id: inv.id } });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        title={isEdit
          ? `Edit Invoice${existing?.invoice?.invoice_number ? ` — ${existing.invoice.invoice_number}` : ""}`
          : importMode ? "Import Invoice" : "New Invoice"}
        description={importMode
          ? "Record an invoice that was created outside the software. It'll be tagged 'Imported' and behaves like a normal invoice."
          : isEdit
            ? "Update customer, line items, taxes, charges, delivery and payment details."
            : "Create a GST tax invoice. Field visibility and mandatory rules follow your Settings."}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/invoices"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>
            <Button variant="outline" onClick={() => save.mutate("draft")} disabled={save.isPending}>Save Draft</Button>
            <Button onClick={() => save.mutate("sent")} disabled={save.isPending}>{save.isPending ? "Saving…" : isEdit ? "Save Changes" : "Save & Send"}</Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Invoice Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Customer *</Label>
              <TypeaheadInput
                value={customerText}
                onChange={(v) => { setCustomerText(v); if (customerId) setCustomerId(""); }}
                options={customers.map((c: any) => ({
                  id: c.id,
                  label: c.company_name || c.customer_name,
                  sublabel: c.gst_number ?? c.customer_name ?? "",
                }))}
                onSelect={(opt) => { setCustomerId(opt.id); setCustomerText(opt.label); }}
                onMissing={(text) => {
                  if (window.confirm(`Customer "${text}" not found. Add a new customer now?`)) {
                    nav({ to: "/customers" });
                  }
                }}
                placeholder="Type customer name…"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <Select value={invoiceType} onValueChange={setInvoiceType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax_invoice">Tax Invoice</SelectItem>
                  <SelectItem value="proforma">Proforma</SelectItem>
                  <SelectItem value="quotation">Quotation</SelectItem>
                  <SelectItem value="delivery_challan">Delivery Challan</SelectItem>
                  <SelectItem value="credit_note">Credit Note</SelectItem>
                  <SelectItem value="debit_note">Debit Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date</Label>
              <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
            </div>

            {(settings?.show_po_number || isEdit) && <>
              <div className="space-y-1.5">
                <Label className="text-xs">PO Number{settings?.mandatory_po_number && " *"}</Label>
                <Input value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">PO Date</Label>
                <Input type="date" value={poDate} onChange={(e) => setPoDate(e.target.value)} />
              </div>
            </>}
            {(settings?.show_challan_number || isEdit) && <>
              <div className="space-y-1.5">
                <Label className="text-xs">Challan Number{settings?.mandatory_challan_number && " *"}</Label>
                <Input value={challanNumber} onChange={(e) => setChallanNumber(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Challan Date</Label>
                <Input type="date" value={challanDate} onChange={(e) => setChallanDate(e.target.value)} />
              </div>
            </>}
            {(settings?.show_work_order || isEdit) && (
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs">Work Order Number</Label>
                <Input value={workOrder} onChange={(e) => setWorkOrder(e.target.value)} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Customer Info</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            {customer ? (
              <>
                <div className="font-medium">{customer.company_name || customer.customer_name}</div>
                <div className="text-xs text-muted-foreground whitespace-pre-line">{customer.billing_address}</div>
                <div className="pt-2 text-xs"><span className="text-muted-foreground">GST:</span> <span className="font-mono">{customer.gst_number ?? "—"}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">State:</span> {customer.state} ({customer.state_code})</div>
                <div className="mt-2 rounded bg-secondary px-2 py-1 text-xs font-medium">
                  {isIGST ? "Inter-state → IGST" : "Intra-state → SGST + CGST"}
                </div>
              </>
            ) : <p className="text-muted-foreground text-xs">Select a customer to see details.</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Line Items</CardTitle>
          <Button size="sm" variant="outline" onClick={addItem}><Plus className="mr-1 h-4 w-4" /> Add Row</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-2 text-left w-10">#</th>
                  <th className="p-2 text-left w-48">Product</th>
                  <th className="p-2 text-left w-24">HSN</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-right w-20">Qty</th>
                  <th className="p-2 text-left w-16">UOM</th>
                  <th className="p-2 text-right w-24">Rate</th>
                  <th className="p-2 text-right w-16">Disc%</th>
                  <th className="p-2 text-right w-16">Tax%</th>
                  <th className="p-2 text-right w-28">Total</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const c = computeItem(it);
                  return (
                    <tr key={idx} className="border-t">
                      <td className="p-1 text-center text-muted-foreground">{it.sr_no}</td>
                      <td className="p-1">
                        <TypeaheadInput
                          value={productTexts[idx] ?? ""}
                          onChange={(v) => {
                            setProductTexts((prev) => prev.map((t, i) => (i === idx ? v : t)));
                            if (it.product_id) setItem(idx, { product_id: null });
                          }}
                          options={products.map((p: any) => ({
                            id: p.id,
                            label: p.product_name,
                            sublabel: `${p.product_code ?? ""}${p.hsn_code ? ` • HSN ${p.hsn_code}` : ""}`,
                          }))}
                          onSelect={(opt) => applyProduct(idx, opt.id)}
                          onMissing={(text) => {
                            if (window.confirm(`Product "${text}" not found. Add a new product now?`)) {
                              nav({ to: "/products" });
                            }
                          }}
                          placeholder="Type product…"
                          inputClassName="h-8"
                        />
                      </td>
                      <td className="p-1"><Input className="h-8 font-mono text-xs" value={it.hsn_code} onChange={(e) => setItem(idx, { hsn_code: e.target.value })} /></td>
                      <td className="p-1"><Input className="h-8" value={it.description} onChange={(e) => setItem(idx, { description: e.target.value })} /></td>
                      <td className="p-1"><Input className="h-8 text-right tabular-nums" type="number" value={it.quantity} onChange={(e) => setItem(idx, { quantity: Number(e.target.value) })} /></td>
                      <td className="p-1"><Input className="h-8" value={it.uom} onChange={(e) => setItem(idx, { uom: e.target.value })} /></td>
                      <td className="p-1"><Input className="h-8 text-right tabular-nums" type="number" value={it.unit_rate} onChange={(e) => setItem(idx, { unit_rate: Number(e.target.value) })} /></td>
                      <td className="p-1"><Input className="h-8 text-right tabular-nums" type="number" value={it.discount_pct} onChange={(e) => setItem(idx, { discount_pct: Number(e.target.value) })} /></td>
                      <td className="p-1"><Input className="h-8 text-right tabular-nums" type="number" value={it.tax_pct} onChange={(e) => setItem(idx, { tax_pct: Number(e.target.value) })} /></td>
                      <td className="p-2 text-right tabular-nums font-medium">{formatINR(c.total_amount)}</td>
                      <td className="p-1"><Button size="icon" variant="ghost" onClick={() => removeItem(idx)} disabled={items.length === 1}><Trash2 className="h-3.5 w-3.5" /></Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Additional Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {(settings?.show_delivery || isEdit) && (
              <div className="space-y-1.5">
                <Label className="text-xs">Delivery Mode</Label>
                <Input value={deliveryMode} onChange={(e) => setDeliveryMode(e.target.value)} />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs">Payment Terms</Label>
              <Input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
            </div>
            {(settings?.show_contact_person || isEdit) && <>
              <div className="space-y-1.5">
                <Label className="text-xs">Contact Person</Label>
                <Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Contact Mobile</Label>
                <Input value={contactMobile} onChange={(e) => setContactMobile(e.target.value)} />
              </div>
            </>}
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Notes</Label>
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Totals</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Net Value" value={formatINR(totals.net)} />
            {(settings?.show_discount || isEdit) && (
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Extra Discount</Label>
                <Input className="h-8 w-32 text-right" type="number" value={discountExtra} onChange={(e) => setDiscountExtra(Number(e.target.value))} />
              </div>
            )}
            {(settings?.show_freight || isEdit) && (
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Freight{settings?.mandatory_freight && " *"}</Label>
                <Input className="h-8 w-32 text-right" type="number" value={freight} onChange={(e) => setFreight(Number(e.target.value))} />
              </div>
            )}
            {(settings?.show_packing_charges || isEdit) && (
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Packing & Forwarding</Label>
                <Input className="h-8 w-32 text-right" type="number" value={packing} onChange={(e) => setPacking(Number(e.target.value))} />
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Other Charges</Label>
              <Input className="h-8 w-32 text-right" type="number" value={otherCharges} onChange={(e) => setOtherCharges(Number(e.target.value))} />
            </div>
            <div className="border-t pt-2">
              <Row label="Subtotal" value={formatINR(totals.subtotal)} />
              {isIGST ? (
                <Row label="IGST" value={formatINR(totals.tax)} />
              ) : (
                <>
                  <Row label="CGST" value={formatINR(totals.tax / 2)} />
                  <Row label="SGST" value={formatINR(totals.tax / 2)} />
                </>
              )}
              <Row label="Round Off" value={formatINR(totals.round_off)} />
            </div>
            <div className="flex items-center justify-between border-t pt-2 text-base font-bold">
              <span>Grand Total</span>
              <span className="tabular-nums">{formatINR(totals.grand)}</span>
            </div>
            <p className="pt-1 text-xs italic text-muted-foreground">{amountInWords(totals.grand)}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}
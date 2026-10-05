import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR, formatDate, billNo } from "@/lib/format";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports — ABJAD ERP" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Sales, GST, customer ledger, stock, cancellations, rejections, credits, charges — export to CSV." />
      <Tabs defaultValue="sales">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="gst">GST (GSTR-1)</TabsTrigger>
          <TabsTrigger value="ledger">Customer Ledger</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Items</TabsTrigger>
          <TabsTrigger value="credits">Customer Credits</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="imports">Imported</TabsTrigger>
        </TabsList>
        <TabsContent value="sales"><SalesReport /></TabsContent>
        <TabsContent value="gst"><GstReport /></TabsContent>
        <TabsContent value="ledger"><CustomerLedger /></TabsContent>
        <TabsContent value="stock"><StockReport /></TabsContent>
        <TabsContent value="outstanding"><OutstandingReport /></TabsContent>
        <TabsContent value="cancelled"><CancelledReport /></TabsContent>
        <TabsContent value="rejected"><RejectedReport /></TabsContent>
        <TabsContent value="credits"><CreditsReport /></TabsContent>
        <TabsContent value="charges"><ChargesReport /></TabsContent>
        <TabsContent value="imports"><ImportsReport /></TabsContent>
      </Tabs>
    </>
  );
}

function downloadCSV(filename: string, rows: any[]) {
  if (!rows.length) return toast.error("No data to export");
  const headers = Object.keys(rows[0]);
  const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function DateRange({ from, to, onFrom, onTo }: { from: string; to: string; onFrom: (v: string) => void; onTo: (v: string) => void }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div><Label className="text-xs">From</Label><Input type="date" value={from} onChange={(e) => onFrom(e.target.value)} className="w-40" /></div>
      <div><Label className="text-xs">To</Label><Input type="date" value={to} onChange={(e) => onTo(e.target.value)} className="w-40" /></div>
    </div>
  );
}

const startOfYear = () => { const d = new Date(); return `${d.getFullYear()}-04-01`; };
const today = () => new Date().toISOString().slice(0, 10);

/* -------- Sales -------- */
function SalesReport() {
  const [from, setFrom] = useState(startOfYear());
  const [to, setTo] = useState(today());
  const { data: rows = [] } = useQuery({
    queryKey: ["rep-sales", from, to],
    queryFn: async () => (await supabase.from("invoices")
      .select("invoice_number, invoice_date, invoice_type, customer_name_snapshot, subtotal, sgst_amount, cgst_amount, igst_amount, grand_total, status")
      .gte("invoice_date", from).lte("invoice_date", to)
      .in("invoice_type", ["tax_invoice", "proforma"])
      .order("invoice_date")).data ?? [],
  });

  const totals = rows.reduce((a, r: any) => ({
    net: a.net + Number(r.subtotal ?? 0),
    tax: a.tax + Number(r.sgst_amount ?? 0) + Number(r.cgst_amount ?? 0) + Number(r.igst_amount ?? 0),
    grand: a.grand + Number(r.grand_total ?? 0),
  }), { net: 0, tax: 0, grand: 0 });

  return (
    <Card><CardHeader><CardTitle className="flex items-center justify-between">Sales Report
      <div className="flex items-end gap-3">
        <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
        <Button size="sm" variant="outline" onClick={() => downloadCSV(`sales_${from}_${to}.csv`, rows)}><Download className="mr-1 h-4 w-4" /> CSV</Button>
      </div>
    </CardTitle></CardHeader>
    <CardContent className="p-0">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Invoice</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Customer</TableHead>
          <TableHead className="text-right">Taxable</TableHead><TableHead className="text-right">Tax</TableHead><TableHead className="text-right">Total</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {rows.length === 0 && <TableRow><TableCell colSpan={7} className="py-6 text-center text-muted-foreground">No sales in range.</TableCell></TableRow>}
          {rows.map((r: any, i) => (
            <TableRow key={i}>
              <TableCell className="font-mono">{billNo(r.invoice_number)}</TableCell>
              <TableCell>{formatDate(r.invoice_date)}</TableCell>
              <TableCell className="text-xs uppercase">{r.invoice_type}</TableCell>
              <TableCell>{r.customer_name_snapshot}</TableCell>
              <TableCell className="text-right tabular-nums">{formatINR(r.subtotal)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatINR(Number(r.sgst_amount ?? 0) + Number(r.cgst_amount ?? 0) + Number(r.igst_amount ?? 0))}</TableCell>
              <TableCell className="text-right tabular-nums font-semibold">{formatINR(r.grand_total)}</TableCell>
            </TableRow>
          ))}
          {rows.length > 0 && <TableRow className="bg-muted/40 font-semibold">
            <TableCell colSpan={3} className="text-right">Totals</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(totals.net)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(totals.tax)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(totals.grand)}</TableCell>
          </TableRow>}
        </TableBody>
      </Table>
    </CardContent></Card>
  );
}

/* -------- Cancelled Invoices -------- */
function CancelledReport() {
  const [from, setFrom] = useState(startOfYear());
  const [to, setTo] = useState(today());
  const { data: rows = [] } = useQuery({
    queryKey: ["rep-cancelled", from, to],
    queryFn: async () => (await supabase.from("invoices")
      .select("invoice_number, invoice_date, customer_name_snapshot, grand_total, cancelled_at, cancellation_reason")
      .eq("status", "cancelled")
      .gte("invoice_date", from).lte("invoice_date", to)
      .order("cancelled_at", { ascending: false })).data ?? [],
  });
  const total = rows.reduce((s: number, r: any) => s + Number(r.grand_total), 0);
  return (
    <Card><CardHeader><CardTitle className="flex items-center justify-between text-base">
      <span>Cancelled Invoices • Total {formatINR(total)}</span>
      <Button size="sm" variant="outline" onClick={() => downloadCSV(`cancelled-${from}-${to}.csv`, rows as any[])}><Download className="mr-1 h-4 w-4" /> CSV</Button>
    </CardTitle></CardHeader>
    <CardContent>
      <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
      <Table className="mt-3">
        <TableHeader><TableRow>
          <TableHead>Invoice</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead>
          <TableHead className="text-right">Total</TableHead><TableHead>Cancelled</TableHead><TableHead>Reason</TableHead>
        </TableRow></TableHeader>
        <TableBody>{rows.map((r: any, i) => (
          <TableRow key={i}>
            <TableCell className="font-mono text-xs">{billNo(r.invoice_number)}</TableCell>
            <TableCell>{formatDate(r.invoice_date)}</TableCell>
            <TableCell>{r.customer_name_snapshot}</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(r.grand_total)}</TableCell>
            <TableCell>{r.cancelled_at ? formatDate(r.cancelled_at) : "—"}</TableCell>
            <TableCell className="max-w-[240px] truncate text-muted-foreground">{r.cancellation_reason ?? "—"}</TableCell>
          </TableRow>))}</TableBody>
      </Table>
    </CardContent></Card>
  );
}

/* -------- Rejected Items -------- */
function RejectedReport() {
  const [from, setFrom] = useState(startOfYear());
  const [to, setTo] = useState(today());
  const { data: rows = [] } = useQuery({
    queryKey: ["rep-rejected", from, to],
    queryFn: async () => (await (supabase.from("invoice_rejections") as any)
      .select("*, invoices(invoice_number, customer_name_snapshot), invoice_items(description)")
      .gte("created_at", from).lte("created_at", `${to}T23:59:59`)
      .order("created_at", { ascending: false })).data ?? [],
  });
  const flat = (rows as any[]).map((r: any) => ({
    date: formatDate(r.created_at),
    invoice: billNo(r.invoices?.invoice_number),
    customer: r.invoices?.customer_name_snapshot,
    item: r.invoice_items?.description,
    quantity: r.rejected_quantity,
    reason: r.rejection_reason,
    rejected_value: r.rejected_value,
    gst_deduction: r.gst_deduction,
    total_deduction: r.total_deduction,
  }));
  const total = flat.reduce((s: number, r: any) => s + Number(r.total_deduction), 0);
  return (
    <Card><CardHeader><CardTitle className="flex items-center justify-between text-base">
      <span>Rejected Items • Deduction {formatINR(total)}</span>
      <Button size="sm" variant="outline" onClick={() => downloadCSV(`rejected-${from}-${to}.csv`, flat)}><Download className="mr-1 h-4 w-4" /> CSV</Button>
    </CardTitle></CardHeader>
    <CardContent>
      <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
      <Table className="mt-3">
        <TableHeader><TableRow>
          <TableHead>Date</TableHead><TableHead>Invoice</TableHead><TableHead>Customer</TableHead>
          <TableHead>Item</TableHead><TableHead className="text-right">Qty</TableHead><TableHead>Reason</TableHead>
          <TableHead className="text-right">Deduction</TableHead>
        </TableRow></TableHeader>
        <TableBody>{flat.map((r: any, i: number) => (
          <TableRow key={i}>
            <TableCell className="text-xs">{r.date}</TableCell>
            <TableCell className="font-mono text-xs">{r.invoice}</TableCell>
            <TableCell>{r.customer}</TableCell>
            <TableCell className="max-w-[220px] truncate">{r.item}</TableCell>
            <TableCell className="text-right tabular-nums">{r.quantity}</TableCell>
            <TableCell>{r.reason}</TableCell>
            <TableCell className="text-right font-semibold tabular-nums">{formatINR(r.total_deduction)}</TableCell>
          </TableRow>))}</TableBody>
      </Table>
    </CardContent></Card>
  );
}

/* -------- Customer Credits -------- */
function CreditsReport() {
  const { data: rows = [] } = useQuery({
    queryKey: ["rep-credits"],
    queryFn: async () => (await (supabase.from("customer_credits") as any)
      .select("*, customers(name), invoices(invoice_number)")
      .order("created_at", { ascending: false })).data ?? [],
  });
  const flat = (rows as any[]).map((r: any) => ({
    date: formatDate(r.created_at),
    customer: r.customers?.name,
    invoice: billNo(r.invoices?.invoice_number),
    credit_amount: r.credit_amount,
    status: r.status,
    notes: r.notes,
  }));
  const total = flat.reduce((s: number, r: any) => s + Number(r.credit_amount), 0);
  return (
    <Card><CardHeader><CardTitle className="flex items-center justify-between text-base">
      <span>Customer Credits • {formatINR(total)}</span>
      <Button size="sm" variant="outline" onClick={() => downloadCSV(`credits.csv`, flat)}><Download className="mr-1 h-4 w-4" /> CSV</Button>
    </CardTitle></CardHeader>
    <CardContent>
      <Table>
        <TableHeader><TableRow>
          <TableHead>Date</TableHead><TableHead>Customer</TableHead><TableHead>Invoice</TableHead>
          <TableHead className="text-right">Credit</TableHead><TableHead>Status</TableHead><TableHead>Notes</TableHead>
        </TableRow></TableHeader>
        <TableBody>{flat.map((r: any, i: number) => (
          <TableRow key={i}>
            <TableCell className="text-xs">{r.date}</TableCell>
            <TableCell>{r.customer}</TableCell>
            <TableCell className="font-mono text-xs">{r.invoice}</TableCell>
            <TableCell className="text-right font-semibold tabular-nums">{formatINR(r.credit_amount)}</TableCell>
            <TableCell className="uppercase text-xs">{r.status}</TableCell>
            <TableCell className="max-w-[240px] truncate text-muted-foreground">{r.notes}</TableCell>
          </TableRow>))}</TableBody>
      </Table>
    </CardContent></Card>
  );
}

/* -------- Charges Report (Freight / Packing / Transportation) -------- */
function ChargesReport() {
  const [from, setFrom] = useState(startOfYear());
  const [to, setTo] = useState(today());
  const { data: rows = [] } = useQuery({
    queryKey: ["rep-charges", from, to],
    queryFn: async () => (await supabase.from("invoices")
      .select("invoice_number, invoice_date, customer_name_snapshot, freight, packing_charges, transportation_charges, delivery_charges, other_charges")
      .gte("invoice_date", from).lte("invoice_date", to)
      .order("invoice_date")).data ?? [],
  });
  const totals = (rows as any[]).reduce((a: any, r: any) => ({
    freight: a.freight + Number(r.freight ?? 0),
    packing: a.packing + Number(r.packing_charges ?? 0),
    transport: a.transport + Number(r.transportation_charges ?? 0),
    delivery: a.delivery + Number(r.delivery_charges ?? 0),
    other: a.other + Number(r.other_charges ?? 0),
  }), { freight: 0, packing: 0, transport: 0, delivery: 0, other: 0 });
  return (
    <Card><CardHeader><CardTitle className="flex items-center justify-between text-base">
      <span>Charges Breakdown</span>
      <Button size="sm" variant="outline" onClick={() => downloadCSV(`charges-${from}-${to}.csv`, rows as any[])}><Download className="mr-1 h-4 w-4" /> CSV</Button>
    </CardTitle></CardHeader>
    <CardContent>
      <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
      <div className="my-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
        <Metric label="Freight" value={formatINR(totals.freight)} />
        <Metric label="Packing" value={formatINR(totals.packing)} />
        <Metric label="Transportation" value={formatINR(totals.transport)} />
        <Metric label="Delivery" value={formatINR(totals.delivery)} />
        <Metric label="Other" value={formatINR(totals.other)} />
      </div>
      <Table>
        <TableHeader><TableRow>
          <TableHead>Invoice</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead>
          <TableHead className="text-right">Freight</TableHead><TableHead className="text-right">Packing</TableHead>
          <TableHead className="text-right">Transport</TableHead><TableHead className="text-right">Delivery</TableHead>
          <TableHead className="text-right">Other</TableHead>
        </TableRow></TableHeader>
        <TableBody>{(rows as any[]).map((r: any, i: number) => (
          <TableRow key={i}>
            <TableCell className="font-mono text-xs">{billNo(r.invoice_number)}</TableCell>
            <TableCell>{formatDate(r.invoice_date)}</TableCell>
            <TableCell>{r.customer_name_snapshot}</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(r.freight)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(r.packing_charges)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(r.transportation_charges)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(r.delivery_charges)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(r.other_charges)}</TableCell>
          </TableRow>))}</TableBody>
      </Table>
    </CardContent></Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-semibold tabular-nums">{value}</div>
    </div>
  );
}

/* -------- Imported Invoices -------- */
function ImportsReport() {
  const [from, setFrom] = useState(startOfYear());
  const [to, setTo] = useState(today());
  const { data: rows = [] } = useQuery({
    queryKey: ["rep-imports", from, to],
    queryFn: async () => (await supabase.from("invoices")
      .select("invoice_number, invoice_date, customer_name_snapshot, grand_total, status, import_source")
      .eq("is_imported", true)
      .gte("invoice_date", from).lte("invoice_date", to)
      .order("invoice_date", { ascending: false })).data ?? [],
  });
  const total = (rows as any[]).reduce((s: number, r: any) => s + Number(r.grand_total), 0);
  return (
    <Card><CardHeader><CardTitle className="flex items-center justify-between text-base">
      <span>Imported Invoices • {formatINR(total)}</span>
      <Button size="sm" variant="outline" onClick={() => downloadCSV(`imports-${from}-${to}.csv`, rows as any[])}><Download className="mr-1 h-4 w-4" /> CSV</Button>
    </CardTitle></CardHeader>
    <CardContent>
      <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
      <Table className="mt-3">
        <TableHeader><TableRow>
          <TableHead>Invoice</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead>
          <TableHead className="text-right">Total</TableHead><TableHead>Status</TableHead><TableHead>Source</TableHead>
        </TableRow></TableHeader>
        <TableBody>{(rows as any[]).map((r: any, i: number) => (
          <TableRow key={i}>
            <TableCell className="font-mono text-xs">{billNo(r.invoice_number)}</TableCell>
            <TableCell>{formatDate(r.invoice_date)}</TableCell>
            <TableCell>{r.customer_name_snapshot}</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(r.grand_total)}</TableCell>
            <TableCell className="uppercase text-xs">{r.status}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{r.import_source ?? "—"}</TableCell>
          </TableRow>))}</TableBody>
      </Table>
    </CardContent></Card>
  );
}

/* -------- GST -------- */
function GstReport() {
  const [from, setFrom] = useState(startOfYear());
  const [to, setTo] = useState(today());
  const { data: rows = [] } = useQuery({
    queryKey: ["rep-gst", from, to],
    queryFn: async () => (await supabase.from("invoices")
      .select("invoice_number, invoice_date, customer_name_snapshot, customer_gst_snapshot, subtotal, sgst_amount, cgst_amount, igst_amount, grand_total, is_igst")
      .eq("invoice_type", "tax_invoice")
      .gte("invoice_date", from).lte("invoice_date", to)
      .order("invoice_date")).data ?? [],
  });

  const totals = rows.reduce((a, r: any) => ({
    taxable: a.taxable + Number(r.subtotal ?? 0),
    sgst: a.sgst + Number(r.sgst_amount ?? 0),
    cgst: a.cgst + Number(r.cgst_amount ?? 0),
    igst: a.igst + Number(r.igst_amount ?? 0),
  }), { taxable: 0, sgst: 0, cgst: 0, igst: 0 });

  return (
    <Card><CardHeader><CardTitle className="flex items-center justify-between">GSTR-1 Summary
      <div className="flex items-end gap-3">
        <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
        <Button size="sm" variant="outline" onClick={() => downloadCSV(`gstr1_${from}_${to}.csv`, rows)}><Download className="mr-1 h-4 w-4" /> CSV</Button>
      </div>
    </CardTitle></CardHeader>
    <CardContent className="p-0">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Invoice</TableHead><TableHead>Date</TableHead><TableHead>Customer GSTIN</TableHead>
          <TableHead className="text-right">Taxable</TableHead><TableHead className="text-right">SGST</TableHead><TableHead className="text-right">CGST</TableHead><TableHead className="text-right">IGST</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {rows.length === 0 && <TableRow><TableCell colSpan={7} className="py-6 text-center text-muted-foreground">No tax invoices in range.</TableCell></TableRow>}
          {rows.map((r: any, i) => (
            <TableRow key={i}>
              <TableCell className="font-mono">{billNo(r.invoice_number)}</TableCell>
              <TableCell>{formatDate(r.invoice_date)}</TableCell>
              <TableCell className="font-mono text-xs">{r.customer_gst_snapshot ?? "—"}</TableCell>
              <TableCell className="text-right tabular-nums">{formatINR(r.subtotal)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatINR(r.sgst_amount)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatINR(r.cgst_amount)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatINR(r.igst_amount)}</TableCell>
            </TableRow>
          ))}
          {rows.length > 0 && <TableRow className="bg-muted/40 font-semibold">
            <TableCell colSpan={3} className="text-right">Totals</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(totals.taxable)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(totals.sgst)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(totals.cgst)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(totals.igst)}</TableCell>
          </TableRow>}
        </TableBody>
      </Table>
    </CardContent></Card>
  );
}

/* -------- Customer Ledger -------- */
function CustomerLedger() {
  const { data: rows = [] } = useQuery({
    queryKey: ["rep-ledger"],
    queryFn: async () => (await supabase.from("invoices")
      .select("customer_id, customer_name_snapshot, grand_total, amount_paid")
      .eq("invoice_type", "tax_invoice")).data ?? [],
  });

  const summary = useMemo(() => {
    const m = new Map<string, { customer: string; billed: number; paid: number }>();
    for (const r of rows as any[]) {
      const key = r.customer_id ?? r.customer_name_snapshot ?? "unknown";
      const cur = m.get(key) ?? { customer: r.customer_name_snapshot ?? "—", billed: 0, paid: 0 };
      cur.billed += Number(r.grand_total ?? 0);
      cur.paid += Number(r.amount_paid ?? 0);
      m.set(key, cur);
    }
    return Array.from(m.values()).map((v) => ({ ...v, outstanding: v.billed - v.paid })).sort((a, b) => b.outstanding - a.outstanding);
  }, [rows]);

  return (
    <Card><CardHeader><CardTitle className="flex items-center justify-between">Customer Ledger
      <Button size="sm" variant="outline" onClick={() => downloadCSV(`ledger_${today()}.csv`, summary)}><Download className="mr-1 h-4 w-4" /> CSV</Button>
    </CardTitle></CardHeader>
    <CardContent className="p-0">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Customer</TableHead><TableHead className="text-right">Billed</TableHead><TableHead className="text-right">Paid</TableHead><TableHead className="text-right">Outstanding</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {summary.length === 0 && <TableRow><TableCell colSpan={4} className="py-6 text-center text-muted-foreground">No data.</TableCell></TableRow>}
          {summary.map((r, i) => (
            <TableRow key={i}>
              <TableCell>{r.customer}</TableCell>
              <TableCell className="text-right tabular-nums">{formatINR(r.billed)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatINR(r.paid)}</TableCell>
              <TableCell className={`text-right tabular-nums font-semibold ${r.outstanding > 0 ? "text-warning" : ""}`}>{formatINR(r.outstanding)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent></Card>
  );
}

/* -------- Stock -------- */
function StockReport() {
  const { data: rows = [] } = useQuery({
    queryKey: ["rep-stock"],
    queryFn: async () => (await supabase.from("products")
      .select("product_code, name, hsn_code, current_stock, min_stock, unit_price, uom")
      .order("name")).data ?? [],
  });

  const enriched = rows.map((r: any) => ({
    ...r,
    value: Number(r.current_stock ?? 0) * Number(r.unit_price ?? 0),
    low: Number(r.current_stock ?? 0) <= Number(r.min_stock ?? 0),
  }));
  const totalValue = enriched.reduce((a: number, r: any) => a + r.value, 0);

  return (
    <Card><CardHeader><CardTitle className="flex items-center justify-between">Stock Valuation
      <Button size="sm" variant="outline" onClick={() => downloadCSV(`stock_${today()}.csv`, enriched)}><Download className="mr-1 h-4 w-4" /> CSV</Button>
    </CardTitle></CardHeader>
    <CardContent className="p-0">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Code</TableHead><TableHead>Product</TableHead><TableHead>HSN</TableHead>
          <TableHead className="text-right">Stock</TableHead><TableHead className="text-right">Rate</TableHead><TableHead className="text-right">Value</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {enriched.length === 0 && <TableRow><TableCell colSpan={6} className="py-6 text-center text-muted-foreground">No products.</TableCell></TableRow>}
          {enriched.map((r: any, i: number) => (
            <TableRow key={i} className={r.low ? "bg-warning/5" : ""}>
              <TableCell className="font-mono text-xs">{r.product_code}</TableCell>
              <TableCell>{r.name}{r.low && <span className="ml-2 text-xs text-warning">● low</span>}</TableCell>
              <TableCell className="font-mono text-xs">{r.hsn_code ?? "—"}</TableCell>
              <TableCell className="text-right tabular-nums">{Number(r.current_stock ?? 0)} {r.uom}</TableCell>
              <TableCell className="text-right tabular-nums">{formatINR(r.unit_price)}</TableCell>
              <TableCell className="text-right tabular-nums font-semibold">{formatINR(r.value)}</TableCell>
            </TableRow>
          ))}
          {enriched.length > 0 && <TableRow className="bg-muted/40 font-semibold">
            <TableCell colSpan={5} className="text-right">Total Stock Value</TableCell>
            <TableCell className="text-right tabular-nums">{formatINR(totalValue)}</TableCell>
          </TableRow>}
        </TableBody>
      </Table>
    </CardContent></Card>
  );
}

/* -------- Outstanding -------- */
function OutstandingReport() {
  const { data: rows = [] } = useQuery({
    queryKey: ["rep-outstanding"],
    queryFn: async () => (await supabase.from("invoices")
      .select("invoice_number, invoice_date, customer_name_snapshot, grand_total, amount_paid, status")
      .in("status", ["sent", "partial"])
      .order("invoice_date")).data ?? [],
  });

  const enriched = rows.map((r: any) => {
    const due = Number(r.grand_total) - Number(r.amount_paid);
    const days = Math.max(0, Math.floor((Date.now() - new Date(r.invoice_date).getTime()) / 86400000));
    return { ...r, due, days };
  });

  return (
    <Card><CardHeader><CardTitle className="flex items-center justify-between">Outstanding Receivables
      <Button size="sm" variant="outline" onClick={() => downloadCSV(`outstanding_${today()}.csv`, enriched)}><Download className="mr-1 h-4 w-4" /> CSV</Button>
    </CardTitle></CardHeader>
    <CardContent className="p-0">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Invoice</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead>
          <TableHead className="text-right">Total</TableHead><TableHead className="text-right">Paid</TableHead><TableHead className="text-right">Due</TableHead><TableHead className="text-right">Age</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {enriched.length === 0 && <TableRow><TableCell colSpan={7} className="py-6 text-center text-muted-foreground">Nothing outstanding.</TableCell></TableRow>}
          {enriched.map((r: any, i: number) => (
            <TableRow key={i}>
              <TableCell className="font-mono">{billNo(r.invoice_number)}</TableCell>
              <TableCell>{formatDate(r.invoice_date)}</TableCell>
              <TableCell>{r.customer_name_snapshot}</TableCell>
              <TableCell className="text-right tabular-nums">{formatINR(r.grand_total)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatINR(r.amount_paid)}</TableCell>
              <TableCell className="text-right tabular-nums font-semibold">{formatINR(r.due)}</TableCell>
              <TableCell className={`text-right ${r.days > 30 ? "text-warning font-semibold" : ""}`}>{r.days}d</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent></Card>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatINR, formatDate } from "@/lib/format";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/payments")({
  head: () => ({ meta: [{ title: "Payments — ABJAD ERP" }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const { data: outstanding = [] } = useQuery({
    queryKey: ["outstanding"],
    queryFn: async () => (await supabase.from("invoices")
      .select("id, invoice_number, customer_name_snapshot, invoice_date, grand_total, amount_paid, status")
      .in("status", ["sent", "partial"])
      .order("invoice_date", { ascending: true })).data ?? [],
  });

  const { data: history = [] } = useQuery({
    queryKey: ["payment-history"],
    queryFn: async () => (await supabase.from("payments")
      .select("*, invoices(invoice_number, customer_name_snapshot)")
      .order("payment_date", { ascending: false })
      .limit(200)).data ?? [],
  });

  const totalOutstanding = outstanding.reduce((a: number, r: any) => a + (Number(r.grand_total) - Number(r.amount_paid)), 0);
  const today = new Date().toISOString().slice(0, 10);
  const overdue = outstanding.filter((r: any) => r.invoice_date < today && Number(r.grand_total) > Number(r.amount_paid)).length;

  const openRecord = (inv: any) => { setSelectedInvoice(inv); setDialogOpen(true); };

  return (
    <>
      <PageHeader title="Payments" description="Track outstanding receivables and record payments." />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Stat label="Total Outstanding" value={formatINR(totalOutstanding)} accent="warning" />
        <Stat label="Open Invoices" value={String(outstanding.length)} />
        <Stat label="Overdue" value={String(overdue)} accent={overdue ? "warning" : undefined} />
      </div>

      <Tabs defaultValue="outstanding">
        <TabsList>
          <TabsTrigger value="outstanding">Outstanding ({outstanding.length})</TabsTrigger>
          <TabsTrigger value="history">Payment History ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="outstanding">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outstanding.length === 0 && <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No outstanding invoices.</TableCell></TableRow>}
                  {outstanding.map((r: any) => {
                    const due = Number(r.grand_total) - Number(r.amount_paid);
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono">{r.invoice_number}</TableCell>
                        <TableCell>{r.customer_name_snapshot ?? "—"}</TableCell>
                        <TableCell>{formatDate(r.invoice_date)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatINR(r.grand_total)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatINR(r.amount_paid)}</TableCell>
                        <TableCell className="text-right tabular-nums font-semibold">{formatINR(due)}</TableCell>
                        <TableCell><Badge variant="outline" className="uppercase text-[10px]">{r.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => openRecord(r)}>
                            <Plus className="mr-1 h-3 w-3" /> Record Payment
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No payments recorded yet.</TableCell></TableRow>}
                  {history.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell>{formatDate(p.payment_date)}</TableCell>
                      <TableCell className="font-mono">{p.invoices?.invoice_number}</TableCell>
                      <TableCell>{p.invoices?.customer_name_snapshot ?? "—"}</TableCell>
                      <TableCell className="uppercase text-xs">{p.mode}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.reference ?? "—"}</TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">{formatINR(p.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RecordPaymentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        invoice={selectedInvoice}
        onSaved={() => { qc.invalidateQueries({ queryKey: ["outstanding"] }); qc.invalidateQueries({ queryKey: ["payment-history"] }); qc.invalidateQueries({ queryKey: ["invoices"] }); }}
      />
    </>
  );
}

function RecordPaymentDialog({ open, onClose, invoice, onSaved }: { open: boolean; onClose: () => void; invoice: any; onSaved: () => void }) {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("bank_transfer");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  if (!invoice) return null;
  const due = Number(invoice.grand_total) - Number(invoice.amount_paid);

  const save = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    if (amt > due + 0.01) return toast.error(`Amount cannot exceed due (${formatINR(due)})`);
    setSaving(true);
    const { error } = await supabase.from("payments").insert({
      invoice_id: invoice.id,
      payment_date: date,
      amount: amt,
      mode,
      reference: reference || null,
      notes: notes || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    const { logInvoiceEvent } = await import("@/lib/invoice-history");
    await logInvoiceEvent(invoice.id, "payment_received", `Payment of ${formatINR(amt)} via ${mode}${reference ? ` (${reference})` : ""}`, { amount: amt, mode, reference });
    toast.success("Payment recorded");
    setAmount(""); setReference(""); setNotes("");
    onSaved(); onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment — {invoice.invoice_number}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{invoice.customer_name_snapshot}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="tabular-nums">{formatINR(invoice.grand_total)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="tabular-nums">{formatINR(invoice.amount_paid)}</span></div>
            <div className="flex justify-between font-semibold"><span>Due</span><span className="tabular-nums">{formatINR(due)}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Amount *</Label>
              <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={String(due)} />
            </div>
            <div>
              <Label>Date *</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reference / Txn #</Label>
              <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Cheque no. / UTR / UPI ref" />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Record Payment"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
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
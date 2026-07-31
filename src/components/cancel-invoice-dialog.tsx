import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { logInvoiceEvent } from "@/lib/invoice-history";
import { toast } from "sonner";

export function CancelInvoiceDialog({
  invoiceId,
  invoiceNumber,
  trigger,
  onCancelled,
}: {
  invoiceId: string;
  invoiceNumber: string;
  trigger: React.ReactNode;
  onCancelled?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const cancel = async () => {
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await (supabase.from("invoices") as any)
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancelled_by: u.user?.id ?? null,
        cancellation_reason: reason || null,
      })
      .eq("id", invoiceId);
    setBusy(false);
    if (error) return toast.error(error.message);
    await logInvoiceEvent(invoiceId, "cancelled", `Invoice cancelled${reason ? `: ${reason}` : ""}`, { reason });
    toast.success(`Invoice ${invoiceNumber} cancelled`);
    setOpen(false);
    onCancelled?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel invoice {invoiceNumber}?</DialogTitle>
          <DialogDescription>
            The invoice will be marked <b>Cancelled</b>. It stays searchable and appears in reports, but cannot be edited or deleted. The invoice number is retained and never reused.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="reason" className="text-xs">Cancellation reason (optional)</Label>
          <Textarea id="reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Customer withdrew order, wrong details, duplicate…" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>Keep invoice</Button>
          <Button variant="destructive" onClick={cancel} disabled={busy}>{busy ? "Cancelling…" : "Confirm cancel"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
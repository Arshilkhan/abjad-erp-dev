import { supabase } from "@/integrations/supabase/client";

export type InvoiceEvent =
  | "created"
  | "edited"
  | "sent"
  | "cancelled"
  | "rejected_items"
  | "payment_received"
  | "credit_generated"
  | "adjustment"
  | "imported"
  | "duplicated";

export async function logInvoiceEvent(
  invoiceId: string,
  eventType: InvoiceEvent,
  description?: string,
  metadata?: Record<string, any>,
) {
  try {
    const { data: u } = await supabase.auth.getUser();
    await (supabase.from("invoice_history") as any).insert({
      invoice_id: invoiceId,
      event_type: eventType,
      description: description ?? null,
      metadata: metadata ?? null,
      actor_id: u.user?.id ?? null,
      actor_email: u.user?.email ?? null,
    });
  } catch (e) {
    // history is best-effort; never block the primary action
    console.error("[invoice-history]", e);
  }
}
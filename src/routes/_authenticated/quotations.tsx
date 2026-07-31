import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/_authenticated/quotations")({
  head: () => ({ meta: [{ title: "Quotations — ABJAD ERP" }] }),
  component: () => (
    <ComingSoon
      title="Quotations"
      description="Proforma invoices and customer quotations."
      features={[
        "Quotations use the same invoice engine — create one from Invoices → New → Type: Quotation",
        "Dedicated quotation list, conversion to Tax Invoice, and email delivery come in Phase 2",
        "Auto-numbering via QTN-YY-#### prefix (configurable in Settings)",
      ]}
    />
  ),
});
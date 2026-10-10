import { emptyItem, type LineItem } from "./types";

interface HydrateDocumentArgs {
  existing: { invoice: any; items: any[] };
  documentType: string;
  isChallan: boolean;
  isTaxInvoice: boolean;
  showPaymentTerms: boolean;
  setCustomerId: (value: string) => void;
  setCustomerText: (value: string) => void;
  setInvoiceType: (value: string) => void;
  setInvoiceDate: (value: string) => void;
  setChallanNumber: (value: string) => void;
  setChallanDates: (value: string[]) => void;
  setWorkOrder: (value: string) => void;
  setFreight: (value: number) => void;
  setPacking: (value: number) => void;
  setOtherCharges: (value: number) => void;
  setTransportCharges: (value: number) => void;
  setDeliveryCharges: (value: number) => void;
  setDeliveryMode: (value: string) => void;
  setPaymentTerms: (value: string) => void;
  setNotes: (value: string) => void;
  setMovementReason: (value: string) => void;
  setTransporterName: (value: string) => void;
  setPlaceOfDispatch: (value: string) => void;
  setPlaceOfDelivery: (value: string) => void;
  setItems: (value: LineItem[]) => void;
  setProductTexts: (value: string[]) => void;
}

export function hydrateDocument({
  existing,
  documentType,
  isChallan,
  isTaxInvoice,
  showPaymentTerms,
  setCustomerId,
  setCustomerText,
  setInvoiceType,
  setInvoiceDate,
  setChallanNumber,
  setChallanDates,
  setWorkOrder,
  setFreight,
  setPacking,
  setOtherCharges,
  setTransportCharges,
  setDeliveryCharges,
  setDeliveryMode,
  setPaymentTerms,
  setNotes,
  setMovementReason,
  setTransporterName,
  setPlaceOfDispatch,
  setPlaceOfDelivery,
  setItems,
  setProductTexts,
}: HydrateDocumentArgs): void {
  const inv = existing.invoice;
  setCustomerId(inv.customer_id ?? "");
  setCustomerText(inv.customer_name_snapshot ?? "");
  setInvoiceType(documentType);
  setInvoiceDate(inv.invoice_date);
  if (isChallan) {
    setChallanNumber((inv as any).challan_number ?? "");
    setChallanDates(
      ((inv as any).challan_dates as string[] | null) ??
        ((inv as any).challan_date ? [(inv as any).challan_date] : []),
    );
  }

  setWorkOrder(inv.work_order_number ?? "");
  if (showPaymentTerms) {
    setFreight(Number((inv as any).freight ?? 0));
    setPacking(Number((inv as any).packing_charges ?? 0));
    setOtherCharges(Number((inv as any).other_charges ?? 0));
    if (isTaxInvoice) {
      setTransportCharges(Number((inv as any).transportation_charges ?? 0));
      setDeliveryCharges(Number((inv as any).delivery_charges ?? 0));
    }
  }
  setDeliveryMode(inv.delivery_mode ?? "");
  setPaymentTerms(inv.payment_terms ?? "");
  setNotes(inv.notes ?? "");
  setMovementReason((inv as any).movement_reason ?? "Delivery / Supply");
  setTransporterName((inv as any).transporter_name ?? "");
  setPlaceOfDispatch((inv as any).place_of_dispatch ?? "");
  setPlaceOfDelivery((inv as any).place_of_delivery ?? "");
  setItems(
    existing.items.length
      ? existing.items.map((it: any, i: number) => ({
          sr_no: it.sr_no ?? i + 1,
          product_id: it.product_id,
          hsn_code: it.hsn_code ?? "",
          description: it.description ?? "",
          quantity: Number(it.quantity ?? 1),
          uom: it.uom ?? "NOS",
          unit_rate: isChallan ? 0 : Number(it.unit_rate ?? 0),
          discount_mode: "pct" as const,
          discount_value: isChallan ? 0 : Number(it.discount_pct ?? 0),
          tax_pct: isChallan ? 0 : Number(it.tax_pct ?? 18),
          serial_batch_number: (it as any).serial_batch_number ?? "",
        }))
      : [emptyItem(1)],
  );
  setProductTexts(
    existing.items.length
      ? existing.items.map((it: any) => it.description ?? "")
      : [""],
  );
}

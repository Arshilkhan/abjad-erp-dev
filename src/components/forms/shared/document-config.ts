import type { SalesDocumentKind } from "@/lib/sales-documents";

export interface DocumentFormConfig {
  kind: SalesDocumentKind;
  label: string;
  isTaxInvoice: boolean;
  isChallan: boolean;
  showPaymentTerms: boolean;
  showTransportDetails: boolean;
  showPricing: boolean;
  showTaxes: boolean;
}

export const DOCUMENT_FORM_CONFIG: Record<
  SalesDocumentKind,
  DocumentFormConfig
> = {
  tax_invoice: {
    kind: "tax_invoice",
    label: "Tax Invoice",
    isTaxInvoice: true,
    isChallan: false,
    showPaymentTerms: true,
    showTransportDetails: false,
    showPricing: true,
    showTaxes: true,
  },

  proforma: {
    kind: "proforma",
    label: "Proforma Invoice",
    isTaxInvoice: false,
    isChallan: false,
    showPaymentTerms: true,
    showTransportDetails: false,
    showPricing: true,
    showTaxes: true,
  },

  quotation: {
    kind: "quotation",
    label: "Quotation",
    isTaxInvoice: false,
    isChallan: false,
    showPaymentTerms: true,
    showTransportDetails: false,
    showPricing: true,
    showTaxes: true,
  },

  delivery_challan: {
    kind: "delivery_challan",
    label: "Delivery Challan",
    isTaxInvoice: false,
    isChallan: true,
    showPaymentTerms: false,
    showTransportDetails: true,
    showPricing: false,
    showTaxes: false,
  },
};

export function getDocumentFormConfig(
  kind: SalesDocumentKind,
): DocumentFormConfig {
  return DOCUMENT_FORM_CONFIG[kind];
}
export type SalesDocumentKind = "tax_invoice" | "proforma" | "quotation" | "delivery_challan";

export const SALES_DOCUMENTS = {
  tax_invoice: { table: "invoices", itemsTable: "invoice_items", panelPath: "/invoices", label: "Tax Invoice", prefix: "" },
  proforma: { table: "performa", itemsTable: "performa_items", panelPath: "/proformas", label: "Proforma Invoice", prefix: "pf-" },
  quotation: { table: "quotation", itemsTable: "quotation_items", panelPath: "/quotations", label: "Quotation", prefix: "qt-" },
  delivery_challan: { table: "challan", itemsTable: "challan_items", panelPath: "/challans", label: "Delivery Challan", prefix: "dc-" },
} as const;

export function salesDocumentConfig(kind: SalesDocumentKind) {
  return SALES_DOCUMENTS[kind];
}

export function isSalesDocumentKind(value: string): value is SalesDocumentKind {
  return value in SALES_DOCUMENTS;
}
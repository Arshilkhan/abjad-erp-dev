export const DOCUMENT_TYPES = ["quotation", "proforma", "tax_invoice", "delivery_challan"] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export interface DocumentDefinition {
  title: string;
  detailsTitle: string;
  numberLabel: string;
  dateLabel: string;
  customerLabel: string;
  panelPath: "/quotations" | "/proformas" | "/invoices" | "/challans";
  recipientLabel: string;
}

export const DOCUMENT_DEFINITIONS: Record<DocumentType, DocumentDefinition> = {
  quotation: {
    title: "Quotation",
    detailsTitle: "Quotation Details",
    numberLabel: "Quotation Number",
    dateLabel: "Quotation Date",
    customerLabel: "Customer",
    panelPath: "/quotations",
    recipientLabel: "quotation",
  },
  proforma: {
    title: "Proforma Invoice",
    detailsTitle: "Proforma Invoice Details",
    numberLabel: "Proforma Invoice Number",
    dateLabel: "Proforma Invoice Date",
    customerLabel: "Customer",
    panelPath: "/proformas",
    recipientLabel: "proforma invoice",
  },
  tax_invoice: {
    title: "Tax Invoice",
    detailsTitle: "Tax Invoice Details",
    numberLabel: "Invoice Number",
    dateLabel: "Invoice Date",
    customerLabel: "Bill To",
    panelPath: "/invoices",
    recipientLabel: "tax invoice",
  },
  delivery_challan: {
    title: "Delivery Challan",
    detailsTitle: "Delivery Challan Details",
    numberLabel: "Delivery Challan Number",
    dateLabel: "Delivery Challan Date",
    customerLabel: "Customer / Consignee",
    panelPath: "/challans",
    recipientLabel: "delivery challan",
  },
};

export function isDocumentType(value: string): value is DocumentType {
  return DOCUMENT_TYPES.includes(value as DocumentType);
}

export function documentDefinition(value: string): DocumentDefinition {
  return DOCUMENT_DEFINITIONS[isDocumentType(value) ? value : "tax_invoice"];
}

export function displayedDocumentNumber(document: Record<string, unknown>): string {
  const finalNumber = Number(document["document_no"] ?? 0);
  if (Number.isFinite(finalNumber) && finalNumber > 0) return String(finalNumber);
  const legacy = String(document["invoice_number"] ?? "");
  if (legacy.startsWith("draft-")) return "Draft";
  const match = legacy.match(/^(?:dc-)?(\d+)/i);
  return match?.[1] ?? legacy;
}
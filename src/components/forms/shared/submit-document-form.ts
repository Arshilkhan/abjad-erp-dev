import type { SupabaseClient } from "@supabase/supabase-js";
import { buildDocumentPayload } from "./document-payload";
import { resolveCustomer, resolveProducts } from "./resolve-document-data";
import { saveDocument } from "./save-document";
import { validateDocument } from "./validate-document";
import type { LineItem } from "./types";

interface SubmitDocumentFormArgs {
  status: "draft" | "sent";
  supabase: SupabaseClient;
  settings?: {
    mandatory_gst_number?: boolean | null;
    mandatory_challan_number?: boolean | null;
  } | null;
  isChallan: boolean;
  isTaxInvoice: boolean;
  showPaymentTerms: boolean;
  items: LineItem[];
  cfg: (key: string) => {
    visible: boolean;
    mandatory: boolean;
    label?: string;
  };
  customer: any;
  customers: any[];
  products: any[];
  customerText: string;
  customerCompany: string;
  customerAddress: string;
  customerMobile: string;
  customerEmail: string;
  customerGst: string;
  productTexts: string[];
  organizationId: string;
  createdBy?: string;
  challanNumber: string;
  freight: number;
  packing: number;
  otherCharges: number;
  transportCharges: number;
  deliveryCharges: number;
  invoiceType: string;
  invoiceDate: string;
  workOrder: string;
  deliveryMode: string;
  notes: string;
  isIGST: boolean;
  challanDates: string[];
  movementReason: string;
  transporterName: string;
  placeOfDispatch: string;
  placeOfDelivery: string;
  totals: {
    net: number;
    disc: number;
    tax: number;
    subtotal: number;
    round_off: number;
    grand: number;
  };
  paymentTerms: string;
  docTable: string;
  docItemsTable: string;
  isEdit: boolean;
  editId?: string;
  docPrefix: string;
  importMode?: boolean;
  pdfImported?: boolean;
}

export async function submitDocumentForm({
  status,
  supabase,
  settings,
  isChallan,
  isTaxInvoice,
  showPaymentTerms,
  items,
  cfg,
  customer,
  customers,
  products,
  customerText,
  customerCompany,
  customerAddress,
  customerMobile,
  customerEmail,
  customerGst,
  productTexts,
  organizationId,
  createdBy,
  challanNumber,
  freight,
  packing,
  otherCharges,
  transportCharges,
  deliveryCharges,
  invoiceType,
  invoiceDate,
  workOrder,
  deliveryMode,
  notes,
  isIGST,
  challanDates,
  movementReason,
  transporterName,
  placeOfDispatch,
  placeOfDelivery,
  totals,
  paymentTerms,
  docTable,
  docItemsTable,
  isEdit,
  editId,
  docPrefix,
  importMode,
  pdfImported,
}: SubmitDocumentFormArgs) {
  const nameTyped = customerText.trim();

  validateDocument({
    customerCompany,
    customerGst,
    mandatoryGstNumber: settings?.mandatory_gst_number,
    isChallan,
    mandatoryChallanNumber: settings?.mandatory_challan_number,
    challanNumber,
    showPaymentTerms,
    isTaxInvoice,
    itemsCount: items.length,
    cfg,
    freight,
    packing,
    otherCharges,
    transportCharges,
    deliveryCharges,
  });

  const resolvedCustomer = await resolveCustomer({
    supabase,
    customer,
    customers,
    customerText,
    custCompany: customerCompany,
    custAddress: customerAddress,
    custMobile: customerMobile,
    custEmail: customerEmail,
    custGst: customerGst,
    createdBy,
    organizationId,
  });

  // Create any products that were typed in but don't exist yet.
  const resolvedItems = await resolveProducts({
    supabase,
    items,
    productTexts,
    products,
    organizationId,
  });

  const payload = buildDocumentPayload({
    organizationId,
    invoiceType,
    invoiceDate,
    customerId: resolvedCustomer.id,
    customerName: resolvedCustomer.company_name || resolvedCustomer.customer_name,
    customerGst: resolvedCustomer.gst_number,
    customerAddress: customerAddress.trim() || resolvedCustomer.billing_address,
    workOrder,
    deliveryMode,
    contactPerson: nameTyped,
    contactMobile: customerMobile,
    notes,
    status,
    isChallan,
    isTaxInvoice,
    isIGST,
    challanNumber,
    challanDates,
    movementReason,
    transporterName,
    placeOfDispatch,
    placeOfDelivery,
    totals,
    freight,
    packing,
    otherCharges,
    transportCharges,
    deliveryCharges,
    paymentTerms,
  });

  return saveDocument({
    supabase,
    docTable,
    docItemsTable,
    payload,
    items: resolvedItems,
    organizationId,
    isChallan,
    isEdit,
    editId,
    docPrefix,
    customerName:
      customerCompany ||
      resolvedCustomer.company_name ||
      resolvedCustomer.customer_name ||
      customerText ||
      "customer",
    createdBy,
    isTaxInvoice,
    importMode,
    pdfImported,
  });
}

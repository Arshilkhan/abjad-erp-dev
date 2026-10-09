import { logInvoiceEvent } from "@/lib/invoice-history";

interface DocumentSaveHistoryArgs {
  invoiceId: string;
  invoiceNumber: string;
  isTaxInvoice: boolean;
  isEdit: boolean;
  importMode?: boolean;
  pdfImported?: boolean;
}

export async function logDocumentSaveHistory({
  invoiceId,
  invoiceNumber,
  isTaxInvoice,
  isEdit,
  importMode,
  pdfImported,
}: DocumentSaveHistoryArgs) {
  if (!isTaxInvoice) return;

  if (isEdit) {
    await logInvoiceEvent(invoiceId, "edited", "Invoice edited");
  } else if (importMode || pdfImported) {
    await logInvoiceEvent(
      invoiceId,
      "imported",
      `Imported invoice ${invoiceNumber}`,
    );
  } else {
    await logInvoiceEvent(
      invoiceId,
      "created",
      `Created invoice ${invoiceNumber}`,
    );
  }
}

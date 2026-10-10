import { logInvoiceEvent } from "@/lib/invoice-history";
import type { SalesDocumentKind } from "@/lib/sales-documents";
import { logDocumentSaveHistory } from "./document-save-history";

interface SavedDocument {
  id: string;
  invoice_number: string;
}

interface HandleDocumentSaveSuccessArgs {
  invoice: SavedDocument;
  status: "draft" | "sent";
  documentType: SalesDocumentKind;
  documentLabel: string;
  isTaxInvoice: boolean;
  isEdit: boolean;
  importMode?: boolean;
  pdfImported?: boolean;
  invalidateQueries: (queryKey: string[]) => void;
  sendEmail: (args: {
    data: { invoiceId: string; kind: SalesDocumentKind };
  }) => Promise<unknown>;
  navigate: (invoiceId: string, kind: SalesDocumentKind) => void;
  notify: {
    success: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
    error: (message: string) => void;
  };
}

export async function handleDocumentSaveSuccess({
  invoice,
  status,
  documentType,
  documentLabel,
  isTaxInvoice,
  isEdit,
  importMode,
  pdfImported,
  invalidateQueries,
  sendEmail,
  navigate,
  notify,
}: HandleDocumentSaveSuccessArgs): Promise<void> {
  invalidateQueries(["customers-list"]);
  invalidateQueries(["products-list"]);
  await logDocumentSaveHistory({
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoice_number,
    isTaxInvoice,
    isEdit,
    importMode,
    pdfImported,
  });
  notify.success(
    `${documentLabel} ${invoice.invoice_number} ${isEdit ? "updated" : importMode ? "imported" : "created"}`,
  );

  if (status === "sent") {
    try {
      const result: any = await sendEmail({
        data: { invoiceId: invoice.id, kind: documentType },
      });
      if (result?.sent) {
        notify.success(`${documentLabel} emailed to ${result.email}`);

        if (isTaxInvoice) {
          await logInvoiceEvent(
            invoice.id,
            "sent",
            `${documentLabel} emailed to ${result.email}`,
          );
        }
      } else if (result?.reason === "no_email") {
        notify.info(
          `Saved. No customer email on file, so the ${documentLabel.toLowerCase()} was not sent.`,
        );
      } else if (result?.reason === "recipient_suppressed") {
        notify.warning("Saved. The customer has unsubscribed from emails.");
      }
    } catch (error: any) {
      notify.error(
        `Invoice saved, but the email could not be sent: ${error?.message ?? "unknown error"}`,
      );
    }
  }

  navigate(invoice.id, documentType);
}

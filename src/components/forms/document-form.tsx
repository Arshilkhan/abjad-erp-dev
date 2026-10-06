import type { ComponentProps } from "react";
import { InvoiceForm } from "@/components/invoice-form";
import type { SalesDocumentKind } from "@/lib/sales-documents";

export type DocumentFormProps = Omit<ComponentProps<typeof InvoiceForm>, "documentType"> & {
  documentType: SalesDocumentKind;
};

/**
 * Temporary compatibility core for the document-form split.
 *
 * Each document type now gets its own entry point under components/forms.
 * The existing, battle-tested InvoiceForm remains the implementation core
 * until the individual UIs are migrated one by one.
 */
export function DocumentForm({ documentType, ...props }: DocumentFormProps) {
  return <InvoiceForm {...props} documentType={documentType} />;
}

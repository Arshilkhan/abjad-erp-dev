import { DocumentForm, type DocumentFormProps } from "./document-form";

export type TaxInvoiceFormProps = Omit<DocumentFormProps, "documentType">;

export function TaxInvoiceForm(props: TaxInvoiceFormProps) {
  return <DocumentForm {...props} documentType="tax_invoice" />;
}

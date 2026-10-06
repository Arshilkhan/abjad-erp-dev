import { DocumentForm, type DocumentFormProps } from "./document-form";

export type QuotationFormProps = Omit<DocumentFormProps, "documentType">;

export function QuotationForm(props: QuotationFormProps) {
  return <DocumentForm {...props} documentType="quotation" />;
}

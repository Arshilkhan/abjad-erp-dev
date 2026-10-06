import { DocumentForm, type DocumentFormProps } from "./document-form";

export type ProformaFormProps = Omit<DocumentFormProps, "documentType">;

export function ProformaForm(props: ProformaFormProps) {
  return <DocumentForm {...props} documentType="proforma" />;
}

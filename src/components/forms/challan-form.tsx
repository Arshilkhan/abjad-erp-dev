import { DocumentForm, type DocumentFormProps } from "./document-form";

export type ChallanFormProps = Omit<DocumentFormProps, "documentType">;

export function ChallanForm(props: ChallanFormProps) {
  return <DocumentForm {...props} documentType="delivery_challan" />;
}

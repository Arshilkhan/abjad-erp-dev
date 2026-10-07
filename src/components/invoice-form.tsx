import type { ComponentProps } from "react";
import { DocumentForm } from "@/components/forms/document-form";

export type InvoiceFormProps = ComponentProps<typeof DocumentForm>;

export function InvoiceForm(props: InvoiceFormProps) {
  return <DocumentForm {...props} />;
}

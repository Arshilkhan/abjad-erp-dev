import type { ReactNode } from "react";

export interface DocumentFormCoreProps {
  header?: ReactNode;
  details?: ReactNode;
  items?: ReactNode;
  additionalDetails?: ReactNode;
  totals?: ReactNode;
  footer?: ReactNode;
}

export function DocumentFormCore({
  header,
  details,
  items,
  additionalDetails,
  totals,
  footer,
}: DocumentFormCoreProps) {
  return (
    <div className="space-y-4">
      {header}
      {details}
      {items}
      {additionalDetails}
      {totals}
      {footer}
    </div>
  );
}
export interface LineItem {
  sr_no: number;
  product_id: string | null;
  hsn_code: string;
  description: string;
  quantity: number;
  uom: string;
  unit_rate: number;
  discount_mode: "pct" | "flat";
  discount_value: number;
  tax_pct: number;
  serial_batch_number: string;
}

export const MOVEMENT_REASONS = [
  "Delivery / Supply",
  "Job Work",
  "Repair",
  "Returnable Goods",
  "Sample / Demo",
  "Stock Transfer",
  "Other",
];

export function emptyItem(sr: number): LineItem {
  return {
    sr_no: sr,
    product_id: null,
    hsn_code: "",
    description: "",
    quantity: 1,
    uom: "NOS",
    unit_rate: 0,
    discount_mode: "pct",
    discount_value: 0,
    tax_pct: 18,
    serial_batch_number: "",
  };
}

export function computeItem(it: LineItem) {
  const gross = it.quantity * it.unit_rate;
  const raw = Number(it.discount_value || 0);

  const discount_amount =
    it.discount_mode === "flat"
      ? Math.min(Math.max(raw, 0), gross)
      : (gross * Math.min(Math.max(raw, 0), 100)) / 100;

  const discount_pct = gross > 0
    ? (discount_amount / gross) * 100
    : 0;

  const net = gross - discount_amount;
  const tax_amount = (net * it.tax_pct) / 100;
  const total_amount = net + tax_amount;

  return {
    discount_amount,
    discount_pct,
    tax_amount,
    total_amount,
    net,
  };
}

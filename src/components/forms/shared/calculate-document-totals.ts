import { computeItem, type LineItem } from "./types";

interface CalculateDocumentTotalsArgs {
  items: LineItem[];
  freight: number;
  packing: number;
  otherCharges: number;
  transportCharges: number;
  deliveryCharges: number;
}

export function calculateDocumentTotals({
  items,
  freight,
  packing,
  otherCharges,
  transportCharges,
  deliveryCharges,
}: CalculateDocumentTotalsArgs) {
  let net = 0;
  let tax = 0;
  let disc = 0;

  for (const item of items) {
    const calculated = computeItem(item);
    net += calculated.net;
    tax += calculated.tax_amount;
    disc += calculated.discount_amount;
  }

  const subtotal =
    net +
    Number(freight || 0) +
    Number(packing || 0) +
    Number(otherCharges || 0) +
    Number(transportCharges || 0) +
    Number(deliveryCharges || 0);
  const preRound = subtotal + tax;
  const grand = Math.round(preRound);
  const round_off = grand - preRound;

  return { net, tax, disc, subtotal, grand, round_off };
}

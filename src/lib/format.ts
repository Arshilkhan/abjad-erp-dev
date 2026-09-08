export function formatINR(amount: number | null | undefined, opts?: { withSymbol?: boolean; decimals?: number }): string {
  const n = Number(amount ?? 0);
  const decimals = opts?.decimals ?? 2;
  const s = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
  return opts?.withSymbol === false ? s : `₹${s}`;
}

export function formatCompactINR(amount: number | null | undefined): string {
  const n = Number(amount ?? 0);
  if (Math.abs(n) >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}

const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigit(n: number): string {
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
}

function threeDigit(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  return (h ? ones[h] + " Hundred" + (r ? " " : "") : "") + (r ? twoDigit(r) : "");
}

export function amountInWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  if (rupees === 0 && paise === 0) return "Zero Rupees Only";
  let n = rupees;
  const parts: string[] = [];
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  const hundred = n;
  if (crore) parts.push(twoDigit(crore) + " Crore");
  if (lakh) parts.push(twoDigit(lakh) + " Lakh");
  if (thousand) parts.push(twoDigit(thousand) + " Thousand");
  if (hundred) parts.push(threeDigit(hundred));
  let out = parts.join(" ") + " Rupees";
  if (paise) out += " and " + twoDigit(paise) + " Paise";
  return out + " Only";
}

/** DD-MM-YYYY */
export function formatDate(d: string | Date | null | undefined): string {
  if (!d) return "-";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "-";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}

/** Delivery challans are stored with a "dc-" prefixed reference and carry no bill number. */
export function isChallanNumber(invoiceNumber: string | null | undefined): boolean {
  return /^dc-/i.test(String(invoiceNumber ?? "").trim());
}

/** Displays only the bill number portion of a stored invoice number ("2-jhon" -> "2"). */
export function billNo(invoiceNumber: string | null | undefined): string {
  const s = String(invoiceNumber ?? "").trim();
  if (!s || isChallanNumber(s)) return "";
  const m = /^(\d+)(?:[-_].*)?$/.exec(s);
  return m ? m[1]! : s;
}

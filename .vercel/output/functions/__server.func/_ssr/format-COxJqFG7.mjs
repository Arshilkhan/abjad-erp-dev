//#region node_modules/.nitro/vite/services/ssr/assets/format-COxJqFG7.js
function formatINR(amount, opts) {
	const n = Number(amount ?? 0);
	const decimals = opts?.decimals ?? 2;
	const s = new Intl.NumberFormat("en-IN", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}).format(n);
	return opts?.withSymbol === false ? s : `₹${s}`;
}
function formatCompactINR(amount) {
	const n = Number(amount ?? 0);
	if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
	if (Math.abs(n) >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
	if (Math.abs(n) >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`;
	return `₹${n.toFixed(0)}`;
}
var ones = [
	"",
	"One",
	"Two",
	"Three",
	"Four",
	"Five",
	"Six",
	"Seven",
	"Eight",
	"Nine",
	"Ten",
	"Eleven",
	"Twelve",
	"Thirteen",
	"Fourteen",
	"Fifteen",
	"Sixteen",
	"Seventeen",
	"Eighteen",
	"Nineteen"
];
var tens = [
	"",
	"",
	"Twenty",
	"Thirty",
	"Forty",
	"Fifty",
	"Sixty",
	"Seventy",
	"Eighty",
	"Ninety"
];
function twoDigit(n) {
	if (n < 20) return ones[n];
	return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
}
function threeDigit(n) {
	const h = Math.floor(n / 100);
	const r = n % 100;
	return (h ? ones[h] + " Hundred" + (r ? " " : "") : "") + (r ? twoDigit(r) : "");
}
function amountInWords(amount) {
	const rupees = Math.floor(amount);
	const paise = Math.round((amount - rupees) * 100);
	if (rupees === 0 && paise === 0) return "Zero Rupees Only";
	let n = rupees;
	const parts = [];
	const crore = Math.floor(n / 1e7);
	n %= 1e7;
	const lakh = Math.floor(n / 1e5);
	n %= 1e5;
	const thousand = Math.floor(n / 1e3);
	n %= 1e3;
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
function formatDate(d) {
	if (!d) return "-";
	const date = typeof d === "string" ? new Date(d) : d;
	if (Number.isNaN(date.getTime())) return "-";
	return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
}
/** Delivery challans are stored with a "dc-" prefixed reference and carry no bill number. */
function isChallanNumber(invoiceNumber) {
	return /^dc-/i.test(String(invoiceNumber ?? "").trim());
}
/** Displays only the bill number portion of a stored invoice number ("2-jhon" -> "2"). */
function billNo(invoiceNumber) {
	const s = String(invoiceNumber ?? "").trim();
	if (!s || isChallanNumber(s)) return "";
	const m = /^(\d+)(?:[-_].*)?$/.exec(s);
	return m ? m[1] : s;
}
//#endregion
export { formatINR as a, formatDate as i, billNo as n, formatCompactINR as r, amountInWords as t };

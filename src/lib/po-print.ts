import { formatINR, formatDate, amountInWords } from "@/lib/format";

type Company = Record<string, any> | null | undefined;

const esc = (v: any) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const nl2br = (v: any) => esc(v).replace(/\n/g, "<br/>");

/** Builds a Tally-style Purchase Order HTML document (A4, print ready). */
export function buildPOHtml(po: any, items: any[], company: Company, vendor?: Record<string, any> | null): string {
  const companyBlock = [
    esc(company?.name ?? "Company"),
    nl2br(company?.address),
    [company?.city, company?.state, company?.pincode].filter(Boolean).map(esc).join(", "),
    company?.email ? `E-Mail : ${esc(company.email)}` : "",
  ]
    .filter(Boolean)
    .join("<br/>");

  const supplierBlock = [
    esc(po.vendor_name_snapshot ?? vendor?.vendor_name ?? "—"),
    nl2br(po.vendor_address_snapshot ?? vendor?.address),
    vendor?.email ? `E-Mail : ${esc(vendor.email)}` : "",
    vendor?.mobile ? `Mobile : ${esc(vendor.mobile)}` : "",
  ]
    .filter(Boolean)
    .join("<br/>");

  const taxTotal = Number(po.igst_amount ?? 0) + Number(po.cgst_amount ?? 0) + Number(po.sgst_amount ?? 0);
  const qtyTotal = items.reduce((a, i) => a + Number(i.quantity ?? 0), 0);

  const rows = items
    .map(
      (it: any, idx: number) => `
      <tr>
        <td class="c">${idx + 1}</td>
        <td><strong>${esc(it.description)}</strong>${it.hsn_code ? `<br/><span class="muted">HSN: ${esc(it.hsn_code)}</span>` : ""}</td>
        <td class="c">${po.expected_date ? esc(formatDate(po.expected_date)) : esc(formatDate(po.po_date))}</td>
        <td class="r">${Number(it.quantity ?? 0).toLocaleString("en-IN")} ${esc(it.uom ?? "nos")}</td>
        <td class="r">${formatINR(it.unit_rate, { withSymbol: false })}</td>
        <td class="c">${esc(it.uom ?? "nos")}</td>
        <td class="r">${Number(it.tax_pct ?? 0)} %</td>
        <td class="r">${formatINR(Number(it.quantity ?? 0) * Number(it.unit_rate ?? 0), { withSymbol: false })}</td>
      </tr>`,
    )
    .join("");

  const taxRows = po.is_igst
    ? `<tr><td></td><td>IGST</td><td></td><td></td><td></td><td></td><td class="r"></td><td class="r">${formatINR(po.igst_amount, { withSymbol: false })}</td></tr>`
    : `<tr><td></td><td>CGST</td><td></td><td></td><td></td><td></td><td class="r"></td><td class="r">${formatINR(po.cgst_amount, { withSymbol: false })}</td></tr>
       <tr><td></td><td>SGST</td><td></td><td></td><td></td><td></td><td class="r"></td><td class="r">${formatINR(po.sgst_amount, { withSymbol: false })}</td></tr>`;

  return `<!doctype html>
<html><head><meta charset="utf-8"/>
<title>PO ${esc(po.po_number)}</title>
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #000; margin: 0; }
  h1 { text-align: center; font-size: 15px; letter-spacing: 1px; margin: 0 0 8px; }
  table { width: 100%; border-collapse: collapse; }
  td, th { border: 1px solid #000; padding: 4px 6px; vertical-align: top; }
  th { font-size: 10px; text-align: left; font-weight: bold; }
  .c { text-align: center; }
  .r { text-align: right; }
  .muted { color: #444; font-size: 10px; }
  .lbl { font-size: 10px; font-weight: bold; }
  .items td { height: 18px; }
  .items .filler td { border-top: none; border-bottom: none; height: 90px; }
  .totals td { font-weight: bold; }
  .foot { margin-top: 8px; display: flex; justify-content: space-between; gap: 12px; }
  .sign { text-align: right; min-width: 200px; }
  .jur { text-align: center; margin-top: 10px; font-size: 10px; }
  .words { border: 1px solid #000; padding: 5px 6px; margin-top: 6px; }
</style></head>
<body>
  <h1>PURCHASE ORDER</h1>
  <table>
    <tr>
      <td rowspan="3" style="width:45%"><span class="lbl">Invoice To/Dispatch to</span><br/>${companyBlock}</td>
      <td style="width:27%"><span class="lbl">Voucher No.</span><br/>${esc(po.po_number)}</td>
      <td style="width:28%"><span class="lbl">Dated</span><br/>${esc(formatDate(po.po_date))}</td>
    </tr>
    <tr>
      <td><span class="lbl">Mode/Terms of Payment</span><br/>${esc(vendor?.payment_terms ?? "—")}</td>
      <td><span class="lbl">Expected Delivery</span><br/>${po.expected_date ? esc(formatDate(po.expected_date)) : "—"}</td>
    </tr>
    <tr>
      <td><span class="lbl">Supplier's GSTIN</span><br/>${esc(po.vendor_gst_snapshot ?? vendor?.gst_number ?? "—")}</td>
      <td><span class="lbl">Company's GSTIN</span><br/>${esc(company?.gst_number ?? "—")}</td>
    </tr>
    <tr>
      <td rowspan="2"><span class="lbl">Supplier</span><br/>${supplierBlock}</td>
      <td><span class="lbl">Status</span><br/>${esc(String(po.status ?? "").toUpperCase())}</td>
      <td><span class="lbl">Tax Type</span><br/>${po.is_igst ? "IGST" : "CGST + SGST"}</td>
    </tr>
    <tr>
      <td colspan="2"><span class="lbl">Other Reference(s)</span><br/>${nl2br(po.notes ?? "—")}</td>
    </tr>
  </table>

  <table class="items" style="margin-top:6px">
    <thead>
      <tr>
        <th class="c" style="width:6%">Sl No.</th>
        <th>Description of Goods</th>
        <th class="c" style="width:11%">Due on</th>
        <th class="r" style="width:11%">Quantity</th>
        <th class="r" style="width:10%">Rate</th>
        <th class="c" style="width:7%">per</th>
        <th class="r" style="width:8%">Tax %</th>
        <th class="r" style="width:13%">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${rows || `<tr><td colspan="8" class="c">No line items</td></tr>`}
      <tr class="filler"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td class="r" colspan="6">Net Value</td><td class="r">${formatINR(po.net_value, { withSymbol: false })}</td></tr>
      ${taxRows}
      ${Number(po.round_off ?? 0) !== 0 ? `<tr><td></td><td>Round Off</td><td></td><td></td><td></td><td></td><td></td><td class="r">${formatINR(po.round_off, { withSymbol: false })}</td></tr>` : ""}
      <tr class="totals">
        <td></td><td>Total</td><td></td>
        <td class="r">${qtyTotal.toLocaleString("en-IN")}</td>
        <td></td><td></td>
        <td class="r">${formatINR(taxTotal, { withSymbol: false })}</td>
        <td class="r">₹ ${formatINR(po.grand_total, { withSymbol: false })}</td>
      </tr>
    </tbody>
  </table>

  <div class="words"><span class="lbl">Amount Chargeable (in words)</span><br/>${esc(amountInWords(Number(po.grand_total ?? 0)))}<br/><span class="muted">E. &amp; O.E</span></div>

  <div class="foot">
    <div class="muted">
      ${company?.pan_number ? `Company's PAN : ${esc(company.pan_number)}<br/>` : ""}
      ${po.vendor_gst_snapshot || vendor?.gst_number ? `Supplier's GSTIN : ${esc(po.vendor_gst_snapshot ?? vendor?.gst_number)}<br/>` : ""}
      ${vendor?.pan_number ? `Supplier's PAN : ${esc(vendor.pan_number)}` : ""}
    </div>
    <div class="sign">
      for ${esc(company?.name ?? "Company")}<br/><br/><br/>
      Authorised Signatory
    </div>
  </div>
  <div class="jur">SUBJECT TO ${esc((company?.city ?? "").toUpperCase() || "LOCAL")} JURISDICTION</div>
</body></html>`;
}

/** Opens the PO in a new window and triggers the browser print/save-as-PDF dialog. */
export function printPOHtml(html: string) {
  const w = window.open("", "_blank", "width=900,height=1000");
  if (!w) return false;
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
  return true;
}

/** Builds a mailto: link forwarding the PO to the vendor. */
export function buildPOMailto(po: any, vendorEmail: string, companyName?: string | null) {
  const subject = `Purchase Order ${po.po_number} — ${companyName ?? ""}`.trim();
  const body = [
    `Dear ${po.vendor_name_snapshot ?? "Supplier"},`,
    "",
    `Please find our Purchase Order ${po.po_number} dated ${formatDate(po.po_date)}.`,
    `Order value: ${formatINR(po.grand_total)}`,
    po.expected_date ? `Expected delivery: ${formatDate(po.expected_date)}` : "",
    "",
    "The purchase order PDF is attached.",
    "",
    "Regards,",
    companyName ?? "",
  ]
    .filter((l) => l !== undefined)
    .join("\n");
  return `mailto:${encodeURIComponent(vendorEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

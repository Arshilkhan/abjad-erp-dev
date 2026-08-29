import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

type Row = Record<string, any>

const inr = (n: number) =>
  'Rs. ' +
  Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const clean = (v: any) => String(v ?? '').replace(/[^\x20-\x7E\n]/g, '')

/** Builds a simple, print-clean A4 invoice PDF and returns the bytes. */
export async function buildInvoicePdf(
  invoice: Row,
  items: Row[],
  company: Row | null,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)

  let page = pdf.addPage([595.28, 841.89])
  const { width } = page.getSize()
  const margin = 40
  let y = 800

  const dark = rgb(0.07, 0.09, 0.15)
  const grey = rgb(0.42, 0.45, 0.5)

  const text = (
    s: string,
    x: number,
    size = 9,
    opts: { bold?: boolean; color?: any; align?: 'left' | 'right' } = {},
  ) => {
    const f = opts.bold ? bold : font
    const str = clean(s)
    const w = f.widthOfTextAtSize(str, size)
    page.drawText(str, {
      x: opts.align === 'right' ? x - w : x,
      y,
      size,
      font: f,
      color: opts.color ?? dark,
    })
  }

  const line = () => {
    page.drawLine({
      start: { x: margin, y: y + 6 },
      end: { x: width - margin, y: y + 6 },
      thickness: 0.7,
      color: rgb(0.85, 0.87, 0.9),
    })
  }

  const nextPage = () => {
    page = pdf.addPage([595.28, 841.89])
    y = 800
  }

  // Header
  text(company?.['name'] ?? 'Invoice', margin, 16, { bold: true })
  y -= 14
  const addr = [company?.['address'], [company?.['city'], company?.['state'], company?.['pincode']].filter(Boolean).join(', ')]
    .filter(Boolean)
    .join(', ')
  if (addr) {
    text(addr, margin, 8, { color: grey })
    y -= 11
  }
  const cLine = [
    company?.['gst_number'] ? `GSTIN: ${company['gst_number']}` : '',
    company?.['mobile'] ? `Mobile: ${company['mobile']}` : '',
    company?.['email'] ? `Email: ${company['email']}` : '',
  ]
    .filter(Boolean)
    .join('   ')
  if (cLine) {
    text(cLine, margin, 8, { color: grey })
    y -= 11
  }

  y -= 8
  text('TAX INVOICE', width / 2 - 34, 12, { bold: true })
  y -= 18
  line()
  y -= 12

  // Meta
  text(`Invoice No: ${invoice['invoice_number'] ?? ''}`, margin, 9, { bold: true })
  text(`Date: ${invoice['invoice_date'] ?? ''}`, width - margin, 9, { align: 'right' })
  y -= 20

  // Bill to
  text('Bill To', margin, 9, { bold: true, color: grey })
  y -= 12
  const billLines = [
    invoice['customer_name_snapshot'],
    invoice['contact_person'] ? `Attn: ${invoice['contact_person']}` : '',
    invoice['customer_address_snapshot'],
    invoice['customer_gst_snapshot'] ? `GSTIN: ${invoice['customer_gst_snapshot']}` : '',
  ].filter(Boolean)
  for (const l of billLines) {
    text(String(l), margin, 9)
    y -= 12
  }

  y -= 8
  line()
  y -= 14

  // Table header
  const cols = { sr: margin, desc: margin + 26, hsn: 330, qty: 395, rate: 455, amt: width - margin }
  text('#', cols.sr, 8, { bold: true, color: grey })
  text('Description', cols.desc, 8, { bold: true, color: grey })
  text('HSN', cols.hsn, 8, { bold: true, color: grey })
  text('Qty', cols.qty, 8, { bold: true, color: grey, align: 'right' })
  text('Rate', cols.rate, 8, { bold: true, color: grey, align: 'right' })
  text('Amount', cols.amt, 8, { bold: true, color: grey, align: 'right' })
  y -= 6
  line()
  y -= 14

  items.forEach((it, i) => {
    if (y < 140) {
      nextPage()
    }
    const desc = clean(it['description'] ?? '')
    const wrapped: string[] = []
    let cur = ''
    for (const word of desc.split(/\s+/)) {
      const test = cur ? `${cur} ${word}` : word
      if (font.widthOfTextAtSize(test, 9) > 285) {
        if (cur) wrapped.push(cur)
        cur = word
      } else cur = test
    }
    if (cur) wrapped.push(cur)
    if (!wrapped.length) wrapped.push('')

    text(String(i + 1), cols.sr, 9)
    text(wrapped[0]!, cols.desc, 9)
    text(String(it['hsn_code'] ?? ''), cols.hsn, 9)
    text(`${it['quantity'] ?? 0} ${it['uom'] ?? ''}`.trim(), cols.qty, 9, { align: 'right' })
    text(inr(it['unit_rate']), cols.rate, 9, { align: 'right' })
    text(inr(it['total_amount']), cols.amt, 9, { align: 'right' })
    y -= 12
    for (const extra of wrapped.slice(1)) {
      text(extra, cols.desc, 9)
      y -= 12
    }
    y -= 4
  })

  y -= 2
  line()
  y -= 14

  const totals: Array<[string, any]> = [
    ['Subtotal', invoice['subtotal']],
    ['Discount', invoice['discount_total']],
    ['CGST', invoice['cgst_amount']],
    ['SGST', invoice['sgst_amount']],
    ['IGST', invoice['igst_amount']],
    ['Freight', invoice['freight_charges']],
    ['Round Off', invoice['round_off']],
  ]
  for (const [label, val] of totals) {
    if (val === null || val === undefined || Number(val) === 0) continue
    text(label, cols.rate, 9, { align: 'right', color: grey })
    text(inr(val), cols.amt, 9, { align: 'right' })
    y -= 13
  }
  y -= 2
  text('Grand Total', cols.rate, 10, { align: 'right', bold: true })
  text(inr(invoice['grand_total']), cols.amt, 10, { align: 'right', bold: true })
  y -= 24

  if (company?.['bank_name']) {
    text('Bank Details', margin, 9, { bold: true, color: grey })
    y -= 12
    const bank = [
      company['bank_name'],
      company['bank_account'] ? `A/c: ${company['bank_account']}` : '',
      company['bank_ifsc'] ? `IFSC: ${company['bank_ifsc']}` : '',
      company['bank_branch'] ? `Branch: ${company['bank_branch']}` : '',
    ].filter(Boolean)
    for (const l of bank) {
      text(String(l), margin, 8)
      y -= 11
    }
  }

  if (company?.['declaration']) {
    y -= 8
    text(String(company['declaration']).slice(0, 300), margin, 7, { color: grey })
  }

  return await pdf.save()
}

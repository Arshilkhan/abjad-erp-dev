import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { formatDate } from '@/lib/format'
import { AEW_LOGO_BASE64 } from '@/assets/aew-logo-base64'

type Row = Record<string, any>

const clean = (v: any) => String(v ?? '').replace(/[^\x20-\x7E]/g, '')
const num = (v: any) => Number(v ?? 0)

/**
 * Delivery Challan PDF — a goods-movement document, not a payment request.
 * No bank details, payment terms, due date or amount payable anywhere.
 */
export async function buildChallanPdf(
  invoice: Row,
  items: Row[],
  company: Row | null,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique)

  const page = pdf.addPage([595.28, 841.89])
  const M = 28
  const W = 595.28 - M * 2
  const L = M
  const R = M + W
  const black = rgb(0, 0, 0)
  const grey = rgb(0.94, 0.94, 0.94)
  const blue = rgb(0.357, 0.608, 0.835)
  const white = rgb(1, 1, 1)
  const red = rgb(0.86, 0.15, 0.15)

  const c = company ?? {}
  let y = 841.89 - M

  const draw = (
    s: string,
    x: number,
    yy: number,
    size = 9.5,
    o: {
      bold?: boolean
      italic?: boolean
      color?: any
      align?: 'left' | 'right' | 'center'
      width?: number
      maxWidth?: number
      minSize?: number
    } = {},
  ) => {
    const f = o.bold ? bold : o.italic ? italic : font
    let str = clean(s)
    if (!str) return
    let fittedSize = size
    const maxWidth = o.maxWidth
    const minSize = o.minSize ?? 6.5
    if (maxWidth && maxWidth > 0) {
      while (fittedSize > minSize && f.widthOfTextAtSize(str, fittedSize) > maxWidth) fittedSize -= 0.5
      if (f.widthOfTextAtSize(str, fittedSize) > maxWidth) {
        while (str.length && f.widthOfTextAtSize(`${str}...`, fittedSize) > maxWidth) str = str.slice(0, -1)
        str = str ? `${str}...` : ''
      }
    }
    if (!str) return
    const textWidth = f.widthOfTextAtSize(str, fittedSize)
    let x0 = x
    if (o.align === 'right') x0 = x - textWidth
    if (o.align === 'center') x0 = x + ((o.width ?? 0) - textWidth) / 2
    page.drawText(str, { x: x0, y: yy, size: fittedSize, font: f, color: o.color ?? black })
  }

  const wrap = (s: string, maxW: number, size = 9.5, f = font) => {
    const out: string[] = []
    let cur = ''
    for (const word of clean(s).split(/\s+/)) {
      const t = cur ? `${cur} ${word}` : word
      if (f.widthOfTextAtSize(t, size) > maxW) {
        if (cur) out.push(cur)
        if (f.widthOfTextAtSize(word, size) <= maxW) cur = word
        else {
          let part = ''
          for (const char of word) {
            if (part && f.widthOfTextAtSize(`${part}${char}`, size) > maxW) {
              out.push(part)
              part = char
            } else part += char
          }
          cur = part
        }
      } else cur = t
    }
    if (cur) out.push(cur)
    return out.length ? out : ['']
  }

  const cell = (
    x: number,
    yTop: number,
    w: number,
    h: number,
    txt: string,
    o: { bold?: boolean; align?: 'left' | 'right' | 'center'; fill?: any; size?: number; color?: any } = {},
  ) => {
    page.drawRectangle({ x, y: yTop - h, width: w, height: h, borderColor: black, borderWidth: 0.6, color: o.fill })
    const size = o.size ?? 9.5
    const ty = yTop - h + (h - size) / 2 + 1
    const maxWidth = Math.max(0, w - 6)
    if (o.align === 'right') draw(txt, x + w - 3, ty, size, { bold: o.bold, align: 'right', color: o.color, maxWidth })
    else if (o.align === 'center')
      draw(txt, x, ty, size, { bold: o.bold, align: 'center', width: w, color: o.color, maxWidth })
    else draw(txt, x + 3, ty, size, { bold: o.bold, color: o.color, maxWidth })
  }

  // ---------- HEADER (consignor from company profile) ----------
  draw(c['name'] ?? 'ABJAD ENGINEERING WORKS', L, y - 14, 15, { bold: true, maxWidth: W - 140, minSize: 9 })
  y -= 18
  const addr = [c['address'], c['city'], c['state'] ? `(${c['state']})` : '', c['pincode']].filter(Boolean).join(', ')
  if (addr) {
    for (const l of wrap(`OFFICE & WORKS: ${addr}`, W - 130, 9)) {
      draw(l, L, y - 10, 9)
      y -= 10
    }
  }
  const phone = [c['mobile'], c['alt_mobile']].filter(Boolean).join(' / ')
  if (phone) {
    draw(`Mobile: ${phone}`, L, y - 10, 9, { maxWidth: W - 130 })
    y -= 10
  }
  if (c['email']) {
    draw(`Email: ${c['email']}`, L, y - 10, 9, { italic: true, color: rgb(0.1, 0.2, 0.7), maxWidth: W - 130 })
    y -= 10
  }
  if (c['gst_number']) {
    draw(`GSTIN: ${c['gst_number']}`, L, y - 10, 9, { bold: true, maxWidth: W - 130 })
    y -= 10
  }

  const logoH = 58
  try {
    if (AEW_LOGO_BASE64) {
      const bytes = Uint8Array.from(atob(AEW_LOGO_BASE64), (ch) => ch.charCodeAt(0))
      const img = await pdf.embedJpg(bytes)
      const w = (img.width / img.height) * logoH
      page.drawImage(img, { x: R - w, y: 841.89 - M - logoH, width: w, height: logoH })
    }
  } catch {
    // logo optional
  }
  y = Math.min(y, 841.89 - M - logoH - 4)

  // ---------- TITLE ----------
  y -= 4
  page.drawRectangle({ x: L, y: y - 22, width: W, height: 22, color: blue })
  draw('DELIVERY CHALLAN', L, y - 16, 15, { bold: true, align: 'center', width: W, color: white })
  y -= 26

  const rowH = 16
  const half = W / 2
  const lw = 0.36 * half
  const vw = half - lw

  // ---------- DOCUMENT DETAILS ----------
  const challanDates: string[] | null = invoice['challan_dates'] ?? null
  const dateTxt =
    challanDates && challanDates.length
      ? challanDates.map((d) => formatDate(d)).join(', ')
      : formatDate(invoice['challan_date'] ?? invoice['invoice_date'])

  cell(L, y, half, rowH, 'DOCUMENT DETAILS', { bold: true, align: 'center', fill: grey })
  cell(L + half, y, half, rowH, 'CONSIGNEE', { bold: true, align: 'center', fill: grey })
  y -= rowH

  const docRows: Array<[string, string]> = [
    ['Challan No.', String(invoice['challan_number'] ?? invoice['invoice_number'] ?? '-')],
    ['Reason for Movement', String(invoice['movement_reason'] ?? '-')],
  ]
  const consRows: Array<[string, string]> = [
    ['Name', String(invoice['customer_name_snapshot'] ?? '-')],
    ['GSTIN', String(invoice['customer_gst_snapshot'] ?? '-')],
  ]

  // Date row (may wrap across multiple challan dates)
  const dSize = 8.5
  const dLineH = dSize + 2
  const dLines = wrap(dateTxt, vw - 6, dSize)
  const dateH = Math.max(rowH, dLines.length * dLineH + 5)
  cell(L, y, lw, dateH, 'Date', { bold: true })
  page.drawRectangle({ x: L + lw, y: y - dateH, width: vw, height: dateH, borderColor: black, borderWidth: 0.6 })
  dLines.forEach((l, i) => draw(l, L + lw + 3, y - dLineH - i * dLineH, dSize))
  // right column address block spans the same height
  const addrLines = wrap(String(invoice['customer_address_snapshot'] ?? '-'), half - 6, 9).slice(0, 4)
  const consAddrH = Math.max(dateH, addrLines.length * 11 + 6)
  page.drawRectangle({ x: L + half, y: y - consAddrH, width: half, height: consAddrH, borderColor: black, borderWidth: 0.6 })
  addrLines.forEach((l, i) => draw(l, L + half + 3, y - 12 - i * 11, 9))
  const topH = Math.max(dateH, consAddrH)
  y -= topH

  docRows.forEach(([k, v], i) => {
    cell(L, y, lw, rowH, k, { bold: true })
    cell(L + lw, y, vw, rowH, v)
    const [ck, cv] = consRows[i]!
    cell(L + half, y, lw, rowH, ck, { bold: true })
    cell(L + half + lw, y, vw, rowH, cv)
    y -= rowH
  })

  // ---------- TRANSPORT ----------
  cell(L, y, W, rowH, 'TRANSPORT DETAILS', { bold: true, align: 'center', fill: grey })
  y -= rowH
  const tw = W / 3
  cell(L, y, tw, rowH, 'Transporter', { bold: true, size: 8.5 })
  cell(L + tw, y, tw, rowH, 'Place of Dispatch', { bold: true, size: 8.5 })
  cell(L + tw * 2, y, tw, rowH, 'Place of Delivery', { bold: true, size: 8.5 })
  y -= rowH
  cell(L, y, tw, rowH, String(invoice['transporter_name'] ?? '-'), { size: 8.5 })
  cell(L + tw, y, tw, rowH, String(invoice['place_of_dispatch'] ?? '-'), { size: 8.5 })
  cell(L + tw * 2, y, tw, rowH, String(invoice['place_of_delivery'] ?? '-'), { size: 8.5 })
  y -= rowH

  // ---------- ITEMS ----------
  const iw = [0.07, 0.24, 0.1, 0.27, 0.1, 0.08, 0.14].map((f) => f * W)
  const ix: number[] = []
  iw.reduce((acc, w, i) => {
    ix[i] = acc
    return acc + w
  }, L)
  const heads = ['Sr. No.', 'Item', 'HSN', 'Description', 'Quantity', 'UOM', 'Serial / Batch No.']
  heads.forEach((h, i) => cell(ix[i]!, y, iw[i]!, rowH + 4, h, { bold: true, align: 'center', fill: grey, size: 8 }))
  y -= rowH + 4

  items.forEach((it, i) => {
    const descLines = wrap(String(it['description'] ?? ''), iw[3]! - 6, 9)
    const itemLines = wrap(String(it['item_name'] ?? it['product_name'] ?? it['description'] ?? ''), iw[1]! - 6, 9).slice(0, 2)
    const h = Math.max(rowH, Math.max(descLines.length, itemLines.length) * 11 + 5)
    cell(ix[0]!, y, iw[0]!, h, String(it['sr_no'] ?? i + 1), { align: 'center' })
    page.drawRectangle({ x: ix[1]!, y: y - h, width: iw[1]!, height: h, borderColor: black, borderWidth: 0.6 })
    itemLines.forEach((l, li) => draw(l, ix[1]! + 3, y - 12 - li * 11, 9))
    cell(ix[2]!, y, iw[2]!, h, String(it['hsn_code'] ?? ''), { align: 'center', size: 8.5 })
    page.drawRectangle({ x: ix[3]!, y: y - h, width: iw[3]!, height: h, borderColor: black, borderWidth: 0.6 })
    descLines.forEach((l, li) => draw(l, ix[3]! + 3, y - 12 - li * 11, 9))
    const qty = num(it['quantity'])
    cell(ix[4]!, y, iw[4]!, h, String(qty), { align: 'right' })
    cell(ix[5]!, y, iw[5]!, h, String(it['uom'] ?? 'NOS'), { align: 'center' })
    cell(ix[6]!, y, iw[6]!, h, String(it['serial_batch_number'] ?? ''), { align: 'center', size: 8.5 })
    y -= h
  })
  for (let f = items.length; f < 8; f++) {
    iw.forEach((w, i) => cell(ix[i]!, y, w, rowH, ''))
    y -= rowH
  }

  // total quantity (informational only, no money)
  const totalQty = items.reduce((s, it) => s + num(it['quantity']), 0)
  cell(L, y, iw[0]! + iw[1]! + iw[2]! + iw[3]!, rowH, 'Total Quantity', { bold: true, align: 'right' })
  cell(ix[4]!, y, iw[4]!, rowH, String(totalQty), { bold: true, align: 'right' })
  cell(ix[5]!, y, iw[5]! + iw[6]!, rowH, '')
  y -= rowH

  if (invoice['notes']) {
    const noteLines = wrap(`Notes: ${String(invoice['notes'])}`, W - 6, 8.5)
    const nh = noteLines.length * 11 + 6
    page.drawRectangle({ x: L, y: y - nh, width: W, height: nh, borderColor: black, borderWidth: 0.6 })
    noteLines.forEach((l, i) => draw(l, L + 3, y - 12 - i * 11, 8.5))
    y -= nh
  }

  // ---------- RECEIVER ACKNOWLEDGEMENT ----------
  y -= 10
  const ackH = rowH * 4
  cell(L, y, W, rowH, 'RECEIVER ACKNOWLEDGEMENT', { bold: true, align: 'center', fill: grey })
  y -= rowH
  cell(L, y, W, rowH, 'Received the above goods in good condition.', { size: 9 })
  y -= rowH
  const aw = W / 2
  page.drawRectangle({ x: L, y: y - ackH, width: aw, height: ackH, borderColor: black, borderWidth: 0.6 })
  draw('Receiver Name', L + 5, y - 13, 9, { bold: true })
  draw('Signature', L + 5, y - 13 - rowH * 1.5, 9, { bold: true })
  draw('Date', L + 5, y - 13 - rowH * 3, 9, { bold: true })

  page.drawRectangle({ x: L + aw, y: y - ackH, width: aw, height: ackH, borderColor: black, borderWidth: 0.6 })
  draw("Receiver's Company Stamp", L + aw + 5, y - 13, 9, { bold: true })
  y -= ackH + 10

  // ---------- CONSIGNOR SIGN-OFF ----------
  const signW = W * 0.4
  const signH = rowH * 3
  page.drawRectangle({ x: R - signW, y: y - signH, width: signW, height: signH, borderColor: black, borderWidth: 0.6 })
  draw(`For ${c['name'] ?? 'ABJAD ENGINEERING WORKS'}`, R - signW + 5, y - 13, 9.5, {
    bold: true,
    color: red,
    maxWidth: signW - 10,
  })
  draw('Authorised Signatory', R - signW + 5, y - signH + 6, 9.5, { bold: true })
  draw('Not a tax invoice. This document accompanies goods in movement only.', L, y - 13, 8, { italic: true })

  return await pdf.save()
}

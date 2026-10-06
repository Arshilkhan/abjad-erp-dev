import { i as formatDate } from "./format-COxJqFG7.mjs";
import { n as StandardFonts, r as rgb, t as PDFDocument } from "../_libs/pdf-lib.mjs";
import { t as AEW_LOGO_BASE64 } from "./invoice-pdf-build.server-i7oElbv4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/challan-pdf-build.server-Cw5FGSsY.js
var clean = (v) => String(v ?? "").replace(/[^\x20-\x7E]/g, "");
var num = (v) => Number(v ?? 0);
/**
* Delivery Challan PDF — a goods-movement document, not a payment request.
* No bank details, payment terms, due date or amount payable anywhere.
*/
async function buildChallanPdf(invoice, items, company) {
	const pdf = await PDFDocument.create();
	const font = await pdf.embedFont(StandardFonts.Helvetica);
	const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
	const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
	const page = pdf.addPage([595.28, 841.89]);
	const M = 28;
	const W = 539.28;
	const L = M;
	const R = 567.28;
	const black = rgb(0, 0, 0);
	const grey = rgb(.94, .94, .94);
	const blue = rgb(.357, .608, .835);
	const white = rgb(1, 1, 1);
	const red = rgb(.86, .15, .15);
	const c = company ?? {};
	let y = 813.89;
	const draw = (s, x, yy, size = 9.5, o = {}) => {
		const f = o.bold ? bold : o.italic ? italic : font;
		let str = clean(s);
		if (!str) return;
		let fittedSize = size;
		const maxWidth = o.maxWidth;
		const minSize = o.minSize ?? 6.5;
		if (maxWidth && maxWidth > 0) {
			while (fittedSize > minSize && f.widthOfTextAtSize(str, fittedSize) > maxWidth) fittedSize -= .5;
			if (f.widthOfTextAtSize(str, fittedSize) > maxWidth) {
				while (str.length && f.widthOfTextAtSize(`${str}...`, fittedSize) > maxWidth) str = str.slice(0, -1);
				str = str ? `${str}...` : "";
			}
		}
		if (!str) return;
		const textWidth = f.widthOfTextAtSize(str, fittedSize);
		let x0 = x;
		if (o.align === "right") x0 = x - textWidth;
		if (o.align === "center") x0 = x + ((o.width ?? 0) - textWidth) / 2;
		page.drawText(str, {
			x: x0,
			y: yy,
			size: fittedSize,
			font: f,
			color: o.color ?? black
		});
	};
	const wrap = (s, maxW, size = 9.5, f = font) => {
		const out = [];
		let cur = "";
		for (const word of clean(s).split(/\s+/)) {
			const t = cur ? `${cur} ${word}` : word;
			if (f.widthOfTextAtSize(t, size) > maxW) {
				if (cur) out.push(cur);
				if (f.widthOfTextAtSize(word, size) <= maxW) cur = word;
				else {
					let part = "";
					for (const char of word) if (part && f.widthOfTextAtSize(`${part}${char}`, size) > maxW) {
						out.push(part);
						part = char;
					} else part += char;
					cur = part;
				}
			} else cur = t;
		}
		if (cur) out.push(cur);
		return out.length ? out : [""];
	};
	const cell = (x, yTop, w, h, txt, o = {}) => {
		page.drawRectangle({
			x,
			y: yTop - h,
			width: w,
			height: h,
			borderColor: black,
			borderWidth: .6,
			color: o.fill
		});
		const size = o.size ?? 9.5;
		const ty = yTop - h + (h - size) / 2 + 1;
		const maxWidth = Math.max(0, w - 6);
		if (o.align === "right") draw(txt, x + w - 3, ty, size, {
			bold: o.bold,
			align: "right",
			color: o.color,
			maxWidth
		});
		else if (o.align === "center") draw(txt, x, ty, size, {
			bold: o.bold,
			align: "center",
			width: w,
			color: o.color,
			maxWidth
		});
		else draw(txt, x + 3, ty, size, {
			bold: o.bold,
			color: o.color,
			maxWidth
		});
	};
	draw(c["name"] ?? "ABJAD ENGINEERING WORKS", L, y - 14, 15, {
		bold: true,
		maxWidth: 399.28,
		minSize: 9
	});
	y -= 18;
	const addr = [
		c["address"],
		c["city"],
		c["state"] ? `(${c["state"]})` : "",
		c["pincode"]
	].filter(Boolean).join(", ");
	if (addr) for (const l of wrap(`OFFICE & WORKS: ${addr}`, 409.28, 9)) {
		draw(l, L, y - 10, 9);
		y -= 10;
	}
	const phone = [c["mobile"], c["alt_mobile"]].filter(Boolean).join(" / ");
	if (phone) {
		draw(`Mobile: ${phone}`, L, y - 10, 9, { maxWidth: 409.28 });
		y -= 10;
	}
	if (c["email"]) {
		draw(`Email: ${c["email"]}`, L, y - 10, 9, {
			italic: true,
			color: rgb(.1, .2, .7),
			maxWidth: 409.28
		});
		y -= 10;
	}
	if (c["gst_number"]) {
		draw(`GSTIN: ${c["gst_number"]}`, L, y - 10, 9, {
			bold: true,
			maxWidth: 409.28
		});
		y -= 10;
	}
	const logoH = 58;
	try {
		{
			const bytes = Uint8Array.from(atob(AEW_LOGO_BASE64), (ch) => ch.charCodeAt(0));
			const img = await pdf.embedJpg(bytes);
			const w = img.width / img.height * logoH;
			page.drawImage(img, {
				x: R - w,
				y: 755.89,
				width: w,
				height: logoH
			});
		}
	} catch {}
	y = Math.min(y, 751.89);
	y -= 4;
	page.drawRectangle({
		x: L,
		y: y - 22,
		width: W,
		height: 22,
		color: blue
	});
	draw("DELIVERY CHALLAN", L, y - 16, 15, {
		bold: true,
		align: "center",
		width: W,
		color: white
	});
	y -= 26;
	const rowH = 16;
	const half = W / 2;
	const lw = .36 * half;
	const vw = 172.56959999999998;
	const challanDates = invoice["challan_dates"] ?? null;
	const dateTxt = challanDates && challanDates.length ? challanDates.map((d) => formatDate(d)).join(", ") : formatDate(invoice["challan_date"] ?? invoice["invoice_date"]);
	cell(L, y, half, rowH, "DOCUMENT DETAILS", {
		bold: true,
		align: "center",
		fill: grey
	});
	cell(297.64, y, half, rowH, "CONSIGNEE", {
		bold: true,
		align: "center",
		fill: grey
	});
	y -= rowH;
	const docRows = [["Challan No.", String(invoice["challan_number"] ?? invoice["invoice_number"] ?? "-")], ["Reason for Movement", String(invoice["movement_reason"] ?? "-")]];
	const consRows = [["Name", String(invoice["customer_name_snapshot"] ?? "-")], ["GSTIN", String(invoice["customer_gst_snapshot"] ?? "-")]];
	const dSize = 8.5;
	const dLineH = 10.5;
	const dLines = wrap(dateTxt, 166.56959999999998, dSize);
	const dateH = Math.max(rowH, dLines.length * dLineH + 5);
	cell(L, y, lw, dateH, "Date", { bold: true });
	page.drawRectangle({
		x: 125.07039999999999,
		y: y - dateH,
		width: vw,
		height: dateH,
		borderColor: black,
		borderWidth: .6
	});
	dLines.forEach((l, i) => draw(l, 128.0704, y - dLineH - i * dLineH, dSize));
	const addrLines = wrap(String(invoice["customer_address_snapshot"] ?? "-"), 263.64, 9).slice(0, 4);
	const consAddrH = Math.max(dateH, addrLines.length * 11 + 6);
	page.drawRectangle({
		x: 297.64,
		y: y - consAddrH,
		width: half,
		height: consAddrH,
		borderColor: black,
		borderWidth: .6
	});
	addrLines.forEach((l, i) => draw(l, 300.64, y - 12 - i * 11, 9));
	y -= Math.max(dateH, consAddrH);
	docRows.forEach(([k, v], i) => {
		cell(L, y, lw, rowH, k, { bold: true });
		cell(125.07039999999999, y, vw, rowH, v);
		const [ck, cv] = consRows[i];
		cell(297.64, y, lw, rowH, ck, { bold: true });
		cell(394.7104, y, vw, rowH, cv);
		y -= rowH;
	});
	cell(L, y, W, rowH, "TRANSPORT DETAILS", {
		bold: true,
		align: "center",
		fill: grey
	});
	y -= rowH;
	const tw = W / 3;
	cell(L, y, tw, rowH, "Transporter", {
		bold: true,
		size: 8.5
	});
	cell(207.76, y, tw, rowH, "Place of Dispatch", {
		bold: true,
		size: 8.5
	});
	cell(387.52, y, tw, rowH, "Place of Delivery", {
		bold: true,
		size: 8.5
	});
	y -= rowH;
	cell(L, y, tw, rowH, String(invoice["transporter_name"] ?? "-"), { size: 8.5 });
	cell(207.76, y, tw, rowH, String(invoice["place_of_dispatch"] ?? "-"), { size: 8.5 });
	cell(387.52, y, tw, rowH, String(invoice["place_of_delivery"] ?? "-"), { size: 8.5 });
	y -= rowH;
	const iw = [
		.07,
		.24,
		.1,
		.27,
		.1,
		.08,
		.14
	].map((f) => f * W);
	const ix = [];
	iw.reduce((acc, w, i) => {
		ix[i] = acc;
		return acc + w;
	}, L);
	[
		"Sr. No.",
		"Item",
		"HSN",
		"Description",
		"Quantity",
		"UOM",
		"Serial / Batch No."
	].forEach((h, i) => cell(ix[i], y, iw[i], 20, h, {
		bold: true,
		align: "center",
		fill: grey,
		size: 8
	}));
	y -= 20;
	items.forEach((it, i) => {
		const descLines = wrap(String(it["description"] ?? ""), iw[3] - 6, 9);
		const itemLines = wrap(String(it["item_name"] ?? it["product_name"] ?? it["description"] ?? ""), iw[1] - 6, 9).slice(0, 2);
		const h = Math.max(rowH, Math.max(descLines.length, itemLines.length) * 11 + 5);
		cell(ix[0], y, iw[0], h, String(it["sr_no"] ?? i + 1), { align: "center" });
		page.drawRectangle({
			x: ix[1],
			y: y - h,
			width: iw[1],
			height: h,
			borderColor: black,
			borderWidth: .6
		});
		itemLines.forEach((l, li) => draw(l, ix[1] + 3, y - 12 - li * 11, 9));
		cell(ix[2], y, iw[2], h, String(it["hsn_code"] ?? ""), {
			align: "center",
			size: 8.5
		});
		page.drawRectangle({
			x: ix[3],
			y: y - h,
			width: iw[3],
			height: h,
			borderColor: black,
			borderWidth: .6
		});
		descLines.forEach((l, li) => draw(l, ix[3] + 3, y - 12 - li * 11, 9));
		const qty = num(it["quantity"]);
		cell(ix[4], y, iw[4], h, String(qty), { align: "right" });
		cell(ix[5], y, iw[5], h, String(it["uom"] ?? "NOS"), { align: "center" });
		cell(ix[6], y, iw[6], h, String(it["serial_batch_number"] ?? ""), {
			align: "center",
			size: 8.5
		});
		y -= h;
	});
	for (let f = items.length; f < 8; f++) {
		iw.forEach((w, i) => cell(ix[i], y, w, rowH, ""));
		y -= rowH;
	}
	const totalQty = items.reduce((s, it) => s + num(it["quantity"]), 0);
	cell(L, y, iw[0] + iw[1] + iw[2] + iw[3], rowH, "Total Quantity", {
		bold: true,
		align: "right"
	});
	cell(ix[4], y, iw[4], rowH, String(totalQty), {
		bold: true,
		align: "right"
	});
	cell(ix[5], y, iw[5] + iw[6], rowH, "");
	y -= rowH;
	if (invoice["notes"]) {
		const noteLines = wrap(`Notes: ${String(invoice["notes"])}`, 533.28, 8.5);
		const nh = noteLines.length * 11 + 6;
		page.drawRectangle({
			x: L,
			y: y - nh,
			width: W,
			height: nh,
			borderColor: black,
			borderWidth: .6
		});
		noteLines.forEach((l, i) => draw(l, 31, y - 12 - i * 11, 8.5));
		y -= nh;
	}
	y -= 10;
	const ackH = 64;
	cell(L, y, W, rowH, "RECEIVER ACKNOWLEDGEMENT", {
		bold: true,
		align: "center",
		fill: grey
	});
	y -= rowH;
	cell(L, y, W, rowH, "Received the above goods in good condition.", { size: 9 });
	y -= rowH;
	const aw = W / 2;
	page.drawRectangle({
		x: L,
		y: y - ackH,
		width: aw,
		height: ackH,
		borderColor: black,
		borderWidth: .6
	});
	draw("Receiver Name", 33, y - 13, 9, { bold: true });
	draw("Signature", 33, y - 13 - rowH * 1.5, 9, { bold: true });
	draw("Date", 33, y - 13 - 48, 9, { bold: true });
	page.drawRectangle({
		x: 297.64,
		y: y - ackH,
		width: aw,
		height: ackH,
		borderColor: black,
		borderWidth: .6
	});
	draw("Receiver's Company Stamp", 302.64, y - 13, 9, { bold: true });
	y -= 74;
	const signW = W * .4;
	const signH = 48;
	page.drawRectangle({
		x: 351.568,
		y: y - signH,
		width: signW,
		height: signH,
		borderColor: black,
		borderWidth: .6
	});
	draw(`For ${c["name"] ?? "ABJAD ENGINEERING WORKS"}`, 356.568, y - 13, 9.5, {
		bold: true,
		color: red,
		maxWidth: 205.712
	});
	draw("Authorised Signatory", 356.568, y - signH + 6, 9.5, { bold: true });
	draw("Not a tax invoice. This document accompanies goods in movement only.", L, y - 13, 8, { italic: true });
	return await pdf.save();
}
//#endregion
export { buildChallanPdf };

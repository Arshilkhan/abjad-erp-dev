import { i as formatDate, n as billNo, t as amountInWords } from "./format-COxJqFG7.mjs";
import { n as StandardFonts, r as rgb, t as PDFDocument } from "../_libs/pdf-lib.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoice-pdf-build.server-i7oElbv4.js
var AEW_LOGO_BASE64 = "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";
var clean = (v) => String(v ?? "").replace(/[^\x20-\x7E]/g, "");
var num = (v) => Number(v ?? 0);
var money = (n) => num(n).toFixed(2);
var TYPE_LABELS = {
	tax_invoice: "TAX INVOICE",
	proforma: "PROFORMA INVOICE",
	quotation: "QUOTATION",
	challan: "DELIVERY CHALLAN",
	delivery_challan: "DELIVERY CHALLAN",
	purchase_order: "PURCHASE ORDER"
};
/**
* Builds the A4 invoice PDF using the same layout as the on-screen
* printable invoice: bordered tables, blue title banner, buyer/company
* detail grid, item table, bank + totals block, words, footer, declaration.
*/
async function buildInvoicePdf(invoice, items, company) {
	if (String(invoice["invoice_type"]) === "delivery_challan" || String(invoice["invoice_type"]) === "challan") {
		const { buildChallanPdf } = await import("./challan-pdf-build.server-Cw5FGSsY.mjs");
		return await buildChallanPdf(invoice, items, company);
	}
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
				const suffix = "...";
				while (str.length && f.widthOfTextAtSize(`${str}${suffix}`, fittedSize) > maxWidth) str = str.slice(0, -1);
				str = str ? `${str}${suffix}` : "";
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
	const headLines = wrap(`OFFICE & WORKS: ${[
		c["address"],
		c["city"],
		c["state"] ? `(${c["state"]})` : "",
		c["pincode"]
	].filter(Boolean).join(", ") || "UNIT NO. 008, G-WING, UDYOG BHAVAN -2, PLOT NO. K-3, MIDC ANAND NAGER AMBERNATH (E) PIN 421 506"}`, 409.28, 9);
	for (const l of headLines) {
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
	if (c["website"]) {
		draw(`Website: ${c["website"]}`, L, y - 10, 9, {
			italic: true,
			color: rgb(.1, .2, .7),
			maxWidth: 409.28
		});
		y -= 10;
	}
	const logoH = 58;
	try {
		const b64 = AEW_LOGO_BASE64;
		if (b64) {
			const bytes = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
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
	draw(TYPE_LABELS[String(invoice["invoice_type"])] ?? "TAX INVOICE", L, y - 16, 15, {
		bold: true,
		align: "center",
		width: W,
		color: white
	});
	y -= 26;
	const cw = [
		.15,
		.38,
		.14,
		.13,
		.07,
		.13
	].map((f) => f * W);
	const cx = [];
	cw.reduce((acc, w, i) => {
		cx[i] = acc;
		return acc + w;
	}, L);
	const rowH = 16;
	cell(cx[0], y, cw[0], rowH, "CUSTOMER NAME", { bold: true });
	cell(cx[1], y, cw[1], rowH, invoice["customer_name_snapshot"] ?? "-");
	cell(cx[2], y, cw[2], rowH, "Bill No.", { bold: true });
	cell(cx[3], y, cw[3], rowH, billNo(invoice["invoice_number"]));
	cell(cx[4], y, cw[4], rowH, "Date", { bold: true });
	cell(cx[5], y, cw[5], rowH, formatDate(invoice["invoice_date"]), { size: 8.5 });
	y -= rowH;
	const addrH = 48;
	cell(cx[0], y, cw[0], addrH, "", { bold: true });
	draw("Address", cx[0] + 3, y - 12, 9.5, { bold: true });
	const addrLines = wrap(invoice["customer_address_snapshot"] ?? "-", cw[1] - 6, 9.5).slice(0, 3);
	page.drawRectangle({
		x: cx[1],
		y: y - addrH,
		width: cw[1],
		height: addrH,
		borderColor: black,
		borderWidth: .6
	});
	addrLines.forEach((l, i) => draw(l, cx[1] + 3, y - 13 - i * 12, 9.5));
	const rightX = cx[2];
	const rightW = cw[2] + cw[3] + cw[4] + cw[5];
	cell(rightX, y, rightW, addrH, "");
	y -= addrH;
	const half = W / 2;
	const lw = .3 * half;
	const vw = 188.748;
	cell(L, y, half, rowH, "BUYER DETAILS", {
		bold: true,
		align: "center",
		fill: grey
	});
	cell(297.64, y, half, rowH, "COMPANY DETAILS", {
		bold: true,
		align: "center",
		fill: grey
	});
	y -= rowH;
	cell(L, y, lw, rowH, "GSTIN NO.", { bold: true });
	cell(108.892, y, vw, rowH, invoice["customer_gst_snapshot"] ?? "");
	cell(297.64, y, lw, rowH, "GSTIN NO.", { bold: true });
	cell(378.532, y, vw, rowH, c["gst_number"] ?? "");
	y -= rowH;
	cell(L, y, lw, rowH, "W/O No.", { bold: true });
	cell(108.892, y, vw, rowH, invoice["work_order_number"] ?? "");
	cell(297.64, y, lw, rowH, "PAN NO.", { bold: true });
	cell(378.532, y, vw, rowH, c["pan_number"] ?? "");
	y -= rowH;
	const iw = [
		.06,
		.1,
		.42,
		.09,
		.08,
		.12,
		.13
	].map((f) => f * W);
	const ix = [];
	iw.reduce((acc, w, i) => {
		ix[i] = acc;
		return acc + w;
	}, L);
	[
		"Sr. No.",
		"HSN /SAC",
		"Item Description",
		"Qty. (Nos)",
		"UOM",
		"Unit Rate(Rs)",
		"Total Amt.(Rs)"
	].forEach((h, i) => cell(ix[i], y, iw[i], 20, h, {
		bold: true,
		align: "center",
		fill: grey,
		size: 8
	}));
	y -= 20;
	const lineTotals = [];
	let netValue = 0;
	let itemDiscounts = 0;
	let taxTotal = 0;
	items.forEach((it) => {
		const gross = (num(it["quantity"]) - num(it["rejected_quantity"])) * num(it["unit_rate"]);
		const disc = gross * num(it["discount_pct"]) / 100;
		const net = gross - disc;
		const tax = net * num(it["tax_pct"]) / 100;
		lineTotals.push(net + tax);
		netValue += net;
		itemDiscounts += disc;
		taxTotal += tax;
	});
	items.forEach((it, i) => {
		const rejected = num(it["rejected_quantity"]);
		const billedQty = num(it["quantity"]) - rejected;
		let desc = String(it["description"] ?? "");
		if (rejected > 0) desc += ` (Delivered ${num(it["quantity"])}, rejected ${rejected})`;
		const lines = wrap(desc, iw[2] - 6, 9.5);
		const h = Math.max(rowH, lines.length * 11 + 5);
		cell(ix[0], y, iw[0], h, String(it["sr_no"] ?? i + 1), { align: "center" });
		cell(ix[1], y, iw[1], h, it["hsn_code"] ?? "", { align: "center" });
		page.drawRectangle({
			x: ix[2],
			y: y - h,
			width: iw[2],
			height: h,
			borderColor: black,
			borderWidth: .6
		});
		lines.forEach((l, li) => draw(l, ix[2] + 3, y - 12 - li * 11, 9.5));
		cell(ix[3], y, iw[3], h, billedQty.toFixed(0).padStart(2, "0"), { align: "right" });
		cell(ix[4], y, iw[4], h, it["uom"] ?? "NOS", { align: "center" });
		cell(ix[5], y, iw[5], h, money(it["unit_rate"]), { align: "right" });
		cell(ix[6], y, iw[6], h, money(lineTotals[i] ?? num(it["total_amount"])), { align: "right" });
		y -= h;
	});
	for (let f = items.length; f < 8; f++) {
		iw.forEach((w, i) => cell(ix[i], y, w, rowH, ""));
		y -= rowH;
	}
	const charges = num(invoice["freight"]) + num(invoice["packing_charges"]) + num(invoice["other_charges"]);
	const subtotal = netValue + charges;
	const preRound = subtotal + taxTotal;
	const grandTotal = Math.round(preRound);
	const isIgst = Boolean(invoice["is_igst"]);
	const sgst = isIgst ? 0 : taxTotal / 2;
	const cgst = isIgst ? 0 : taxTotal / 2;
	const igst = isIgst ? taxTotal : 0;
	const taxPct = items[0]?.["tax_pct"] ? Number(items[0]["tax_pct"]) : 0;
	const bankW = W * .55;
	const tLabelW = 242.676 * .6;
	const tRateW = 242.676 * .15;
	const tValW = 60.66900000000001;
	const totalRows = [
		[
			"Net Value (Rs.)",
			"",
			money(netValue),
			true
		],
		[
			"Discount",
			"",
			money(itemDiscounts)
		],
		[
			"Freight",
			"",
			money(invoice["freight"])
		],
		[
			"P & F Charges",
			"",
			money(invoice["packing_charges"])
		],
		[
			"Sub Total",
			"",
			money(subtotal)
		],
		[
			"SGST",
			isIgst ? "----" : taxPct ? `${taxPct / 2}%` : "",
			money(sgst)
		],
		[
			"CGST",
			isIgst ? "----" : taxPct ? `${taxPct / 2}%` : "",
			money(cgst)
		],
		[
			"IGST",
			isIgst ? taxPct ? `${taxPct}%` : "" : "----",
			money(igst)
		],
		[
			"Sub Total",
			"",
			money(subtotal + taxTotal)
		],
		[
			"Round Off",
			"",
			money(grandTotal - preRound)
		],
		[
			"Grand Total (Rs)",
			"",
			money(grandTotal),
			true
		]
	];
	const blockH = totalRows.length * rowH;
	const bankTop = y;
	page.drawRectangle({
		x: L,
		y: y - blockH,
		width: bankW,
		height: blockH,
		borderColor: black,
		borderWidth: .6
	});
	[
		["BANK NAME", c["bank_name"]],
		["A/C NO.", c["bank_account"]],
		["BRANCH IFSC", c["bank_ifsc"]],
		["BRANCH NAME", c["bank_branch"]]
	].forEach(([k, v], i) => {
		draw(k, 33, bankTop - 15 - i * 14, 9.5, {
			bold: true,
			maxWidth: 80
		});
		draw(String(v ?? ""), 118, bankTop - 15 - i * 14, 9.5, { maxWidth: 201.60399999999998 });
	});
	const tx = 324.604;
	totalRows.forEach(([label, rate, val, strong]) => {
		cell(tx, y, tLabelW, rowH, label, {
			bold: !!strong,
			fill: strong && label.startsWith("Grand") ? grey : void 0
		});
		cell(470.20959999999997, y, tRateW, rowH, rate, { align: "center" });
		cell(506.611, y, tValW, rowH, val, {
			align: "right",
			bold: !!strong
		});
		y -= rowH;
	});
	cell(L, y, W, rowH, `In Words. ${amountInWords(grandTotal)}`, { size: 8.5 });
	y -= rowH;
	const footL = W * .6;
	const footH = 48;
	cell(L, y, footL, rowH, "Delivery : By Road", { bold: false });
	cell(L, y - rowH, footL, rowH, "Payment : 100% against Performa Invoice");
	cell(L, y - 32, footL, rowH, `Contact Person  ${c["contact_person"] ?? "-"}   Mob. No.  ${[c["mobile"], c["alt_mobile"]].filter(Boolean).join(" / ")}`, { size: 8.5 });
	page.drawRectangle({
		x: 351.568,
		y: y - footH,
		width: 215.712,
		height: footH,
		borderColor: black,
		borderWidth: .6
	});
	draw(`For ${c["name"] ?? "ABJAD ENGINEERING WORKS"}`, 356.568, y - 13, 9.5, {
		bold: true,
		color: red,
		maxWidth: 205.712
	});
	draw("Authorised Signatory", 356.568, y - footH + 6, 9.5, { bold: true });
	y -= 58;
	draw("DECLARATION.", L, y, 8, { bold: true });
	y -= 9;
	wrap(c["declaration"] ?? "WE DECLARE THAT THIS INVOICE SHOWS THE ACTUAL PRICE OF THE GOODS DESCRIBED THAT ALL PARTICULARS ARE TRUE AND CORRECT", W, 8).forEach((l) => {
		draw(l, L, y, 8);
		y -= 9;
	});
	return await pdf.save();
}
//#endregion
export { buildInvoicePdf, AEW_LOGO_BASE64 as t };

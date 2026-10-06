import { i as formatDate, t as amountInWords } from "./format-COxJqFG7.mjs";
import { n as StandardFonts, r as rgb, t as PDFDocument } from "../_libs/pdf-lib.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/po-pdf-build.server-Dgxt-gSv.js
var clean = (v) => String(v ?? "").replace(/[^\x20-\x7E]/g, "");
var num = (v) => Number(v ?? 0);
var money = (n) => num(n).toFixed(2);
/**
* Builds an A4 Purchase Order PDF matching the printable PO layout
* (header, party grid, item table, totals, amount in words, signature).
*/
async function buildPoPdf(po, items, company, vendor) {
	const pdf = await PDFDocument.create();
	const font = await pdf.embedFont(StandardFonts.Helvetica);
	const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
	const page = pdf.addPage([595.28, 841.89]);
	const M = 28;
	const W = 539.28;
	const L = M;
	const black = rgb(0, 0, 0);
	const grey = rgb(.94, .94, .94);
	let y = 813.89;
	const draw = (s, x, yy, size = 8, o = {}) => {
		const f = o.bold ? bold : font;
		let str = clean(s);
		if (!str) return;
		let fs = size;
		if (o.maxWidth && o.maxWidth > 0) {
			while (fs > 5 && f.widthOfTextAtSize(str, fs) > o.maxWidth) fs -= .5;
			if (f.widthOfTextAtSize(str, fs) > o.maxWidth) {
				while (str.length && f.widthOfTextAtSize(`${str}...`, fs) > o.maxWidth) str = str.slice(0, -1);
				str = str ? `${str}...` : "";
			}
		}
		if (!str) return;
		const tw = f.widthOfTextAtSize(str, fs);
		let x0 = x;
		if (o.align === "right") x0 = x - tw;
		if (o.align === "center") x0 = x + ((o.width ?? 0) - tw) / 2;
		page.drawText(str, {
			x: x0,
			y: yy,
			size: fs,
			font: f,
			color: o.color ?? black
		});
	};
	const wrap = (s, maxW, size = 8, f = font) => {
		const out = [];
		let cur = "";
		for (const word of clean(s).split(/\s+/)) {
			const t = cur ? `${cur} ${word}` : word;
			if (f.widthOfTextAtSize(t, size) > maxW) {
				if (cur) out.push(cur);
				cur = word;
			} else cur = t;
		}
		if (cur) out.push(cur);
		return out.length ? out : [""];
	};
	const box = (x, yTop, w, h, fill) => page.drawRectangle({
		x,
		y: yTop - h,
		width: w,
		height: h,
		borderColor: black,
		borderWidth: .6,
		color: fill
	});
	const cell = (x, yTop, w, h, txt, o = {}) => {
		box(x, yTop, w, h, o.fill);
		const size = o.size ?? 8;
		const ty = yTop - h + (h - size) / 2 + 1;
		const maxWidth = Math.max(0, w - 6);
		if (o.align === "right") draw(txt, x + w - 3, ty, size, {
			bold: o.bold,
			align: "right",
			maxWidth
		});
		else if (o.align === "center") draw(txt, x, ty, size, {
			bold: o.bold,
			align: "center",
			width: w,
			maxWidth
		});
		else draw(txt, x + 3, ty, size, {
			bold: o.bold,
			maxWidth
		});
	};
	const labelled = (x, yTop, w, h, label, lines) => {
		box(x, yTop, w, h);
		draw(label, x + 3, yTop - 10, 7, {
			bold: true,
			maxWidth: w - 6
		});
		lines.slice(0, Math.floor((h - 14) / 10)).forEach((l, i) => draw(l, x + 3, yTop - 21 - i * 10, 8, { maxWidth: w - 6 }));
	};
	const c = company ?? {};
	const v = vendor ?? {};
	draw("PURCHASE ORDER", L, y - 14, 15, {
		bold: true,
		align: "center",
		width: W
	});
	y -= 22;
	const leftW = W * .45;
	const midW = W * .27;
	const rightW = 150.99839999999998;
	const rowH = 26;
	const blockH = 78;
	const supplierLines = [
		clean(po["vendor_name_snapshot"] ?? v["vendor_name"] ?? "-"),
		...wrap(String(po["vendor_address_snapshot"] ?? v["address"] ?? ""), 234.676, 8),
		v["email"] ? `E-Mail : ${v["email"]}` : "",
		v["mobile"] ? `Mobile : ${v["mobile"]}` : ""
	].filter(Boolean);
	labelled(L, y, leftW, blockH, "Invoice To / Dispatch To", supplierLines);
	cell(270.676, y, midW, rowH, "", {});
	draw("Voucher No.", 273.676, y - 10, 7, { bold: true });
	draw(String(po["po_number"] ?? ""), 273.676, y - 21, 8, { maxWidth: 139.6056 });
	cell(416.2816, y, rightW, rowH, "", {});
	draw("Dated", 419.2816, y - 10, 7, { bold: true });
	draw(formatDate(po["po_date"]), 419.2816, y - 21, 8, { maxWidth: 144.99839999999998 });
	cell(270.676, y - rowH, midW, rowH, "", {});
	draw("Terms of Payment", 273.676, y - rowH - 10, 7, { bold: true });
	draw(String(v["payment_terms"] ?? "-"), 273.676, y - rowH - 21, 8, { maxWidth: 139.6056 });
	cell(416.2816, y - rowH, rightW, rowH, "", {});
	draw("Expected Delivery", 419.2816, y - rowH - 10, 7, { bold: true });
	draw(po["expected_date"] ? formatDate(po["expected_date"]) : "-", 419.2816, y - rowH - 21, 8, { maxWidth: 144.99839999999998 });
	cell(270.676, y - 52, midW, rowH, "", {});
	draw("Supplier's GSTIN", 273.676, y - 52 - 10, 7, { bold: true });
	draw(String(po["vendor_gst_snapshot"] ?? v["gst_number"] ?? "-"), 273.676, y - 52 - 21, 8, { maxWidth: 139.6056 });
	cell(416.2816, y - 52, rightW, rowH, "", {});
	draw("Company's GSTIN", 419.2816, y - 52 - 10, 7, { bold: true });
	draw(String(c["gst_number"] ?? "-"), 419.2816, y - 52 - 21, 8, { maxWidth: 144.99839999999998 });
	y -= blockH;
	const companyLines = [
		clean(c["name"] ?? "Company"),
		...wrap(String(c["address"] ?? ""), 234.676, 8),
		[
			c["city"],
			c["state"],
			c["pincode"]
		].filter(Boolean).join(", "),
		c["email"] ? `E-Mail : ${c["email"]}` : ""
	].filter(Boolean);
	labelled(L, y, leftW, blockH, "Ordered By", companyLines);
	cell(270.676, y, midW, rowH, "", {});
	draw("Status", 273.676, y - 10, 7, { bold: true });
	draw(String(po["status"] ?? "").toUpperCase(), 273.676, y - 21, 8, { maxWidth: 139.6056 });
	cell(416.2816, y, rightW, rowH, "", {});
	draw("Tax Type", 419.2816, y - 10, 7, { bold: true });
	draw(po["is_igst"] ? "IGST" : "CGST + SGST", 419.2816, y - 21, 8, { maxWidth: 144.99839999999998 });
	labelled(270.676, y - rowH, 296.604, 52, "Other Reference(s)", wrap(String(po["notes"] ?? "-"), 288.604, 8));
	y -= blockH;
	const iw = [
		.06,
		.42,
		.12,
		.1,
		.1,
		.08,
		.12
	].map((f) => f * W);
	const ix = [];
	iw.reduce((acc, w, i) => {
		ix[i] = acc;
		return acc + w;
	}, L);
	[
		"Sl No.",
		"Description of Goods",
		"Due on",
		"Quantity",
		"Rate",
		"Tax %",
		"Amount"
	].forEach((h, i) => cell(ix[i], y, iw[i], 18, h, {
		bold: true,
		align: "center",
		fill: grey,
		size: 7
	}));
	y -= 18;
	items.forEach((it, idx) => {
		const desc = String(it["description"] ?? "");
		const lines = wrap(desc, iw[1] - 6, 8);
		if (it["hsn_code"]) lines.push(`HSN: ${it["hsn_code"]}`);
		const h = Math.max(16, lines.length * 10 + 5);
		cell(ix[0], y, iw[0], h, String(idx + 1), { align: "center" });
		box(ix[1], y, iw[1], h);
		lines.forEach((l, li) => draw(l, ix[1] + 3, y - 11 - li * 10, 8));
		cell(ix[2], y, iw[2], h, formatDate(po["expected_date"] ?? po["po_date"]), {
			align: "center",
			size: 7
		});
		cell(ix[3], y, iw[3], h, `${num(it["quantity"])} ${clean(it["uom"] ?? "nos")}`, { align: "right" });
		cell(ix[4], y, iw[4], h, money(it["unit_rate"]), { align: "right" });
		cell(ix[5], y, iw[5], h, `${num(it["tax_pct"])}%`, { align: "right" });
		cell(ix[6], y, iw[6], h, money(num(it["quantity"]) * num(it["unit_rate"])), { align: "right" });
		y -= h;
	});
	for (let f = items.length; f < 6; f++) {
		iw.forEach((w, i) => cell(ix[i], y, w, 16, ""));
		y -= 16;
	}
	const taxTotal = num(po["igst_amount"]) + num(po["cgst_amount"]) + num(po["sgst_amount"]);
	const qtyTotal = items.reduce((a, i) => a + num(i["quantity"]), 0);
	const labelW = iw[0] + iw[1] + iw[2] + iw[3] + iw[4] + iw[5];
	const valW = iw[6];
	const totalRows = [["Net Value", money(po["net_value"])]];
	if (po["is_igst"]) totalRows.push(["IGST", money(po["igst_amount"])]);
	else {
		totalRows.push(["CGST", money(po["cgst_amount"])]);
		totalRows.push(["SGST", money(po["sgst_amount"])]);
	}
	if (num(po["round_off"]) !== 0) totalRows.push(["Round Off", money(po["round_off"])]);
	totalRows.push([
		`Total (Qty ${qtyTotal} | Tax ${money(taxTotal)})`,
		money(po["grand_total"]),
		true
	]);
	totalRows.forEach(([label, val, strong]) => {
		cell(L, y, labelW, 16, label, {
			align: "right",
			bold: !!strong,
			fill: strong ? grey : void 0
		});
		cell(L + labelW, y, valW, 16, val, {
			align: "right",
			bold: !!strong,
			fill: strong ? grey : void 0
		});
		y -= 16;
	});
	const wordsLines = wrap(`Amount Chargeable (in words): ${amountInWords(num(po["grand_total"]))}`, 531.28, 8);
	const wh = wordsLines.length * 11 + 6;
	box(L, y, W, wh);
	wordsLines.forEach((l, i) => draw(l, 32, y - 12 - i * 11, 8));
	y -= wh + 12;
	const footH = 52;
	box(351.568, y, W * .4, footH);
	draw(`For ${clean(c["name"] ?? "Company")}`, 356.568, y - 13, 8, {
		bold: true,
		maxWidth: W * .4 - 10
	});
	draw("Authorised Signatory", 356.568, y - footH + 7, 8, { bold: true });
	const notes = [];
	if (c["pan_number"]) notes.push(`Company's PAN : ${c["pan_number"]}`);
	if (po["vendor_gst_snapshot"] || v["gst_number"]) notes.push(`Supplier's GSTIN : ${po["vendor_gst_snapshot"] ?? v["gst_number"]}`);
	if (v["pan_number"]) notes.push(`Supplier's PAN : ${v["pan_number"]}`);
	notes.forEach((n, i) => draw(n, L, y - 12 - i * 11, 7, { maxWidth: W * .55 }));
	y -= 66;
	draw(`SUBJECT TO ${String(c["city"] ?? "LOCAL").toUpperCase()} JURISDICTION`, L, y, 7, {
		align: "center",
		width: W
	});
	return await pdf.save();
}
//#endregion
export { buildPoPdf };

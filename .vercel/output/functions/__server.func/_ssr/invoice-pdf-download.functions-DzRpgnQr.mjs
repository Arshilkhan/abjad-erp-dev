import { r as createServerFn } from "./server-CLqueqhS.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBJ7eSG_.mjs";
import { t as createServerRpc } from "./createServerRpc-Bi8PNwoH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoice-pdf-download.functions-DzRpgnQr.js
/**
* Returns the invoice PDF (base64) built with the exact same renderer used
* for the emailed invoice, so downloads and emails always match.
*/
var downloadInvoicePdf_createServerFn_handler = createServerRpc({
	id: "feef32c6a6bbc5ffbbeb5ea0ebcdbbe363ef57ff36405a85e92fd0789e6e8d6e",
	name: "downloadInvoicePdf",
	filename: "src/lib/invoice-pdf-download.functions.ts"
}, (opts) => downloadInvoicePdf.__executeServer(opts));
var downloadInvoicePdf = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input?.invoiceId) throw new Error("invoiceId is required");
	return input;
}).handler(downloadInvoicePdf_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { fetchSalesDocument } = await import("./sales-document-fetch.server-CrP7Xso2.mjs");
	const doc = await fetchSalesDocument(supabase, data.invoiceId, data.kind);
	if (!doc) throw new Error("Document not found");
	const { invoice, items, company } = doc;
	const { buildInvoicePdf } = await import("./invoice-pdf-build.server-i7oElbv4.mjs");
	const pdfBytes = await buildInvoicePdf(invoice, items ?? [], company ?? null);
	let binary = "";
	const bytes = new Uint8Array(pdfBytes);
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return {
		filename: `${String(invoice.invoice_number ?? invoice.id).replace(/[^A-Za-z0-9._-]/g, "_")}.pdf`,
		base64: btoa(binary)
	};
});
//#endregion
export { downloadInvoicePdf_createServerFn_handler };

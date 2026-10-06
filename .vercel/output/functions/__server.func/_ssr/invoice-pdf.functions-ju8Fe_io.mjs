import { r as createServerFn } from "./server-CLqueqhS.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBJ7eSG_.mjs";
import { t as createServerRpc } from "./createServerRpc-Bi8PNwoH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoice-pdf.functions-ju8Fe_io.js
var MAX_DATA_URL_CHARS = 16e6;
var extractInvoicePdf_createServerFn_handler = createServerRpc({
	id: "f4f20b17fadc7157c8e2477c3c61073e02e4a1928f9571c15263f33efb184168",
	name: "extractInvoicePdf",
	filename: "src/lib/invoice-pdf.functions.ts"
}, (opts) => extractInvoicePdf.__executeServer(opts));
var extractInvoicePdf = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (typeof input?.fileData !== "string" || !input.fileData.startsWith("data:application/pdf")) throw new Error("Please upload a valid PDF file.");
	if (input.fileData.length > MAX_DATA_URL_CHARS) throw new Error("That PDF is too large. Please upload a file under 10 MB.");
	return input;
}).handler(extractInvoicePdf_createServerFn_handler, async ({ data, context }) => {
	const { enforceRateLimit } = await import("./rate-limit.server-CsurkmPq.mjs");
	await enforceRateLimit("pdf-extract", context.userId, 20, 3600);
	const { extractInvoiceFromPdf } = await import("./invoice-pdf-extract.server-CrluD0Gu.mjs");
	return await extractInvoiceFromPdf(data.fileData);
});
//#endregion
export { extractInvoicePdf_createServerFn_handler };

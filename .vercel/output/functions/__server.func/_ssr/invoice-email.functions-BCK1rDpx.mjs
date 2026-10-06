import { r as createServerFn } from "./server-CLqueqhS.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBJ7eSG_.mjs";
import { t as createServerRpc } from "./createServerRpc-Bi8PNwoH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoice-email.functions-BCK1rDpx.js
/**
* Emails an invoice PDF to the customer on file.
* Returns a reason instead of throwing when there is nothing to send to.
*/
var sendInvoiceEmail_createServerFn_handler = createServerRpc({
	id: "db219711c9090bfe058637d5bc5d6be04e6de6d12bb7f09fcab360c2e5579bce",
	name: "sendInvoiceEmail",
	filename: "src/lib/invoice-email.functions.ts"
}, (opts) => sendInvoiceEmail.__executeServer(opts));
var sendInvoiceEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input?.invoiceId) throw new Error("invoiceId is required");
	return input;
}).handler(sendInvoiceEmail_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { enforceRateLimit } = await import("./rate-limit.server-CsurkmPq.mjs");
	await enforceRateLimit("invoice-email", context.userId, 60, 3600);
	await enforceRateLimit("invoice-email-doc", data.invoiceId, 5, 3600);
	const { fetchSalesDocument } = await import("./sales-document-fetch.server-CrP7Xso2.mjs");
	const doc = await fetchSalesDocument(supabase, data.invoiceId, data.kind);
	if (!doc) return {
		sent: false,
		reason: "invoice_not_found"
	};
	const { invoice, items, company } = doc;
	let email = null;
	let companyName = null;
	if (invoice.customer_id) {
		const { data: cust } = await supabase.from("customers").select("email, company_name").eq("id", invoice.customer_id).single();
		email = cust?.email ?? null;
		companyName = cust?.company_name || invoice.customer_name_snapshot || null;
	} else companyName = invoice.customer_name_snapshot || null;
	if (!email) return {
		sent: false,
		reason: "no_email"
	};
	const { buildInvoicePdf } = await import("./invoice-pdf-build.server-i7oElbv4.mjs");
	const pdfBytes = await buildInvoicePdf(invoice, items ?? [], company ?? null);
	let binary = "";
	const bytes = new Uint8Array(pdfBytes);
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	const pdfBase64 = btoa(binary);
	const { sendResendEmail } = await import("./send-email-resend-B76bBh1u.mjs");
	await sendResendEmail("invoice-sent", email, {
		templateData: {
			invoiceNumber: invoice.invoice_number,
			invoiceDate: invoice.invoice_date,
			companyName
		},
		attachments: [{
			filename: `${invoice.invoice_number || invoice.id}.pdf`,
			content: pdfBase64,
			contentType: "application/pdf"
		}]
	});
	return {
		sent: true,
		email
	};
});
//#endregion
export { sendInvoiceEmail_createServerFn_handler };

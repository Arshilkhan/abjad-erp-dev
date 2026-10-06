import { r as createServerFn } from "./server-CLqueqhS.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBJ7eSG_.mjs";
import { t as createServerRpc } from "./createServerRpc-Bi8PNwoH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/po-email.functions-DvYL9PfG.js
/**
* Emails a purchase order to the vendor on file.
* The PO document is rendered as the HTML email body.
*/
var sendPoEmail_createServerFn_handler = createServerRpc({
	id: "f32a019e8ff50e60dc4f8cdc69e03d18b10e4edbe56e3a4cdef57e9996e8bd23",
	name: "sendPoEmail",
	filename: "src/lib/po-email.functions.ts"
}, (opts) => sendPoEmail.__executeServer(opts));
var sendPoEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input?.poId) throw new Error("poId is required");
	return input;
}).handler(sendPoEmail_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { enforceRateLimit } = await import("./rate-limit.server-CsurkmPq.mjs");
	await enforceRateLimit("po-email", context.userId, 60, 3600);
	await enforceRateLimit("po-email-doc", data.poId, 5, 3600);
	const { data: po, error } = await supabase.from("purchase_orders").select("*").eq("id", data.poId).single();
	if (error || !po) return {
		sent: false,
		reason: "po_not_found"
	};
	const [{ data: items }, { data: company }, vendorRes] = await Promise.all([
		supabase.from("purchase_order_items").select("*").eq("purchase_order_id", po.id).order("sr_no", { ascending: true }),
		supabase.from("company_profile").select("*").limit(1).maybeSingle(),
		po.vendor_id ? supabase.from("vendors").select("*").eq("id", po.vendor_id).maybeSingle() : Promise.resolve({ data: null })
	]);
	const vendor = vendorRes?.data ?? null;
	const email = vendor?.email ?? null;
	if (!email) return {
		sent: false,
		reason: "no_email"
	};
	const { buildPoPdf } = await import("./po-pdf-build.server-Dgxt-gSv.mjs");
	const pdfBytes = await buildPoPdf(po, items ?? [], company ?? null, vendor);
	let binary = "";
	const bytes = new Uint8Array(pdfBytes);
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	const pdfBase64 = btoa(binary);
	const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827">
      <p>Dear ${po.vendor_name_snapshot ?? vendor?.vendor_name ?? "Supplier"},</p>
      <p>Please find attached our Purchase Order <strong>${po.po_number}</strong>.</p>
      <p>Regards,<br/>${company?.name ?? "ABJAD Engineering Works"}</p>
    </div>`;
	const { sendResendHtmlEmail } = await import("./send-email-resend-B76bBh1u.mjs");
	await sendResendHtmlEmail({
		to: email,
		subject: `Purchase Order ${po.po_number}${company?.name ? ` - ${company.name}` : ""}`,
		html,
		attachments: [{
			filename: `PO-${String(po.po_number ?? po.id).replace(/[^A-Za-z0-9._-]/g, "_")}.pdf`,
			content: pdfBase64,
			contentType: "application/pdf"
		}]
	});
	if (po.status === "draft") await supabase.from("purchase_orders").update({ status: "sent" }).eq("id", po.id);
	return {
		sent: true,
		email
	};
});
//#endregion
export { sendPoEmail_createServerFn_handler };

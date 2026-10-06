import { n as __exportAll } from "../_runtime.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoice-history-DN84FPn5.js
var invoice_history_DN84FPn5_exports = /* @__PURE__ */ __exportAll({
	n: () => logInvoiceEvent,
	t: () => invoice_history_exports
});
var invoice_history_exports = /* @__PURE__ */ __exportAll$1({ logInvoiceEvent: () => logInvoiceEvent });
async function logInvoiceEvent(invoiceId, eventType, description, metadata) {
	try {
		const { data: u } = await supabase.auth.getUser();
		await supabase.from("invoice_history").insert({
			invoice_id: invoiceId,
			event_type: eventType,
			description: description ?? null,
			metadata: metadata ?? null,
			actor_id: u.user?.id ?? null,
			actor_email: u.user?.email ?? null
		});
	} catch (e) {
		console.error("[invoice-history]", e);
	}
}
//#endregion
export { logInvoiceEvent as n, invoice_history_DN84FPn5_exports as t };

import { n as salesDocumentConfig, t as isSalesDocumentKind } from "./sales-documents-CfQh3Qhc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sales-document-fetch.server-CrP7Xso2.js
/** Loads a sales document and its items from the table pair that owns its kind. */
async function fetchSalesDocument(supabase, id, kind) {
	const k = kind && isSalesDocumentKind(kind) ? kind : "tax_invoice";
	const cfg = salesDocumentConfig(k);
	const { data: invoice, error } = await supabase.from(cfg.table).select("*").eq("id", id).single();
	if (error || !invoice) return null;
	const [{ data: items }, { data: company }] = await Promise.all([supabase.from(cfg.itemsTable).select("*").eq("invoice_id", id).order("sr_no", { ascending: true }), supabase.from("company_profile").select("*").limit(1).maybeSingle()]);
	return {
		kind: k,
		invoice,
		items: items ?? [],
		company: company ?? null
	};
}
//#endregion
export { fetchSalesDocument };

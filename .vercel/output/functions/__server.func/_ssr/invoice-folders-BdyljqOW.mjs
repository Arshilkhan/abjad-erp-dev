import { t as supabase } from "./client-CuGeCb7I.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoice-folders-BdyljqOW.js
function folderSlug(name) {
	return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "unfiled";
}
function useInvoiceFolders(opts) {
	const table = opts?.table ?? "invoices";
	const invoicesQ = useQuery({
		queryKey: ["sales-documents", table],
		queryFn: async () => {
			const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const customersQ = useQuery({
		queryKey: ["customers-folder-map"],
		queryFn: async () => {
			const { data, error } = await supabase.from("customers").select("id, customer_name, company_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const map = /* @__PURE__ */ new Map();
	for (const c of customersQ.data ?? []) map.set(c.id, (c.company_name || c.customer_name || "").trim());
	const folders = /* @__PURE__ */ new Map();
	for (const r of invoicesQ.data ?? []) {
		if (opts?.kind && String(r.invoice_type) !== opts.kind) continue;
		const name = (r.customer_id ? map.get(r.customer_id) : "") || (r.customer_name_snapshot ?? "").trim() || "Unfiled";
		const slug = folderSlug(name);
		let f = folders.get(slug);
		if (!f) {
			f = {
				name,
				slug,
				rows: [],
				total: 0,
				lastDate: null
			};
			folders.set(slug, f);
		}
		f.rows.push(r);
		if (r.status !== "cancelled") f.total += Number(r.grand_total ?? 0);
		if (!f.lastDate || r.invoice_date && r.invoice_date > f.lastDate) f.lastDate = r.invoice_date ?? f.lastDate;
	}
	return {
		isLoading: invoicesQ.isLoading || customersQ.isLoading,
		folders: [...folders.values()].sort((a, b) => a.name.localeCompare(b.name))
	};
}
//#endregion
export { useInvoiceFolders as n, folderSlug as t };

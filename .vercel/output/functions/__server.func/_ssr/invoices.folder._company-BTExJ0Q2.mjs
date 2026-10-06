import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR } from "./format-COxJqFG7.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { w as useParams, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Y as ChevronLeft, g as Search } from "../_libs/lucide-react.mjs";
import { n as useInvoiceFolders } from "./invoice-folders-BdyljqOW.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as TaxInvoiceTable } from "./tax-invoice-table-g8T8Z4e1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoices.folder._company-BTExJ0Q2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FolderPage() {
	const { company } = useParams({ from: "/_authenticated/invoices/folder/$company" });
	const { folders, isLoading } = useInvoiceFolders({
		table: "invoices",
		kind: "tax_invoice"
	});
	const [q, setQ] = (0, import_react.useState)("");
	const folder = folders.find((f) => f.slug === company);
	const rows = (folder?.rows ?? []).filter((r) => !q || [
		r.invoice_number,
		r.customer_name_snapshot,
		r.po_number,
		r.challan_number,
		r.invoice_type
	].filter(Boolean).some((v) => String(v).toLowerCase().includes(q.toLowerCase())));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: folder?.name ?? decodeURIComponent(company),
			description: folder ? `${folder.rows.length} document${folder.rows.length === 1 ? "" : "s"} • ${formatINR(folder.total)} billed` : "Folder"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/invoices",
			className: "mb-3 inline-flex items-center text-sm text-muted-foreground hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "mr-1 h-4 w-4" }), " All folders"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "h-9 pl-9",
						placeholder: "Search in this folder…",
						value: q,
						onChange: (e) => setQ(e.target.value)
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaxInvoiceTable, {
				rows,
				isLoading
			})]
		}) })
	] });
}
//#endregion
export { FolderPage as component };

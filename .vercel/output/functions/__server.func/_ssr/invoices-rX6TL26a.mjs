import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR, i as formatDate } from "./format-COxJqFG7.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { _ as Outlet, m as useRouterState, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as List, F as Folder, g as Search, k as LayoutGrid } from "../_libs/lucide-react.mjs";
import { n as useInvoiceFolders } from "./invoice-folders-BdyljqOW.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as TaxInvoiceTable } from "./tax-invoice-table-g8T8Z4e1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoices-rX6TL26a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InvoicesLayout() {
	if (useRouterState({ select: (r) => r.location.pathname }) !== "/invoices") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoicesIndex, {});
}
function InvoicesIndex() {
	const { folders, isLoading } = useInvoiceFolders({
		table: "invoices",
		kind: "tax_invoice"
	});
	const [q, setQ] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)("folders");
	(0, import_react.useEffect)(() => {
		const saved = window.localStorage.getItem("abjad-erp-invoices-view");
		if (saved === "all" || saved === "folders") setView(saved);
	}, []);
	const changeView = (next) => {
		setView(next);
		window.localStorage.setItem("abjad-erp-invoices-view", next);
	};
	const s = q.trim().toLowerCase();
	const visibleFolders = folders.filter((f) => !s || f.name.toLowerCase().includes(s));
	const allRows = folders.flatMap((f) => f.rows).filter((r) => !s || [
		r.invoice_number,
		r.customer_name_snapshot,
		r.po_number,
		r.challan_number
	].filter(Boolean).some((v) => String(v).toLowerCase().includes(s)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Invoices",
			description: "Documents organised into a folder per company.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1 rounded-md border p-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: view === "folders" ? "secondary" : "ghost",
					onClick: () => changeView("folders"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "mr-1 h-4 w-4" }), " Folders"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: view === "all" ? "secondary" : "ghost",
					onClick: () => changeView("all"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "mr-1 h-4 w-4" }), " All documents"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mb-4 max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "h-9 pl-9",
				placeholder: view === "folders" ? "Search companies…" : "Search documents…",
				value: q,
				onChange: (e) => setQ(e.target.value)
			})]
		}),
		view === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaxInvoiceTable, {
				rows: allRows,
				isLoading
			})
		}) }) : isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-muted-foreground",
			children: "Loading…"
		}) : visibleFolders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "py-10 text-center text-muted-foreground",
			children: [
				"No company folders yet. ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/invoices/new",
					className: "text-primary hover:underline",
					children: "Create an invoice"
				}),
				" to start one."
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: visibleFolders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/invoices/folder/$company",
				params: { company: f.slug },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "h-full transition-colors hover:border-primary/50 hover:bg-muted/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-start gap-3 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-primary/10 p-2 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-medium",
									children: f.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										f.rows.length,
										" document",
										f.rows.length === 1 ? "" : "s",
										f.lastDate ? ` • last ${formatDate(f.lastDate)}` : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-sm font-semibold tabular-nums",
									children: formatINR(f.total)
								})
							]
						})]
					})
				})
			}, f.slug))
		})
	] });
}
//#endregion
export { InvoicesLayout as component };

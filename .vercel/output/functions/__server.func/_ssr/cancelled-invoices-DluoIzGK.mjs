import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR, i as formatDate, n as billNo } from "./format-COxJqFG7.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as Search } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cancelled-invoices-DluoIzGK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CancelledInvoicesPage() {
	const { data: rows = [], isLoading } = useQuery({
		queryKey: ["cancelled-invoices"],
		queryFn: async () => {
			const { data, error } = await supabase.from("invoices").select("*").eq("status", "cancelled").order("cancelled_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		const s = q.trim().toLowerCase();
		if (!s) return rows;
		return rows.filter((r) => r.invoice_number.toLowerCase().includes(s) || (r.customer_name_snapshot ?? "").toLowerCase().includes(s) || (r.cancellation_reason ?? "").toLowerCase().includes(s));
	}, [rows, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Cancelled Invoices",
		description: "Cancelled invoices are retained here permanently and cannot be edited or deleted."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mb-3 max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search invoice #, customer, reason…",
				value: q,
				onChange: (e) => setQ(e.target.value),
				className: "h-9 pl-9"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice #" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Total"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Cancelled On" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Reason" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "py-8 text-center text-muted-foreground",
				children: "Loading…"
			}) }),
			!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "py-10 text-center text-muted-foreground",
				children: "No cancelled invoices."
			}) }),
			filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "hover:bg-muted/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/invoices/$id",
							params: { id: r.id },
							className: "text-primary hover:underline",
							children: billNo(r.invoice_number)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customer_name_snapshot ?? "—" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(r.invoice_date) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: formatINR(r.grand_total)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.cancelled_at ? formatDate(r.cancelled_at) : "—" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "max-w-[280px] truncate text-muted-foreground",
						children: r.cancellation_reason ?? "—"
					})
				]
			}, r.id))
		] })] })]
	}) })] });
}
//#endregion
export { CancelledInvoicesPage as component };

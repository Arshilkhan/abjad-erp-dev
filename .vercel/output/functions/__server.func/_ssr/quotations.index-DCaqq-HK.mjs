import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR, i as formatDate, n as billNo } from "./format-COxJqFG7.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as Search, x as Pencil } from "../_libs/lucide-react.mjs";
import { n as useInvoiceFolders } from "./invoice-folders-BdyljqOW.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quotations.index-DCaqq-HK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuotationTable({ rows, isLoading }) {
	const [sortField, setSortField] = (0, import_react.useState)(null);
	const [sortDirection, setSortDirection] = (0, import_react.useState)("asc");
	const handleSort = (field) => {
		if (sortField === field) setSortDirection((prev) => prev === "asc" ? "desc" : "asc");
		else {
			setSortField(field);
			setSortDirection("asc");
		}
	};
	const sortedRows = (0, import_react.useMemo)(() => {
		if (!sortField) return rows;
		return [...rows].sort((a, b) => {
			let comparison = 0;
			switch (sortField) {
				case "quotation":
					comparison = String(a.invoice_number ?? "").localeCompare(String(b.invoice_number ?? ""), void 0, { numeric: true });
					break;
				case "customer":
					comparison = String(a.customer_name_snapshot ?? "").localeCompare(String(b.customer_name_snapshot ?? ""));
					break;
				case "date":
					comparison = new Date(a.invoice_date).getTime() - new Date(b.invoice_date).getTime();
					break;
				case "total": comparison = Number(a.grand_total ?? 0) - Number(b.grand_total ?? 0);
			}
			return sortDirection === "asc" ? comparison : -comparison;
		});
	}, [
		rows,
		sortField,
		sortDirection
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "cursor-pointer select-none",
			onClick: () => handleSort("quotation"),
			children: "Quotation #"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "cursor-pointer select-none",
			onClick: () => handleSort("customer"),
			children: "Customer"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "cursor-pointer select-none",
			onClick: () => handleSort("date"),
			children: "Date"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "cursor-pointer select-none text-right",
			onClick: () => handleSort("total"),
			children: "Total"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "w-24 text-right",
			children: "Actions"
		})
	] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
		isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: 6,
			className: "py-8 text-center text-muted-foreground",
			children: "Loading…"
		}) }),
		!isLoading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
			colSpan: 6,
			className: "py-10 text-center text-muted-foreground",
			children: [
				"No quotations here yet.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/invoices/new",
					search: { kind: "quotation" },
					className: "text-primary hover:underline",
					children: "Create one"
				}),
				"."
			]
		}) }),
		sortedRows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
			className: "hover:bg-muted/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-mono text-sm font-medium",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/invoices/$id",
						params: { id: r.id },
						search: { kind: "quotation" },
						className: "text-primary hover:underline",
						children: billNo(r.invoice_number)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customer_name_snapshot ?? "—" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(r.invoice_date) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums font-semibold",
					children: formatINR(r.grand_total)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "text-[10px] font-medium uppercase",
					children: r.status
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						asChild: true,
						title: "Edit",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/invoices/$id/edit",
							params: { id: r.id },
							search: { kind: "quotation" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
						})
					})
				})
			]
		}, r.id))
	] })] });
}
function QuotationsPage() {
	const { folders, isLoading } = useInvoiceFolders({
		table: "quotation",
		kind: "quotation"
	});
	const [q, setQ] = (0, import_react.useState)("");
	const s = q.trim().toLowerCase();
	const rows = folders.flatMap((f) => f.rows).filter((r) => !s || [r.invoice_number, r.customer_name_snapshot].filter(Boolean).some((v) => String(v).toLowerCase().includes(s)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Quotations",
			description: "Quotations are stored separately from invoices."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mb-4 max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "h-9 pl-9",
				placeholder: "Search quotations…",
				value: q,
				onChange: (e) => setQ(e.target.value)
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: !isLoading && rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "py-10 text-center text-sm text-muted-foreground",
				children: [
					"No quotations yet. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/quotations/new",
						className: "text-primary hover:underline",
						children: "Create one"
					}),
					"."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuotationTable, {
				rows,
				isLoading
			})
		}) })
	] });
}
//#endregion
export { QuotationsPage as component };

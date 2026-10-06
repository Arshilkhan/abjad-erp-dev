import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR, i as formatDate, n as billNo } from "./format-COxJqFG7.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Ban, x as Pencil } from "../_libs/lucide-react.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as CancelInvoiceDialog } from "./cancel-invoice-dialog-CK3QJEIJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tax-invoice-table-g8T8Z4e1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var taxInvoiceStatusStyles = {
	paid: "bg-[color:oklch(0.92_0.06_155)] text-[color:oklch(0.35_0.14_155)] border-transparent",
	sent: "bg-secondary text-secondary-foreground",
	partial: "bg-[color:oklch(0.94_0.09_75)] text-[color:oklch(0.40_0.15_75)] border-transparent",
	draft: "bg-muted text-muted-foreground",
	cancelled: "bg-destructive/10 text-destructive border-transparent"
};
function TaxInvoiceTable({ rows, isLoading }) {
	const qc = useQueryClient();
	const [sortField, setSortField] = (0, import_react.useState)(() => {
		const saved = localStorage.getItem("abjad-erp-tax-invoice-sort-field");
		return saved === "invoice" || saved === "customer" || saved === "date" || saved === "total" ? saved : null;
	});
	const [sortDirection, setSortDirection] = (0, import_react.useState)(() => {
		return localStorage.getItem("abjad-erp-tax-invoice-sort-direction") === "desc" ? "desc" : "asc";
	});
	const handleSort = (field) => {
		if (sortField === field) {
			const nextDirection = sortDirection === "asc" ? "desc" : "asc";
			setSortDirection(nextDirection);
			localStorage.setItem("abjad-erp-tax-invoice-sort-direction", nextDirection);
		} else {
			setSortField(field);
			setSortDirection("asc");
			localStorage.setItem("abjad-erp-tax-invoice-sort-field", field);
			localStorage.setItem("abjad-erp-tax-invoice-sort-direction", "asc");
		}
	};
	const sortedRows = (0, import_react.useMemo)(() => {
		if (!sortField) return rows;
		return [...rows].sort((a, b) => {
			let comparison = 0;
			switch (sortField) {
				case "invoice":
					comparison = String(a.invoice_number ?? "").localeCompare(String(b.invoice_number ?? ""), void 0, {
						numeric: true,
						sensitivity: "base"
					});
					break;
				case "customer":
					comparison = String(a.customer_name_snapshot ?? "").localeCompare(String(b.customer_name_snapshot ?? ""), void 0, { sensitivity: "base" });
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
			onClick: () => handleSort("invoice"),
			children: "Invoice #"
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
				"No tax invoices here yet.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/invoices/new",
					search: { kind: "tax_invoice" },
					className: "text-primary hover:underline",
					children: "Create one"
				}),
				"."
			]
		}) }),
		sortedRows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
			className: `hover:bg-muted/40 ${r.status === "cancelled" ? "opacity-60" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					className: "font-mono text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/invoices/$id",
						params: { id: r.id },
						search: { kind: "tax_invoice" },
						className: "text-primary hover:underline",
						children: billNo(r.invoice_number)
					}), r.is_imported && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "ml-2 text-[9px] uppercase",
						children: "Imported"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customer_name_snapshot ?? "—" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(r.invoice_date) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums font-semibold",
					children: formatINR(r.grand_total)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: `text-[10px] font-medium uppercase ${taxInvoiceStatusStyles[r.status] ?? ""}`,
					children: r.status
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end gap-1",
						children: r.status !== "cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							asChild: true,
							title: "Edit",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/invoices/$id/edit",
								params: { id: r.id },
								search: { kind: "tax_invoice" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CancelInvoiceDialog, {
							invoiceId: r.id,
							invoiceNumber: r.invoice_number,
							onCancelled: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
							trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								title: "Cancel invoice",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3.5 w-3.5 text-destructive" })
							})
						})] })
					})
				})
			]
		}, r.id))
	] })] });
}
//#endregion
export { TaxInvoiceTable as t };

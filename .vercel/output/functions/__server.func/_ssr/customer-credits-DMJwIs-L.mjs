import { a as formatINR, i as formatDate, n as billNo } from "./format-COxJqFG7.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customer-credits-DMJwIs-L.js
var import_jsx_runtime = require_jsx_runtime();
function CustomerCreditsPage() {
	const qc = useQueryClient();
	const { data: rows = [], isLoading } = useQuery({
		queryKey: ["customer-credits"],
		queryFn: async () => {
			const { data } = await supabase.from("customer_credits").select("*, customers(name), invoices(invoice_number)").order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const markRefunded = async (id) => {
		const { error } = await supabase.from("customer_credits").update({ status: "refunded" }).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Marked as refunded");
		qc.invalidateQueries({ queryKey: ["customer-credits"] });
	};
	const markApplied = async (id) => {
		const { error } = await supabase.from("customer_credits").update({ status: "applied" }).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Marked as applied to next invoice");
		qc.invalidateQueries({ queryKey: ["customer-credits"] });
	};
	const total = rows.reduce((s, r) => s + Number(r.credit_amount), 0);
	const open = rows.filter((r) => r.status === "open").reduce((s, r) => s + Number(r.credit_amount), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Customer Credits",
			description: "Auto-generated from rejected items. Refund customer or apply against the next invoice."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Credits",
					value: formatINR(total)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Open Credits",
					value: formatINR(open),
					accent: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Entries",
					value: String(rows.length)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Source Invoice" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Credit"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Notes" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Actions"
				})
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
				isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 7,
					className: "py-8 text-center text-muted-foreground",
					children: "Loading…"
				}) }),
				!isLoading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 7,
					className: "py-10 text-center text-muted-foreground",
					children: "No credits yet."
				}) }),
				rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-xs",
						children: formatDate(r.created_at)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customers?.name ?? "—" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-xs",
						children: r.source_invoice_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/invoices/$id",
							params: { id: r.source_invoice_id },
							className: "text-primary hover:underline",
							children: billNo(r.invoices?.invoice_number) || "—"
						}) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-semibold tabular-nums",
						children: formatINR(r.credit_amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "uppercase text-[10px]",
						children: r.status
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "max-w-[220px] truncate text-muted-foreground",
						children: r.notes ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: r.status === "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => markRefunded(r.id),
								children: "Refund"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => markApplied(r.id),
								children: "Apply"
							})]
						})
					})
				] }, r.id))
			] })] })
		}) })
	] });
}
function StatCard({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mt-1 text-2xl font-semibold tabular-nums ${accent ? "text-primary" : ""}`,
			children: value
		})]
	}) });
}
//#endregion
export { CustomerCreditsPage as component };

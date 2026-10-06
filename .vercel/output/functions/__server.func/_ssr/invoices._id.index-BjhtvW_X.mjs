import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR, i as formatDate, n as billNo, t as amountInWords } from "./format-COxJqFG7.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { n as salesDocumentConfig } from "./sales-documents-CfQh3Qhc.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { C as useNavigate, T as useRouter, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./server-CLqueqhS.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-CYA_x1QZ.mjs";
import { $ as Ban, N as History, U as Copy, et as ArrowLeft, h as Send, w as PackageX, x as Pencil, y as Printer } from "../_libs/lucide-react.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBJ7eSG_.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as SelectContent, b as SelectValue, g as Select, r as Route$5, v as SelectItem, y as SelectTrigger } from "./router-CkOQzNmy.mjs";
import { t as aew_logo_default } from "./aew-logo-CKFlGa9z.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { n as logInvoiceEvent } from "./invoice-history-DN84FPn5.mjs";
import { t as CancelInvoiceDialog } from "./cancel-invoice-dialog-CK3QJEIJ.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoices._id.index-BjhtvW_X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var eventLabels = {
	created: {
		label: "Created",
		color: "bg-blue-100 text-blue-800"
	},
	edited: {
		label: "Edited",
		color: "bg-amber-100 text-amber-800"
	},
	sent: {
		label: "Sent",
		color: "bg-slate-100 text-slate-800"
	},
	cancelled: {
		label: "Cancelled",
		color: "bg-red-100 text-red-800"
	},
	rejected_items: {
		label: "Items Rejected",
		color: "bg-orange-100 text-orange-800"
	},
	payment_received: {
		label: "Payment",
		color: "bg-green-100 text-green-800"
	},
	credit_generated: {
		label: "Credit Note",
		color: "bg-purple-100 text-purple-800"
	},
	adjustment: {
		label: "Adjustment",
		color: "bg-indigo-100 text-indigo-800"
	},
	imported: {
		label: "Imported",
		color: "bg-teal-100 text-teal-800"
	},
	duplicated: {
		label: "Duplicated",
		color: "bg-slate-100 text-slate-800"
	}
};
function InvoiceHistoryTab({ invoiceId }) {
	const { data: rows = [], isLoading } = useQuery({
		queryKey: ["invoice-history", invoiceId],
		queryFn: async () => {
			const { data, error } = await supabase.from("invoice_history").select("*").eq("invoice_id", invoiceId).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Activity History"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
		isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: "Loading…"
		}),
		!isLoading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground",
			children: "No activity recorded yet."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "relative space-y-4 border-l pl-6",
			children: rows.map((r) => {
				const meta = eventLabels[r.event_type] ?? {
					label: r.event_type,
					color: "bg-muted text-muted-foreground"
				};
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: `text-[10px] uppercase ${meta.color}`,
									variant: "outline",
									children: meta.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: new Date(r.created_at).toLocaleString("en-IN")
								}),
								r.actor_email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: ["• ", r.actor_email]
								})
							]
						}),
						r.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm",
							children: r.description
						})
					]
				}, r.id);
			})
		})
	] })] });
}
var REASONS = [
	"Manufacturing Defect",
	"Customer Rejection",
	"Wrong Size",
	"Wrong Material",
	"Other"
];
function RejectedItemsPanel({ invoiceId, items, invoice, disabled }) {
	const qc = useQueryClient();
	const { data: rejections = [] } = useQuery({
		queryKey: ["rejections", invoiceId],
		queryFn: async () => {
			const { data } = await supabase.from("invoice_rejections").select("*").eq("invoice_id", invoiceId).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const rejectedByItem = (0, import_react.useMemo)(() => {
		const m = {};
		for (const r of rejections) m[r.invoice_item_id] = (m[r.invoice_item_id] ?? 0) + Number(r.rejected_quantity);
		return m;
	}, [rejections]);
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const setD = (id, patch) => setDrafts((s) => {
		const prev = s[id] ?? {
			qty: "",
			reason: "",
			notes: "",
			disposition: "restock"
		};
		return {
			...s,
			[id]: {
				...prev,
				...patch
			}
		};
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const save = async () => {
		const entries = Object.entries(drafts).filter(([, d]) => Number(d.qty) > 0 && d.reason);
		if (entries.length === 0) return toast.error("Enter a quantity and reason for at least one item.");
		setSaving(true);
		const inserts = [];
		let totalDeduction = 0;
		for (const [itemId, d] of entries) {
			const item = items.find((i) => i.id === itemId);
			if (!item) continue;
			const alreadyRejected = rejectedByItem[itemId] ?? 0;
			const qty = Number(d.qty);
			const maxAvailable = Number(item.quantity) - alreadyRejected;
			if (qty > maxAvailable) {
				toast.error(`${item.description}: only ${maxAvailable} left to reject.`);
				setSaving(false);
				return;
			}
			const unitRate = Number(item.unit_rate);
			const taxPct = Number(item.tax_pct);
			const rejectedValue = qty * unitRate;
			const gstDeduction = rejectedValue * taxPct / 100;
			const total = rejectedValue + gstDeduction;
			totalDeduction += total;
			inserts.push({
				invoice_id: invoiceId,
				invoice_item_id: itemId,
				rejected_quantity: qty,
				rejection_reason: d.reason,
				reason_notes: d.notes || null,
				unit_rate: unitRate,
				tax_pct: taxPct,
				rejected_value: rejectedValue,
				gst_deduction: gstDeduction,
				total_deduction: total,
				disposition: d.disposition || "restock"
			});
		}
		const { data: rejData, error } = await supabase.from("invoice_rejections").insert(inserts).select("*");
		if (error) {
			setSaving(false);
			return toast.error(error.message);
		}
		const newRejectedByItem = { ...rejectedByItem };
		for (const [itemId, d] of entries) newRejectedByItem[itemId] = (newRejectedByItem[itemId] ?? 0) + Number(d.qty);
		for (const item of items) {
			const newRejected = newRejectedByItem[item.id] ?? 0;
			const accepted = Number(item.quantity) - newRejected;
			const gross = accepted * Number(item.unit_rate);
			const discountAmount = gross * Number(item.discount_pct ?? 0) / 100;
			const net = gross - discountAmount;
			const taxAmount = net * Number(item.tax_pct ?? 0) / 100;
			await supabase.from("invoice_items").update({
				rejected_quantity: newRejected,
				accepted_quantity: accepted,
				discount_amount: discountAmount,
				tax_amount: taxAmount,
				total_amount: net + taxAmount
			}).eq("id", item.id);
		}
		if (totalDeduction > 0) await supabase.from("customer_credits").insert({
			customer_id: invoice.customer_id,
			source_invoice_id: invoiceId,
			source_rejection_id: rejData?.[0]?.id ?? null,
			credit_amount: totalDeduction,
			notes: `Auto-generated from rejected items on ${invoice.invoice_number}`
		});
		const inventoryInserts = entries.filter(([, d]) => d.disposition === "rejected_inventory").map(([itemId, d]) => {
			const item = items.find((i) => i.id === itemId);
			return {
				product_id: item.product_id ?? null,
				invoice_id: invoiceId,
				description: item.description,
				quantity: Number(d.qty),
				uom: item.uom,
				reason: d.reason,
				disposition: "hold"
			};
		});
		if (inventoryInserts.length) await supabase.from("rejected_inventory").insert(inventoryInserts);
		await logInvoiceEvent(invoiceId, "rejected_items", `${entries.length} item(s) rejected, deduction ${formatINR(totalDeduction)}`, {
			deduction: totalDeduction,
			count: entries.length
		});
		const originalItemDiscounts = items.reduce((s, i) => s + Number(i.discount_amount ?? 0), 0);
		const extraDiscount = Number(invoice.discount_amount ?? 0) - originalItemDiscounts;
		let netValue = 0, taxTotal = 0, itemDiscounts = 0;
		for (const item of items) {
			const gross = (Number(item.quantity) - (newRejectedByItem[item.id] ?? 0)) * Number(item.unit_rate);
			const discountAmount = gross * Number(item.discount_pct ?? 0) / 100;
			const net = gross - discountAmount;
			itemDiscounts += discountAmount;
			netValue += net;
			taxTotal += net * Number(item.tax_pct ?? 0) / 100;
		}
		const charges = Number(invoice.freight ?? 0) + Number(invoice.packing_charges ?? 0) + Number(invoice.other_charges ?? 0);
		const newSubtotal = netValue + charges - extraDiscount;
		const preRound = newSubtotal + taxTotal;
		const newGrand = Math.round(preRound);
		await supabase.from("invoices").update({
			net_value: netValue,
			discount_amount: itemDiscounts + extraDiscount,
			subtotal: newSubtotal,
			sgst_amount: invoice.is_igst ? 0 : taxTotal / 2,
			cgst_amount: invoice.is_igst ? 0 : taxTotal / 2,
			igst_amount: invoice.is_igst ? taxTotal : 0,
			round_off: newGrand - preRound,
			grand_total: newGrand,
			amount_in_words: amountInWords(newGrand)
		}).eq("id", invoiceId);
		await logInvoiceEvent(invoiceId, "adjustment", `Invoice recalculated after rejection, reduced by ${formatINR(totalDeduction)}`, { newGrand });
		setSaving(false);
		setDrafts({});
		toast.success("Rejection recorded and credit generated");
		qc.invalidateQueries({ queryKey: ["rejections", invoiceId] });
		qc.invalidateQueries({ queryKey: ["invoice", invoiceId] });
	};
	const summary = (0, import_react.useMemo)(() => {
		return {
			totalRejected: rejections.reduce((s, r) => s + Number(r.total_deduction), 0),
			count: rejections.length
		};
	}, [rejections]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Manage Returned / Rejected Items"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Enter rejected quantity and reason. System automatically calculates deduction, creates customer credit, and updates inventory." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Item" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Delivered"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Already Rejected"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Reject Qty" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Reason" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Disposition" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Notes" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: items.map((it) => {
			const already = rejectedByItem[it.id] ?? 0;
			const remaining = Number(it.quantity) - already;
			const d = drafts[it.id] ?? {
				qty: "",
				reason: "",
				notes: "",
				disposition: "restock"
			};
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "max-w-[250px] truncate",
					children: it.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums",
					children: Number(it.quantity)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums text-muted-foreground",
					children: already
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					min: 0,
					max: remaining,
					step: "0.01",
					value: d.qty,
					onChange: (e) => setD(it.id, { qty: e.target.value }),
					disabled: disabled || remaining <= 0,
					placeholder: `max ${remaining}`,
					className: "h-8 w-24"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: d.reason,
					onValueChange: (v) => setD(it.id, { reason: v }),
					disabled,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "h-8 w-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select…" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: REASONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: r,
						children: r
					}, r)) })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: d.disposition,
					onValueChange: (v) => setD(it.id, { disposition: v }),
					disabled,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "h-8 w-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "restock",
							children: "Back to Stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "rejected_inventory",
							children: "Rejected Inventory"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "scrap",
							children: "Scrap"
						})
					] })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: d.notes,
					onChange: (e) => setD(it.id, { notes: e.target.value }),
					disabled,
					className: "h-8"
				}) })
			] }, it.id);
		}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: save,
				disabled: saving || disabled,
				children: saving ? "Saving…" : "Save Rejection & Adjust Invoice"
			})
		})] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Rejection History"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
			summary.count,
			" rejection",
			summary.count === 1 ? "" : "s",
			" • Total deduction: ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold",
				children: formatINR(summary.totalRejected)
			})
		] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: rejections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground",
			children: "No rejections recorded."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Item" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Qty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Reason" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Value"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "GST"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Total Deduction"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: rejections.map((r) => {
			const item = items.find((i) => i.id === r.invoice_item_id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-xs",
					children: new Date(r.created_at).toLocaleDateString("en-IN")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "max-w-[220px] truncate",
					children: item?.description ?? "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums",
					children: Number(r.rejected_quantity)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.rejection_reason }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums",
					children: formatINR(r.rejected_value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums",
					children: formatINR(r.gst_deduction)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums font-semibold",
					children: formatINR(r.total_deduction)
				})
			] }, r.id);
		}) })] }) })] })]
	});
}
/**
* Returns the invoice PDF (base64) built with the exact same renderer used
* for the emailed invoice, so downloads and emails always match.
*/
var downloadInvoicePdf = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input?.invoiceId) throw new Error("invoiceId is required");
	return input;
}).handler(createSsrRpc("feef32c6a6bbc5ffbbeb5ea0ebcdbbe363ef57ff36405a85e92fd0789e6e8d6e"));
var typeLabels = {
	tax_invoice: "TAX INVOICE",
	proforma: "PROFORMA INVOICE",
	quotation: "QUOTATION",
	delivery_challan: "DELIVERY CHALLAN",
	credit_note: "CREDIT NOTE",
	debit_note: "DEBIT NOTE"
};
function InvoiceDetail() {
	const { id } = Route$5.useParams();
	const kind = Route$5.useSearch().kind ?? "tax_invoice";
	const cfg = salesDocumentConfig(kind);
	const docTable = cfg.table;
	const itemsTable = cfg.itemsTable;
	const isTax = kind === "tax_invoice";
	const nav = useNavigate();
	const router = useRouter();
	const qc = useQueryClient();
	const getPdf = useServerFn(downloadInvoicePdf);
	const [downloading, setDownloading] = (0, import_react.useState)(false);
	const downloadPdf = async () => {
		setDownloading(true);
		try {
			const res = await getPdf({ data: {
				invoiceId: id,
				kind
			} });
			const bin = atob(res.base64);
			const bytes = new Uint8Array(bin.length);
			for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
			const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
			const a = document.createElement("a");
			a.href = url;
			a.download = res.filename;
			a.click();
			URL.revokeObjectURL(url);
		} catch (e) {
			toast.error(e?.message ?? "Could not generate the invoice PDF");
		} finally {
			setDownloading(false);
		}
	};
	const { data, isLoading } = useQuery({
		queryKey: [
			"invoice",
			kind,
			id
		],
		queryFn: async () => {
			const [inv, items, company] = await Promise.all([
				supabase.from(docTable).select("*").eq("id", id).single(),
				supabase.from(itemsTable).select("*").eq("invoice_id", id).order("sr_no"),
				supabase.from("company_profile").select("*").limit(1).maybeSingle()
			]);
			if (inv.error) throw inv.error;
			const rows = items.data ?? [];
			const invoice = inv.data;
			if (isTax && invoice && rows.some((it) => Number(it.rejected_quantity ?? 0) > 0)) {
				let netValue = 0, itemDiscounts = 0, taxTotal = 0;
				for (const it of rows) {
					const accepted = Number(it.quantity) - Number(it.rejected_quantity ?? 0);
					const gross = accepted * Number(it.unit_rate);
					const discount = gross * Number(it.discount_pct ?? 0) / 100;
					const net = gross - discount;
					const tax = net * Number(it.tax_pct ?? 0) / 100;
					netValue += net;
					itemDiscounts += discount;
					taxTotal += tax;
					const lineTotal = net + tax;
					if (Math.abs(Number(it.total_amount ?? 0) - lineTotal) > .01) {
						await supabase.from(itemsTable).update({
							accepted_quantity: accepted,
							discount_amount: discount,
							tax_amount: tax,
							total_amount: lineTotal
						}).eq("id", it.id);
						it.accepted_quantity = accepted;
						it.discount_amount = discount;
						it.tax_amount = tax;
						it.total_amount = lineTotal;
					}
				}
				const charges = Number(invoice.freight ?? 0) + Number(invoice.packing_charges ?? 0) + Number(invoice.other_charges ?? 0);
				const subtotal = netValue + charges;
				const preRound = subtotal + taxTotal;
				const grand = Math.round(preRound);
				const next = {
					net_value: netValue,
					discount_amount: itemDiscounts,
					subtotal,
					sgst_amount: invoice.is_igst ? 0 : taxTotal / 2,
					cgst_amount: invoice.is_igst ? 0 : taxTotal / 2,
					igst_amount: invoice.is_igst ? taxTotal : 0,
					round_off: grand - preRound,
					grand_total: grand,
					amount_in_words: amountInWords(grand)
				};
				if (Math.abs(Number(invoice.subtotal ?? 0) - subtotal) > .01 || Math.abs(Number(invoice.grand_total ?? 0) - grand) > .01) {
					await supabase.from(docTable).update(next).eq("id", id);
					Object.assign(invoice, next);
				}
			}
			return {
				invoice,
				items: rows,
				company: company.data
			};
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	if (!data?.invoice) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-muted-foreground",
		children: "Invoice not found."
	});
	const { invoice, items, company } = data;
	const typeLabel = typeLabels[invoice.invoice_type] ?? "TAX INVOICE";
	const isCancelled = invoice.status === "cancelled";
	const duplicate = async () => {
		const duplicatePayload = {
			invoice_number: `${invoice.invoice_number}-COPY-${Date.now().toString().slice(-4)}`,
			invoice_type: invoice.invoice_type,
			invoice_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			customer_id: invoice.customer_id,
			customer_name_snapshot: invoice.customer_name_snapshot,
			customer_gst_snapshot: invoice.customer_gst_snapshot,
			customer_address_snapshot: invoice.customer_address_snapshot,
			work_order_number: invoice.work_order_number,
			delivery_mode: invoice.delivery_mode,
			contact_person: invoice.contact_person,
			contact_mobile: invoice.contact_mobile,
			notes: invoice.notes,
			status: "draft"
		};
		if (kind === "delivery_challan") Object.assign(duplicatePayload, {
			challan_number: invoice.challan_number,
			challan_date: invoice.challan_date,
			challan_dates: invoice.challan_dates,
			movement_reason: invoice.movement_reason,
			transporter_name: invoice.transporter_name,
			place_of_dispatch: invoice.place_of_dispatch,
			place_of_delivery: invoice.place_of_delivery
		});
		else Object.assign(duplicatePayload, {
			is_igst: invoice.is_igst,
			net_value: invoice.net_value,
			discount_amount: invoice.discount_amount,
			freight: invoice.freight,
			packing_charges: invoice.packing_charges,
			other_charges: invoice.other_charges,
			transportation_charges: invoice.transportation_charges,
			delivery_charges: invoice.delivery_charges,
			subtotal: invoice.subtotal,
			sgst_amount: invoice.sgst_amount,
			cgst_amount: invoice.cgst_amount,
			igst_amount: invoice.igst_amount,
			round_off: invoice.round_off,
			grand_total: invoice.grand_total,
			amount_in_words: invoice.amount_in_words,
			payment_terms: invoice.payment_terms
		});
		const { data: newInv, error } = await supabase.from(docTable).insert(duplicatePayload).select("id").single();
		if (error) return toast.error(error.message);
		if (items.length && newInv) await supabase.from(itemsTable).insert(items.map((it) => {
			const base = {
				invoice_id: newInv.id,
				sr_no: it.sr_no,
				product_id: it.product_id,
				hsn_code: it.hsn_code,
				description: it.description,
				quantity: it.quantity,
				uom: it.uom,
				serial_batch_number: it.serial_batch_number
			};
			return kind === "delivery_challan" ? base : {
				...base,
				unit_rate: it.unit_rate,
				discount_pct: it.discount_pct,
				discount_amount: it.discount_amount,
				tax_pct: it.tax_pct,
				tax_amount: it.tax_amount,
				total_amount: it.total_amount
			};
		}));
		if (newInv && isTax) await logInvoiceEvent(newInv.id, "duplicated", `Duplicated from ${invoice.invoice_number}`);
		toast.success(`${cfg.label} duplicated as draft`);
		nav({
			to: "/invoices/$id",
			params: { id: newInv.id },
			search: { kind }
		});
	};
	const markSent = async () => {
		const { error } = await supabase.from(docTable).update({ status: "sent" }).eq("id", id);
		if (error) return toast.error(error.message);
		if (isTax) await logInvoiceEvent(id, "sent", "Marked as sent");
		toast.success("Marked as sent");
		qc.invalidateQueries({ queryKey: [
			"invoice",
			kind,
			id
		] });
	};
	const cancelOther = async () => {
		if (!window.confirm(`Cancel this ${cfg.label.toLowerCase()}?`)) return;
		const { error } = await supabase.from(docTable).update({ status: "cancelled" }).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success(`${cfg.label} cancelled`);
		qc.invalidateQueries({ queryKey: [
			"invoice",
			kind,
			id
		] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center justify-between gap-2 print:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => router.history.back(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1 h-4 w-4" }), " Back"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "border-destructive bg-destructive/10 text-destructive uppercase",
						children: "Cancelled"
					}),
					isTax && invoice.is_imported && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "uppercase",
						children: "Imported"
					}),
					invoice.status === "draft" && !isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: markSent,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1 h-4 w-4" }), " Mark Sent"]
					}),
					!isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/invoices/$id/edit",
							params: { id },
							search: { kind },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-1 h-4 w-4" }), " Edit"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: duplicate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1 h-4 w-4" }), " Duplicate"]
					}),
					!isCancelled && !isTax && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "text-destructive hover:text-destructive",
						onClick: cancelOther,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "mr-1 h-4 w-4" }), " Cancel"]
					}),
					!isCancelled && isTax && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CancelInvoiceDialog, {
						invoiceId: id,
						invoiceNumber: billNo(invoice.invoice_number),
						onCancelled: () => qc.invalidateQueries({ queryKey: [
							"invoice",
							kind,
							id
						] }),
						trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "text-destructive hover:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "mr-1 h-4 w-4" }), " Cancel Invoice"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: downloadPdf,
						disabled: downloading,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-1 h-4 w-4" }),
							" ",
							downloading ? "Preparing…" : "Download PDF"
						]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "invoice",
			className: "print:contents",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "print:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "invoice",
							children: isTax ? "Invoice" : cfg.label
						}),
						isTax && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "rejected",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageX, { className: "mr-1 h-3.5 w-3.5" }), " Rejected Items"]
						}),
						isTax && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "history",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "mr-1 h-3.5 w-3.5" }), " History"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "invoice",
					className: "print:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `print-page relative mx-auto bg-white text-black shadow-sm print:shadow-none ${isCancelled ? "cancelled-invoice" : ""}`,
						style: {
							maxWidth: "210mm",
							padding: "10mm"
						},
						children: [isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "cancelled-watermark pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "select-none text-[140px] font-extrabold uppercase tracking-widest opacity-20",
								style: {
									color: "#dc2626",
									transform: "rotate(-25deg)",
									border: "8px solid #dc2626",
									padding: "0 24px"
								},
								children: "Cancelled"
							})
						}), kind === "delivery_challan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintableChallan, {
							invoice,
							items,
							company
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintableInvoice, {
							invoice,
							items,
							company,
							typeLabel
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "rejected",
					className: "print:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RejectedItemsPanel, {
						invoiceId: id,
						items,
						invoice,
						disabled: isCancelled
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "history",
					className: "print:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoiceHistoryTab, { invoiceId: id })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @media print {
          @page { size: A4; margin: 8mm; }
          body { background: white !important; }
          .print-page { box-shadow: none !important; max-width: 100% !important; padding: 0 !important; }
          [role="tablist"] { display: none !important; }
        }
      ` })
	] });
}
function PrintableChallan({ invoice, items, company }) {
	const c = company ?? {};
	const border = "border border-black";
	const dates = Array.isArray(invoice.challan_dates) && invoice.challan_dates.length ? invoice.challan_dates.map((date) => formatDate(date)).join(", ") : formatDate(invoice.challan_date ?? invoice.invoice_date);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-[11px] text-black",
		style: { fontFamily: "Arial, Helvetica, sans-serif" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold",
						children: c.name ?? "ABJAD ENGINEERING WORKS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: [
						c.address,
						c.city,
						c.state,
						c.pincode
					].filter(Boolean).join(", ") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["GSTIN: ", c.gst_number ?? "—"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: [
						c.mobile,
						c.alt_mobile,
						c.email
					].filter(Boolean).join(" • ") })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: aew_logo_default,
					alt: "AEW logo",
					className: "h-20 w-auto object-contain"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "bg-primary py-2 text-center text-xl font-bold text-primary-foreground",
				children: "DELIVERY CHALLAN"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: `${border} p-2`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold",
							children: "DOCUMENT DETAILS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Challan No.: ", invoice.challan_number ?? invoice.invoice_number] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Date: ", dates] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Reason: ", invoice.movement_reason ?? "—"] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: `${border} p-2`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold",
							children: "CONSIGNEE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: invoice.customer_name_snapshot ?? "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "whitespace-pre-line",
							children: invoice.customer_address_snapshot ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["GSTIN: ", invoice.customer_gst_snapshot ?? "—"] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: `${border} p-2`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold",
					children: "TRANSPORT"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Transporter: ", invoice.transporter_name ?? "—"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Dispatch: ", invoice.place_of_dispatch ?? "—"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Delivery: ", invoice.place_of_delivery ?? "—"] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full border-collapse",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
					"Sr. No.",
					"Item",
					"HSN",
					"Description",
					"Quantity",
					"UOM",
					"Serial / Batch"
				].map((head) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: `${border} p-1 text-left`,
					children: head
				}, head)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${border} p-1`,
						children: item.sr_no
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${border} p-1`,
						children: item.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${border} p-1`,
						children: item.hsn_code ?? ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${border} p-1`,
						children: item.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${border} p-1 text-right`,
						children: Number(item.quantity)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${border} p-1`,
						children: item.uom ?? "NOS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${border} p-1`,
						children: item.serial_batch_number ?? ""
					})
				] }, item.id)) })]
			}),
			invoice.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `${border} p-2`,
				children: ["Notes: ", invoice.notes]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: `${border} mt-4 p-3`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold",
						children: "RECEIVER ACKNOWLEDGEMENT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Received the above goods in good condition." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 grid grid-cols-4 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Receiver Name" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Signature" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Date" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Company Stamp" })
						]
					})
				]
			})
		]
	});
}
function PrintableInvoice({ invoice, items, company, typeLabel }) {
	const c = company ?? {};
	const cellBorder = "border border-black";
	const label = "font-bold text-[11px]";
	const val = "text-[11px]";
	const lineTotals = {};
	let netValue = 0;
	let itemDiscounts = 0;
	let taxTotal = 0;
	for (const it of items) {
		const gross = (Number(it.quantity) - Number(it.rejected_quantity ?? 0)) * Number(it.unit_rate);
		const discount = gross * Number(it.discount_pct ?? 0) / 100;
		const net = gross - discount;
		const tax = net * Number(it.tax_pct ?? 0) / 100;
		lineTotals[it.id] = net + tax;
		netValue += net;
		itemDiscounts += discount;
		taxTotal += tax;
	}
	const charges = Number(invoice.freight ?? 0) + Number(invoice.packing_charges ?? 0) + Number(invoice.other_charges ?? 0);
	const subtotal = netValue + charges;
	const preRound = subtotal + taxTotal;
	const grandTotal = Math.round(preRound);
	const totals = {
		netValue,
		discount: itemDiscounts,
		subtotal,
		sgst: invoice.is_igst ? 0 : taxTotal / 2,
		cgst: invoice.is_igst ? 0 : taxTotal / 2,
		igst: invoice.is_igst ? taxTotal : 0,
		roundOff: grandTotal - preRound,
		grandTotal
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "font-serif text-black",
		style: { fontFamily: "'Times New Roman', Times, serif" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold underline",
						children: c.name ?? "ABJAD ENGINEERING WORKS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-[11px] leading-snug",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "underline font-semibold",
								children: "OFFICE & WORKS:"
							}),
							" ",
							c.address ?? "UNIT NO. 008, G-WING, UDYOG BHAVAN -2, PLOT NO. K-3, MIDC ANAND NAGER AMBERNATH (E) PIN 421 506",
							c.city && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [", ", c.city] }),
							c.state && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								" (",
								c.state,
								")"
							] }),
							(c.mobile || c.alt_mobile) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								", ",
								c.mobile,
								c.alt_mobile ? ` / ${c.alt_mobile}` : ""
							] }),
							c.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "italic text-blue-700",
								children: ["Email: ", c.email]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: aew_logo_default,
					alt: "AEW logo",
					className: "h-20 w-auto object-contain"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-1 bg-[#5b9bd5] py-1.5 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold tracking-wider text-white",
					children: typeLabel
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
				className: "w-full border-collapse text-[11px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1 ${label} w-[15%] align-top`,
						children: "CUSTOMER NAME"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1 ${val} w-[45%] align-top`,
						children: invoice.customer_name_snapshot ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1 ${label} w-[15%]`,
						children: "Bill No."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1 ${val} w-[10%]`,
						children: billNo(invoice.invoice_number)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1 ${label} w-[8%]`,
						children: "Date"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1 ${val} w-[12%]`,
						children: formatDate(invoice.invoice_date)
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: `${cellBorder} p-1 ${label} align-top`,
					children: "Address"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: `${cellBorder} p-1 ${val} align-top`,
					colSpan: 5,
					children: invoice.customer_address_snapshot ?? "—"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
				className: "w-full border-collapse text-[11px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "bg-gray-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 ${label} text-center`,
							colSpan: 2,
							children: "BUYER DETAILS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 ${label} text-center`,
							colSpan: 2,
							children: "COMPANY DETAILS"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 ${label} w-[15%]`,
							children: "GSTIN NO."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 ${val} w-[35%]`,
							children: invoice.customer_gst_snapshot ?? ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 ${label} w-[15%]`,
							children: "GSTIN NO."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 ${val} w-[35%]`,
							children: c.gst_number ?? ""
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 ${label}`,
							children: "W/O No."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 ${val}`,
							children: invoice.work_order_number ?? ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 ${label}`,
							children: "PAN NO."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 ${val}`,
							children: c.pan_number ?? ""
						})
					] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full border-collapse text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "bg-gray-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: `${cellBorder} p-1 w-[6%]`,
							children: "Sr. No."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: `${cellBorder} p-1 w-[10%]`,
							children: "HSN /SAC Cod"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: `${cellBorder} p-1 text-left`,
							children: "Item Description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: `${cellBorder} p-1 w-[9%]`,
							children: "Qty. (Nos)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: `${cellBorder} p-1 w-[8%]`,
							children: "UOM"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: `${cellBorder} p-1 w-[12%]`,
							children: "Unit Rate(Rs)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: `${cellBorder} p-1 w-[13%]`,
							children: "Total Amt.(Rs)"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [items.map((it) => {
					const rejected = Number(it.rejected_quantity ?? 0);
					const billedQty = rejected > 0 ? Number(it.quantity) - rejected : Number(it.quantity);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 text-center`,
							children: it.sr_no
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 text-center`,
							children: it.hsn_code ?? ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: `${cellBorder} p-1`,
							children: [it.description, rejected > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] italic",
								children: [
									" (Delivered ",
									Number(it.quantity),
									", rejected ",
									rejected,
									")"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 text-right tabular-nums`,
							children: billedQty.toFixed(0).padStart(2, "0")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 text-center`,
							children: it.uom ?? "NOS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 text-right tabular-nums`,
							children: Number(it.unit_rate).toFixed(2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 text-right tabular-nums`,
							children: (lineTotals[it.id] ?? Number(it.total_amount)).toFixed(2)
						})
					] }, it.id);
				}), Array.from({ length: Math.max(0, 8 - items.length) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1`,
						children: "\xA0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: cellBorder }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: cellBorder }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: cellBorder }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: cellBorder }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: cellBorder }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: cellBorder })
				] }, `f${i}`))] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
				className: "w-full border-collapse text-[11px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-2 align-top`,
							rowSpan: 11,
							style: { width: "55%" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[110px_1fr] gap-y-1 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold",
										children: "BANK NAME"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: c.bank_name ?? "" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold",
										children: "A/C NO."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: c.bank_account ?? "" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold",
										children: "BRANCH IFSC"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: c.bank_ifsc ?? "" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold",
										children: "BRANCH NAME"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: c.bank_branch ?? "" })
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 ${label}`,
							colSpan: 2,
							children: "Net Value (Rs.)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 text-right tabular-nums`,
							children: totals.netValue.toFixed(2)
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1`,
						colSpan: 2,
						children: "Discount"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1 text-right tabular-nums`,
						children: totals.discount.toFixed(2)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1`,
						colSpan: 2,
						children: "Freight"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1 text-right tabular-nums`,
						children: Number(invoice.freight).toFixed(2)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1`,
						colSpan: 2,
						children: "P & F Charges"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1 text-right tabular-nums`,
						children: Number(invoice.packing_charges).toFixed(2)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1`,
						colSpan: 2,
						children: "Sub Total"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1 text-right tabular-nums`,
						children: totals.subtotal.toFixed(2)
					})] }),
					!invoice.is_igst ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 w-[35%]`,
								children: "SGST"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 text-center w-[10%]`,
								children: items[0]?.tax_pct ? `${Number(items[0].tax_pct) / 2}%` : ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 text-right tabular-nums`,
								children: totals.sgst.toFixed(2)
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1`,
								children: "CGST"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 text-center`,
								children: items[0]?.tax_pct ? `${Number(items[0].tax_pct) / 2}%` : ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 text-right tabular-nums`,
								children: totals.cgst.toFixed(2)
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1`,
								children: "IGST"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 text-center`,
								children: "----"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 text-right tabular-nums`,
								children: "0.00"
							})
						] })
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1`,
								children: "SGST"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 text-center`,
								children: "----"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 text-right tabular-nums`,
								children: "0.00"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1`,
								children: "CGST"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 text-center`,
								children: "----"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 text-right tabular-nums`,
								children: "0.00"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1`,
								children: "IGST"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 text-center`,
								children: items[0]?.tax_pct ? `${items[0].tax_pct}%` : ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `${cellBorder} p-1 text-right tabular-nums`,
								children: totals.igst.toFixed(2)
							})
						] })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1`,
						colSpan: 2,
						children: "Sub Total"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1 text-right tabular-nums`,
						children: (totals.subtotal + totals.sgst + totals.cgst + totals.igst).toFixed(2)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1`,
						colSpan: 2,
						children: "Round Off"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `${cellBorder} p-1 text-right tabular-nums`,
						children: totals.roundOff.toFixed(2)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "bg-gray-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 font-bold`,
							colSpan: 2,
							children: "Grand Total (Rs)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `${cellBorder} p-1 text-right font-bold tabular-nums`,
							children: totals.grandTotal.toFixed(2)
						})]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `${cellBorder} border-t-0 p-1 text-[11px] italic`,
				children: ["In Words. ", amountInWords(totals.grandTotal)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
				className: "w-full border-collapse text-[11px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: `${cellBorder} p-1 w-[60%]`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: "Delivery :"
						}), " By Road"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: `${cellBorder} p-1 text-right align-top`,
						rowSpan: 3,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold",
								children: ["For ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-600 underline",
									children: c.name ?? "ABJAD ENGINEERING WORKS"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "my-8",
								children: "\xA0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: "Authorised Signatory"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: `${cellBorder} p-1`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: "Payment :"
						}), " 100% against Performa Invoice"]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: `${cellBorder} p-1`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold",
								children: "Contact Person"
							}),
							" \xA0 ",
							c.contact_person ?? "—",
							" \xA0 \xA0",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold",
								children: "Mob. No."
							}),
							" \xA0 ",
							c.mobile ?? "",
							c.alt_mobile ? ` / ${c.alt_mobile}` : ""
						]
					}) })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 text-[10px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-bold",
					children: "DECLARATION."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: c.declaration ?? "WE DECLARE THAT THIS INVOICE SHOWS THE ACTUAL PRICE OF THE GOODS DESCRIBED THAT ALL PARTICULARS ARE TRUE AND CORRECT" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 text-[10px] italic text-gray-600",
				children: "1 | P a g e"
			})
		]
	});
}
//#endregion
export { InvoiceDetail as component };

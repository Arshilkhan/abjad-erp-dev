import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR, i as formatDate, n as billNo } from "./format-COxJqFG7.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { b as Plus } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Label, _ as SelectContent, b as SelectValue, f as DialogFooter, g as Select, l as Dialog, m as DialogTitle, p as DialogHeader, u as DialogContent, v as SelectItem, x as Textarea, y as SelectTrigger } from "./router-CkOQzNmy.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-CtMsPWeS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PaymentsPage() {
	const qc = useQueryClient();
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [selectedInvoice, setSelectedInvoice] = (0, import_react.useState)(null);
	const { data: outstanding = [] } = useQuery({
		queryKey: ["outstanding"],
		queryFn: async () => (await supabase.from("invoices").select("id, invoice_number, customer_name_snapshot, invoice_date, grand_total, amount_paid, status").in("status", ["sent", "partial"]).order("invoice_date", { ascending: true })).data ?? []
	});
	const { data: history = [] } = useQuery({
		queryKey: ["payment-history"],
		queryFn: async () => (await supabase.from("payments").select("*, invoices(invoice_number, customer_name_snapshot)").order("payment_date", { ascending: false }).limit(200)).data ?? []
	});
	const totalOutstanding = outstanding.reduce((a, r) => a + (Number(r.grand_total) - Number(r.amount_paid)), 0);
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const overdue = outstanding.filter((r) => r.invoice_date < today && Number(r.grand_total) > Number(r.amount_paid)).length;
	const openRecord = (inv) => {
		setSelectedInvoice(inv);
		setDialogOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Payments",
			description: "Track outstanding receivables and record payments."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Total Outstanding",
					value: formatINR(totalOutstanding),
					accent: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open Invoices",
					value: String(outstanding.length)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Overdue",
					value: String(overdue),
					accent: overdue ? "warning" : void 0
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "outstanding",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "outstanding",
					children: [
						"Outstanding (",
						outstanding.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "history",
					children: [
						"Payment History (",
						history.length,
						")"
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "outstanding",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Paid"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Due"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [outstanding.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 8,
							className: "py-8 text-center text-muted-foreground",
							children: "No outstanding invoices."
						}) }), outstanding.map((r) => {
							const due = Number(r.grand_total) - Number(r.amount_paid);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-mono",
									children: billNo(r.invoice_number)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customer_name_snapshot ?? "—" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(r.invoice_date) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right tabular-nums",
									children: formatINR(r.grand_total)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right tabular-nums",
									children: formatINR(r.amount_paid)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right tabular-nums font-semibold",
									children: formatINR(due)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "uppercase text-[10px]",
									children: r.status
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => openRecord(r),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-3 w-3" }), " Record Payment"]
									})
								})
							] }, r.id);
						})] })] })
					}) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "history",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mode" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Reference" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Amount"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [history.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 6,
							className: "py-8 text-center text-muted-foreground",
							children: "No payments recorded yet."
						}) }), history.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(p.payment_date) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-mono",
								children: billNo(p.invoices?.invoice_number)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.invoices?.customer_name_snapshot ?? "—" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "uppercase text-xs",
								children: p.mode
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-muted-foreground",
								children: p.reference ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right tabular-nums font-semibold",
								children: formatINR(p.amount)
							})
						] }, p.id))] })] })
					}) })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordPaymentDialog, {
			open: dialogOpen,
			onClose: () => setDialogOpen(false),
			invoice: selectedInvoice,
			onSaved: () => {
				qc.invalidateQueries({ queryKey: ["outstanding"] });
				qc.invalidateQueries({ queryKey: ["payment-history"] });
				qc.invalidateQueries({ queryKey: ["invoices"] });
			}
		})
	] });
}
function RecordPaymentDialog({ open, onClose, invoice, onSaved }) {
	const [amount, setAmount] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("bank_transfer");
	const [reference, setReference] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [notes, setNotes] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	if (!invoice) return null;
	const due = Number(invoice.grand_total) - Number(invoice.amount_paid);
	const save = async () => {
		const amt = Number(amount);
		if (!amt || amt <= 0) return toast.error("Enter a valid amount");
		if (amt > due + .01) return toast.error(`Amount cannot exceed due (${formatINR(due)})`);
		setSaving(true);
		const { error } = await supabase.from("payments").insert({
			invoice_id: invoice.id,
			payment_date: date,
			amount: amt,
			mode,
			reference: reference || null,
			notes: notes || null
		});
		setSaving(false);
		if (error) return toast.error(error.message);
		const { logInvoiceEvent } = await import("./invoice-history-DN84FPn5.mjs").then((n) => n.t).then((n) => n.t);
		await logInvoiceEvent(invoice.id, "payment_received", `Payment of ${formatINR(amt)} via ${mode}${reference ? ` (${reference})` : ""}`, {
			amount: amt,
			mode,
			reference
		});
		toast.success("Payment recorded");
		setAmount("");
		setReference("");
		setNotes("");
		onSaved();
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Record Payment — ", billNo(invoice.invoice_number)] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border bg-muted/40 p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Customer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: invoice.customer_name_snapshot })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: formatINR(invoice.grand_total)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Paid"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: formatINR(invoice.amount_paid)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Due" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: formatINR(due)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								placeholder: String(due)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: mode,
								onValueChange: setMode,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "cash",
										children: "Cash"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "bank_transfer",
										children: "Bank Transfer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "upi",
										children: "UPI"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "cheque",
										children: "Cheque"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "card",
										children: "Card"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "other",
										children: "Other"
									})
								] })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reference / Txn #" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: reference,
								onChange: (e) => setReference(e.target.value),
								placeholder: "Cheque no. / UTR / UPI ref"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						rows: 2
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: onClose,
				disabled: saving,
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: save,
				disabled: saving,
				children: saving ? "Saving…" : "Record Payment"
			})] })
		] })
	});
}
function Stat({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "relative overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute inset-y-0 left-0 w-1 ${accent === "warning" ? "bg-warning" : "bg-primary"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-2xl font-bold tabular-nums",
				children: value
			})]
		})]
	});
}
//#endregion
export { PaymentsPage as component };

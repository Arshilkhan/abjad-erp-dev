import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR, i as formatDate, n as billNo } from "./format-COxJqFG7.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { V as Download } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Label } from "./router-CkOQzNmy.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-Dp2UXOFj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Reports",
		description: "Sales, GST, customer ledger, stock, cancellations, rejections, credits, charges — export to CSV."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "sales",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "flex flex-wrap h-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "sales",
						children: "Sales"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "gst",
						children: "GST (GSTR-1)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "ledger",
						children: "Customer Ledger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "stock",
						children: "Stock"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "outstanding",
						children: "Outstanding"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "cancelled",
						children: "Cancelled"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "rejected",
						children: "Rejected Items"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "credits",
						children: "Customer Credits"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "charges",
						children: "Charges"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "imports",
						children: "Imported"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "sales",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalesReport, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "gst",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GstReport, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "ledger",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerLedger, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "stock",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockReport, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "outstanding",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutstandingReport, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "cancelled",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CancelledReport, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "rejected",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RejectedReport, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "credits",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditsReport, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "charges",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChargesReport, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "imports",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportsReport, {})
			})
		]
	})] });
}
function downloadCSV(filename, rows) {
	if (!rows.length) return toast.error("No data to export");
	const headers = Object.keys(rows[0]);
	const esc = (v) => `"${String(v ?? "").replace(/"/g, "\"\"")}"`;
	const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function DateRange({ from, to, onFrom, onTo }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			children: "From"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "date",
			value: from,
			onChange: (e) => onFrom(e.target.value),
			className: "w-40"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			children: "To"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "date",
			value: to,
			onChange: (e) => onTo(e.target.value),
			className: "w-40"
		})] })]
	});
}
var startOfYear = () => {
	return `${(/* @__PURE__ */ new Date()).getFullYear()}-04-01`;
};
var today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
function SalesReport() {
	const [from, setFrom] = (0, import_react.useState)(startOfYear());
	const [to, setTo] = (0, import_react.useState)(today());
	const { data: rows = [] } = useQuery({
		queryKey: [
			"rep-sales",
			from,
			to
		],
		queryFn: async () => (await supabase.from("invoices").select("invoice_number, invoice_date, invoice_type, customer_name_snapshot, subtotal, sgst_amount, cgst_amount, igst_amount, grand_total, status").gte("invoice_date", from).lte("invoice_date", to).in("invoice_type", ["tax_invoice", "proforma"]).order("invoice_date")).data ?? []
	});
	const totals = rows.reduce((a, r) => ({
		net: a.net + Number(r.subtotal ?? 0),
		tax: a.tax + Number(r.sgst_amount ?? 0) + Number(r.cgst_amount ?? 0) + Number(r.igst_amount ?? 0),
		grand: a.grand + Number(r.grand_total ?? 0)
	}), {
		net: 0,
		tax: 0,
		grand: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center justify-between",
		children: ["Sales Report", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRange, {
				from,
				to,
				onFrom: setFrom,
				onTo: setTo
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => downloadCSV(`sales_${from}_${to}.csv`, rows),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " CSV"]
			})]
		})]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "p-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Type" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Taxable"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Tax"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Total"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
			rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 7,
				className: "py-6 text-center text-muted-foreground",
				children: "No sales in range."
			}) }),
			rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-mono",
					children: billNo(r.invoice_number)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(r.invoice_date) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-xs uppercase",
					children: r.invoice_type
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customer_name_snapshot }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums",
					children: formatINR(r.subtotal)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums",
					children: formatINR(Number(r.sgst_amount ?? 0) + Number(r.cgst_amount ?? 0) + Number(r.igst_amount ?? 0))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums font-semibold",
					children: formatINR(r.grand_total)
				})
			] }, i)),
			rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "bg-muted/40 font-semibold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 3,
						className: "text-right",
						children: "Totals"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: formatINR(totals.net)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: formatINR(totals.tax)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: formatINR(totals.grand)
					})
				]
			})
		] })] })
	})] });
}
function CancelledReport() {
	const [from, setFrom] = (0, import_react.useState)(startOfYear());
	const [to, setTo] = (0, import_react.useState)(today());
	const { data: rows = [] } = useQuery({
		queryKey: [
			"rep-cancelled",
			from,
			to
		],
		queryFn: async () => (await supabase.from("invoices").select("invoice_number, invoice_date, customer_name_snapshot, grand_total, cancelled_at, cancellation_reason").eq("status", "cancelled").gte("invoice_date", from).lte("invoice_date", to).order("cancelled_at", { ascending: false })).data ?? []
	});
	const total = rows.reduce((s, r) => s + Number(r.grand_total), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center justify-between text-base",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Cancelled Invoices • Total ", formatINR(total)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "outline",
			onClick: () => downloadCSV(`cancelled-${from}-${to}.csv`, rows),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " CSV"]
		})]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRange, {
		from,
		to,
		onFrom: setFrom,
		onTo: setTo
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Total"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Cancelled" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Reason" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-mono text-xs",
				children: billNo(r.invoice_number)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(r.invoice_date) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customer_name_snapshot }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right tabular-nums",
				children: formatINR(r.grand_total)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.cancelled_at ? formatDate(r.cancelled_at) : "—" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "max-w-[240px] truncate text-muted-foreground",
				children: r.cancellation_reason ?? "—"
			})
		] }, i)) })]
	})] })] });
}
function RejectedReport() {
	const [from, setFrom] = (0, import_react.useState)(startOfYear());
	const [to, setTo] = (0, import_react.useState)(today());
	const { data: rows = [] } = useQuery({
		queryKey: [
			"rep-rejected",
			from,
			to
		],
		queryFn: async () => (await supabase.from("invoice_rejections").select("*, invoices(invoice_number, customer_name_snapshot), invoice_items(description)").gte("created_at", from).lte("created_at", `${to}T23:59:59`).order("created_at", { ascending: false })).data ?? []
	});
	const flat = rows.map((r) => ({
		date: formatDate(r.created_at),
		invoice: billNo(r.invoices?.invoice_number),
		customer: r.invoices?.customer_name_snapshot,
		item: r.invoice_items?.description,
		quantity: r.rejected_quantity,
		reason: r.rejection_reason,
		rejected_value: r.rejected_value,
		gst_deduction: r.gst_deduction,
		total_deduction: r.total_deduction
	}));
	const total = flat.reduce((s, r) => s + Number(r.total_deduction), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center justify-between text-base",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Rejected Items • Deduction ", formatINR(total)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "outline",
			onClick: () => downloadCSV(`rejected-${from}-${to}.csv`, flat),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " CSV"]
		})]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRange, {
		from,
		to,
		onFrom: setFrom,
		onTo: setTo
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Item" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Qty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Reason" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Deduction"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: flat.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-xs",
				children: r.date
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-mono text-xs",
				children: r.invoice
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customer }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "max-w-[220px] truncate",
				children: r.item
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right tabular-nums",
				children: r.quantity
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.reason }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right font-semibold tabular-nums",
				children: formatINR(r.total_deduction)
			})
		] }, i)) })]
	})] })] });
}
function CreditsReport() {
	const { data: rows = [] } = useQuery({
		queryKey: ["rep-credits"],
		queryFn: async () => (await supabase.from("customer_credits").select("*, customers(name), invoices(invoice_number)").order("created_at", { ascending: false })).data ?? []
	});
	const flat = rows.map((r) => ({
		date: formatDate(r.created_at),
		customer: r.customers?.name,
		invoice: billNo(r.invoices?.invoice_number),
		credit_amount: r.credit_amount,
		status: r.status,
		notes: r.notes
	}));
	const total = flat.reduce((s, r) => s + Number(r.credit_amount), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center justify-between text-base",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Customer Credits • ", formatINR(total)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "outline",
			onClick: () => downloadCSV(`credits.csv`, flat),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " CSV"]
		})]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "text-right",
			children: "Credit"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Notes" })
	] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: flat.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "text-xs",
			children: r.date
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customer }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "font-mono text-xs",
			children: r.invoice
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "text-right font-semibold tabular-nums",
			children: formatINR(r.credit_amount)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "uppercase text-xs",
			children: r.status
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "max-w-[240px] truncate text-muted-foreground",
			children: r.notes
		})
	] }, i)) })] }) })] });
}
function ChargesReport() {
	const [from, setFrom] = (0, import_react.useState)(startOfYear());
	const [to, setTo] = (0, import_react.useState)(today());
	const { data: rows = [] } = useQuery({
		queryKey: [
			"rep-charges",
			from,
			to
		],
		queryFn: async () => (await supabase.from("invoices").select("invoice_number, invoice_date, customer_name_snapshot, freight, packing_charges, transportation_charges, delivery_charges, other_charges").gte("invoice_date", from).lte("invoice_date", to).order("invoice_date")).data ?? []
	});
	const totals = rows.reduce((a, r) => ({
		freight: a.freight + Number(r.freight ?? 0),
		packing: a.packing + Number(r.packing_charges ?? 0),
		transport: a.transport + Number(r.transportation_charges ?? 0),
		delivery: a.delivery + Number(r.delivery_charges ?? 0),
		other: a.other + Number(r.other_charges ?? 0)
	}), {
		freight: 0,
		packing: 0,
		transport: 0,
		delivery: 0,
		other: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center justify-between text-base",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Charges Breakdown" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "outline",
			onClick: () => downloadCSV(`charges-${from}-${to}.csv`, rows),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " CSV"]
		})]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRange, {
			from,
			to,
			onFrom: setFrom,
			onTo: setTo
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "my-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Freight",
					value: formatINR(totals.freight)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Packing",
					value: formatINR(totals.packing)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Transportation",
					value: formatINR(totals.transport)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Delivery",
					value: formatINR(totals.delivery)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Other",
					value: formatINR(totals.other)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Freight"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Packing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Transport"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Delivery"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Other"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-mono text-xs",
				children: billNo(r.invoice_number)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(r.invoice_date) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customer_name_snapshot }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right tabular-nums",
				children: formatINR(r.freight)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right tabular-nums",
				children: formatINR(r.packing_charges)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right tabular-nums",
				children: formatINR(r.transportation_charges)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right tabular-nums",
				children: formatINR(r.delivery_charges)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right tabular-nums",
				children: formatINR(r.other_charges)
			})
		] }, i)) })] })
	] })] });
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-semibold tabular-nums",
			children: value
		})]
	});
}
function ImportsReport() {
	const [from, setFrom] = (0, import_react.useState)(startOfYear());
	const [to, setTo] = (0, import_react.useState)(today());
	const { data: rows = [] } = useQuery({
		queryKey: [
			"rep-imports",
			from,
			to
		],
		queryFn: async () => (await supabase.from("invoices").select("invoice_number, invoice_date, customer_name_snapshot, grand_total, status, import_source").eq("is_imported", true).gte("invoice_date", from).lte("invoice_date", to).order("invoice_date", { ascending: false })).data ?? []
	});
	const total = rows.reduce((s, r) => s + Number(r.grand_total), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center justify-between text-base",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Imported Invoices • ", formatINR(total)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "outline",
			onClick: () => downloadCSV(`imports-${from}-${to}.csv`, rows),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " CSV"]
		})]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRange, {
		from,
		to,
		onFrom: setFrom,
		onTo: setTo
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Total"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Source" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-mono text-xs",
				children: billNo(r.invoice_number)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(r.invoice_date) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customer_name_snapshot }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right tabular-nums",
				children: formatINR(r.grand_total)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "uppercase text-xs",
				children: r.status
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-xs text-muted-foreground",
				children: r.import_source ?? "—"
			})
		] }, i)) })]
	})] })] });
}
function GstReport() {
	const [from, setFrom] = (0, import_react.useState)(startOfYear());
	const [to, setTo] = (0, import_react.useState)(today());
	const { data: rows = [] } = useQuery({
		queryKey: [
			"rep-gst",
			from,
			to
		],
		queryFn: async () => (await supabase.from("invoices").select("invoice_number, invoice_date, customer_name_snapshot, customer_gst_snapshot, subtotal, sgst_amount, cgst_amount, igst_amount, grand_total, is_igst").eq("invoice_type", "tax_invoice").gte("invoice_date", from).lte("invoice_date", to).order("invoice_date")).data ?? []
	});
	const totals = rows.reduce((a, r) => ({
		taxable: a.taxable + Number(r.subtotal ?? 0),
		sgst: a.sgst + Number(r.sgst_amount ?? 0),
		cgst: a.cgst + Number(r.cgst_amount ?? 0),
		igst: a.igst + Number(r.igst_amount ?? 0)
	}), {
		taxable: 0,
		sgst: 0,
		cgst: 0,
		igst: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center justify-between",
		children: ["GSTR-1 Summary", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRange, {
				from,
				to,
				onFrom: setFrom,
				onTo: setTo
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => downloadCSV(`gstr1_${from}_${to}.csv`, rows),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " CSV"]
			})]
		})]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "p-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer GSTIN" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Taxable"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "SGST"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "CGST"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "IGST"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
			rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 7,
				className: "py-6 text-center text-muted-foreground",
				children: "No tax invoices in range."
			}) }),
			rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-mono",
					children: billNo(r.invoice_number)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(r.invoice_date) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-mono text-xs",
					children: r.customer_gst_snapshot ?? "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums",
					children: formatINR(r.subtotal)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums",
					children: formatINR(r.sgst_amount)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums",
					children: formatINR(r.cgst_amount)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums",
					children: formatINR(r.igst_amount)
				})
			] }, i)),
			rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "bg-muted/40 font-semibold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 3,
						className: "text-right",
						children: "Totals"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: formatINR(totals.taxable)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: formatINR(totals.sgst)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: formatINR(totals.cgst)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: formatINR(totals.igst)
					})
				]
			})
		] })] })
	})] });
}
function CustomerLedger() {
	const { data: rows = [] } = useQuery({
		queryKey: ["rep-ledger"],
		queryFn: async () => (await supabase.from("invoices").select("customer_id, customer_name_snapshot, grand_total, amount_paid").eq("invoice_type", "tax_invoice")).data ?? []
	});
	const summary = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const r of rows) {
			const key = r.customer_id ?? r.customer_name_snapshot ?? "unknown";
			const cur = m.get(key) ?? {
				customer: r.customer_name_snapshot ?? "—",
				billed: 0,
				paid: 0
			};
			cur.billed += Number(r.grand_total ?? 0);
			cur.paid += Number(r.amount_paid ?? 0);
			m.set(key, cur);
		}
		return Array.from(m.values()).map((v) => ({
			...v,
			outstanding: v.billed - v.paid
		})).sort((a, b) => b.outstanding - a.outstanding);
	}, [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center justify-between",
		children: ["Customer Ledger", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "outline",
			onClick: () => downloadCSV(`ledger_${today()}.csv`, summary),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " CSV"]
		})]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "p-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Billed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Paid"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Outstanding"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [summary.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: 4,
			className: "py-6 text-center text-muted-foreground",
			children: "No data."
		}) }), summary.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customer }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right tabular-nums",
				children: formatINR(r.billed)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right tabular-nums",
				children: formatINR(r.paid)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: `text-right tabular-nums font-semibold ${r.outstanding > 0 ? "text-warning" : ""}`,
				children: formatINR(r.outstanding)
			})
		] }, i))] })] })
	})] });
}
function StockReport() {
	const { data: rows = [] } = useQuery({
		queryKey: ["rep-stock"],
		queryFn: async () => (await supabase.from("products").select("product_code, name, hsn_code, current_stock, min_stock, unit_price, uom").order("name")).data ?? []
	});
	const enriched = rows.map((r) => ({
		...r,
		value: Number(r.current_stock ?? 0) * Number(r.unit_price ?? 0),
		low: Number(r.current_stock ?? 0) <= Number(r.min_stock ?? 0)
	}));
	const totalValue = enriched.reduce((a, r) => a + r.value, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center justify-between",
		children: ["Stock Valuation", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "outline",
			onClick: () => downloadCSV(`stock_${today()}.csv`, enriched),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " CSV"]
		})]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "p-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Code" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "HSN" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Stock"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Rate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Value"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
			enriched.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "py-6 text-center text-muted-foreground",
				children: "No products."
			}) }),
			enriched.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: r.low ? "bg-warning/5" : "",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-xs",
						children: r.product_code
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [r.name, r.low && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-xs text-warning",
						children: "● low"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-xs",
						children: r.hsn_code ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right tabular-nums",
						children: [
							Number(r.current_stock ?? 0),
							" ",
							r.uom
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: formatINR(r.unit_price)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums font-semibold",
						children: formatINR(r.value)
					})
				]
			}, i)),
			enriched.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "bg-muted/40 font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 5,
					className: "text-right",
					children: "Total Stock Value"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums",
					children: formatINR(totalValue)
				})]
			})
		] })] })
	})] });
}
function OutstandingReport() {
	const { data: rows = [] } = useQuery({
		queryKey: ["rep-outstanding"],
		queryFn: async () => (await supabase.from("invoices").select("invoice_number, invoice_date, customer_name_snapshot, grand_total, amount_paid, status").in("status", ["sent", "partial"]).order("invoice_date")).data ?? []
	});
	const enriched = rows.map((r) => {
		const due = Number(r.grand_total) - Number(r.amount_paid);
		const days = Math.max(0, Math.floor((Date.now() - new Date(r.invoice_date).getTime()) / 864e5));
		return {
			...r,
			due,
			days
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center justify-between",
		children: ["Outstanding Receivables", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "outline",
			onClick: () => downloadCSV(`outstanding_${today()}.csv`, enriched),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " CSV"]
		})]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "p-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Age"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [enriched.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: 7,
			className: "py-6 text-center text-muted-foreground",
			children: "Nothing outstanding."
		}) }), enriched.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-mono",
				children: billNo(r.invoice_number)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(r.invoice_date) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.customer_name_snapshot }),
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
				children: formatINR(r.due)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
				className: `text-right ${r.days > 30 ? "text-warning font-semibold" : ""}`,
				children: [r.days, "d"]
			})
		] }, i))] })] })
	})] });
}
//#endregion
export { ReportsPage as component };

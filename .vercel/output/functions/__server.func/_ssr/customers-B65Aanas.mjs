import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR } from "./format-COxJqFG7.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { b as Plus, f as Trash2, g as Search, x as Pencil } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Label, f as DialogFooter, h as DialogTrigger, l as Dialog, m as DialogTitle, p as DialogHeader, u as DialogContent, x as Textarea } from "./router-CkOQzNmy.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-B65Aanas.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
	customer_name: "",
	company_name: "",
	billing_address: "",
	shipping_address: "",
	contact_person: "",
	mobile: "",
	email: "",
	gst_number: "",
	pan_number: "",
	state: "Maharashtra",
	state_code: "27",
	place_of_supply: "Maharashtra",
	credit_limit: 0,
	payment_terms: "30 Days",
	notes: ""
};
function CustomersPage() {
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({ ...empty });
	const { data: rows = [], isLoading } = useQuery({
		queryKey: ["customers"],
		queryFn: async () => {
			const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				...form,
				credit_limit: Number(form.credit_limit) || 0
			};
			if (editingId) {
				const { error } = await supabase.from("customers").update(payload).eq("id", editingId);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("customers").insert(payload);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			toast.success(editingId ? "Customer updated" : "Customer added");
			qc.invalidateQueries({ queryKey: ["customers"] });
			setOpen(false);
			setEditingId(null);
			setForm({ ...empty });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("customers").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: ["customers"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const filtered = rows.filter((r) => !search || [
		r.customer_name,
		r.company_name,
		r.gst_number,
		r.mobile,
		r.email
	].filter(Boolean).some((v) => v.toLowerCase().includes(search.toLowerCase())));
	const openEdit = (row) => {
		setEditingId(row.id);
		setForm({
			...empty,
			...row,
			credit_limit: row.credit_limit ?? 0
		});
		setOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Customers",
		description: `${rows.length} customer${rows.length === 1 ? "" : "s"} in your directory.`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open,
			onOpenChange: (o) => {
				setOpen(o);
				if (!o) {
					setEditingId(null);
					setForm({ ...empty });
				}
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " New Customer"] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingId ? "Edit Customer" : "New Customer" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2",
						children: [
							[
								["customer_name", "Customer Name *"],
								["company_name", "Company Name"],
								["contact_person", "Contact Person"],
								["mobile", "Mobile"],
								["email", "Email"],
								["gst_number", "GST Number"],
								["pan_number", "PAN Number"],
								["state", "State"],
								["state_code", "State Code"],
								["place_of_supply", "Place of Supply"],
								[
									"credit_limit",
									"Credit Limit (₹)",
									"number"
								],
								["payment_terms", "Payment Terms"]
							].map(([k, label, type]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: type ?? "text",
									value: form[k] ?? "",
									onChange: (e) => setForm({
										...form,
										[k]: e.target.value
									})
								})]
							}, k)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Billing Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: form.billing_address,
									onChange: (e) => setForm({
										...form,
										billing_address: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Shipping Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: form.shipping_address,
									onChange: (e) => setForm({
										...form,
										shipping_address: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: form.notes,
									onChange: (e) => setForm({
										...form,
										notes: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => save.mutate(),
						disabled: !form.customer_name || save.isPending,
						children: save.isPending ? "Saving…" : "Save Customer"
					})] })
				]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2 border-b p-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search by name, GST, mobile…",
					className: "h-9 pl-9",
					value: search,
					onChange: (e) => setSearch(e.target.value)
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Contact" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "GST" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "State" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Credit Limit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-24" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "text-center text-muted-foreground py-8",
				children: "Loading…"
			}) }),
			!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "text-center text-muted-foreground py-8",
				children: "No customers found."
			}) }),
			filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: r.customer_name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: r.company_name
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm",
					children: r.contact_person ?? "—"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						r.mobile,
						" ",
						r.email && `• ${r.email}`
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-mono text-xs",
					children: r.gst_number ?? "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: r.state
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [
							"(",
							r.state_code,
							")"
						]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums",
					children: formatINR(r.credit_limit)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: () => openEdit(r),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: () => confirm("Delete this customer?") && remove.mutate(r.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
					})]
				}) })
			] }, r.id))
		] })] })]
	}) })] });
}
//#endregion
export { CustomersPage as component };

import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR } from "./format-COxJqFG7.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { b as Plus, f as Trash2, g as Search, u as TriangleAlert, x as Pencil } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Label, f as DialogFooter, h as DialogTrigger, l as Dialog, m as DialogTitle, p as DialogHeader, u as DialogContent, x as Textarea } from "./router-CkOQzNmy.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-LQTLaIUW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
	product_name: "",
	product_code: "",
	hsn_code: "",
	description: "",
	unit: "NOS",
	gst_percentage: 18,
	selling_price: 0,
	purchase_price: 0,
	stock_quantity: 0,
	minimum_stock: 0,
	maximum_stock: 0,
	drawing_number: "",
	material: "",
	weight: 0,
	dimensions: ""
};
function ProductsPage() {
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({ ...empty });
	const { data: rows = [], isLoading } = useQuery({
		queryKey: ["products"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("*").order("product_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				...form,
				gst_percentage: Number(form.gst_percentage) || 0,
				selling_price: Number(form.selling_price) || 0,
				purchase_price: Number(form.purchase_price) || 0,
				stock_quantity: Number(form.stock_quantity) || 0,
				minimum_stock: Number(form.minimum_stock) || 0,
				maximum_stock: Number(form.maximum_stock) || 0,
				weight: Number(form.weight) || null
			};
			if (editingId) {
				const { error } = await supabase.from("products").update(payload).eq("id", editingId);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("products").insert(payload);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			toast.success(editingId ? "Product updated" : "Product added");
			qc.invalidateQueries({ queryKey: ["products"] });
			setOpen(false);
			setEditingId(null);
			setForm({ ...empty });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("products").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const filtered = rows.filter((r) => !search || [
		r.product_name,
		r.product_code,
		r.hsn_code,
		r.material
	].filter(Boolean).some((v) => v.toLowerCase().includes(search.toLowerCase())));
	const openEdit = (row) => {
		setEditingId(row.id);
		setForm({
			...empty,
			...row
		});
		setOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Products",
		description: `${rows.length} products in catalog.`,
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
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " New Product"] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingId ? "Edit Product" : "New Product" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-3",
						children: [[
							["product_name", "Product Name *"],
							["product_code", "Product Code"],
							["hsn_code", "HSN Code"],
							["unit", "Unit (NOS/KG/M)"],
							[
								"gst_percentage",
								"GST %",
								"number"
							],
							[
								"selling_price",
								"Selling Price (₹)",
								"number"
							],
							[
								"purchase_price",
								"Purchase Price (₹)",
								"number"
							],
							[
								"stock_quantity",
								"Stock Qty",
								"number"
							],
							[
								"minimum_stock",
								"Minimum Stock",
								"number"
							],
							[
								"maximum_stock",
								"Maximum Stock",
								"number"
							],
							["drawing_number", "Drawing Number"],
							["material", "Material"],
							[
								"weight",
								"Weight (kg)",
								"number"
							],
							["dimensions", "Dimensions"]
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
						}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 sm:col-span-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => save.mutate(),
						disabled: !form.product_name || save.isPending,
						children: save.isPending ? "Saving…" : "Save Product"
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
					placeholder: "Search by name, code, HSN…",
					className: "h-9 pl-9",
					value: search,
					onChange: (e) => setSearch(e.target.value)
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "HSN" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Rate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "GST"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Stock"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-24" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "py-8 text-center text-muted-foreground",
				children: "Loading…"
			}) }),
			!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "py-8 text-center text-muted-foreground",
				children: "No products."
			}) }),
			filtered.map((r) => {
				const low = Number(r.stock_quantity) <= Number(r.minimum_stock) && Number(r.minimum_stock) > 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: r.product_name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground font-mono",
						children: [r.product_code ?? "—", r.material && ` • ${r.material}`]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-xs",
						children: r.hsn_code ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: formatINR(r.selling_price)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right tabular-nums",
						children: [r.gst_percentage, "%"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right tabular-nums",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [
								low && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-warning" }),
								r.stock_quantity,
								" ",
								r.unit
							]
						}), low && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "ml-1 text-[10px]",
							children: "Low"
						})]
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
							onClick: () => confirm("Delete this product?") && remove.mutate(r.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})]
					}) })
				] }, r.id);
			})
		] })] })]
	}) })] });
}
//#endregion
export { ProductsPage as component };

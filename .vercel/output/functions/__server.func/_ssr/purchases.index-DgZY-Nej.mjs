import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR, i as formatDate, t as amountInWords } from "./format-COxJqFG7.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as useServerFn } from "./createSsrRpc-CYA_x1QZ.mjs";
import { T as Mail, V as Download, b as Plus, f as Trash2 } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Label, _ as SelectContent, b as SelectValue, c as TypeaheadInput, f as DialogFooter, g as Select, l as Dialog, m as DialogTitle, p as DialogHeader, s as sendPoEmail, u as DialogContent, v as SelectItem, x as Textarea, y as SelectTrigger } from "./router-CkOQzNmy.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/purchases.index-DgZY-Nej.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var nl2br = (v) => esc(v).replace(/\n/g, "<br/>");
/** Builds a Tally-style Purchase Order HTML document (A4, print ready). */
function buildPOHtml(po, items, company, vendor) {
	const companyBlock = [
		esc(company?.name ?? "Company"),
		nl2br(company?.address),
		[
			company?.city,
			company?.state,
			company?.pincode
		].filter(Boolean).map(esc).join(", "),
		company?.email ? `E-Mail : ${esc(company.email)}` : ""
	].filter(Boolean).join("<br/>");
	const supplierBlock = [
		esc(po.vendor_name_snapshot ?? vendor?.vendor_name ?? "—"),
		nl2br(po.vendor_address_snapshot ?? vendor?.address),
		vendor?.email ? `E-Mail : ${esc(vendor.email)}` : "",
		vendor?.mobile ? `Mobile : ${esc(vendor.mobile)}` : ""
	].filter(Boolean).join("<br/>");
	const taxTotal = Number(po.igst_amount ?? 0) + Number(po.cgst_amount ?? 0) + Number(po.sgst_amount ?? 0);
	const qtyTotal = items.reduce((a, i) => a + Number(i.quantity ?? 0), 0);
	const rows = items.map((it, idx) => `
      <tr>
        <td class="c">${idx + 1}</td>
        <td><strong>${esc(it.description)}</strong>${it.hsn_code ? `<br/><span class="muted">HSN: ${esc(it.hsn_code)}</span>` : ""}</td>
        <td class="c">${po.expected_date ? esc(formatDate(po.expected_date)) : esc(formatDate(po.po_date))}</td>
        <td class="r">${Number(it.quantity ?? 0).toLocaleString("en-IN")} ${esc(it.uom ?? "nos")}</td>
        <td class="r">${formatINR(it.unit_rate, { withSymbol: false })}</td>
        <td class="c">${esc(it.uom ?? "nos")}</td>
        <td class="r">${Number(it.tax_pct ?? 0)} %</td>
        <td class="r">${formatINR(Number(it.quantity ?? 0) * Number(it.unit_rate ?? 0), { withSymbol: false })}</td>
      </tr>`).join("");
	const taxRows = po.is_igst ? `<tr><td></td><td>IGST</td><td></td><td></td><td></td><td></td><td class="r"></td><td class="r">${formatINR(po.igst_amount, { withSymbol: false })}</td></tr>` : `<tr><td></td><td>CGST</td><td></td><td></td><td></td><td></td><td class="r"></td><td class="r">${formatINR(po.cgst_amount, { withSymbol: false })}</td></tr>
       <tr><td></td><td>SGST</td><td></td><td></td><td></td><td></td><td class="r"></td><td class="r">${formatINR(po.sgst_amount, { withSymbol: false })}</td></tr>`;
	return `<!doctype html>
<html><head><meta charset="utf-8"/>
<title>PO ${esc(po.po_number)}</title>
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #000; margin: 0; }
  h1 { text-align: center; font-size: 15px; letter-spacing: 1px; margin: 0 0 8px; }
  table { width: 100%; border-collapse: collapse; }
  td, th { border: 1px solid #000; padding: 4px 6px; vertical-align: top; }
  th { font-size: 10px; text-align: left; font-weight: bold; }
  .c { text-align: center; }
  .r { text-align: right; }
  .muted { color: #444; font-size: 10px; }
  .lbl { font-size: 10px; font-weight: bold; }
  .items td { height: 18px; }
  .items .filler td { border-top: none; border-bottom: none; height: 90px; }
  .totals td { font-weight: bold; }
  .foot { margin-top: 8px; display: flex; justify-content: space-between; gap: 12px; }
  .sign { text-align: right; min-width: 200px; }
  .jur { text-align: center; margin-top: 10px; font-size: 10px; }
  .words { border: 1px solid #000; padding: 5px 6px; margin-top: 6px; }
</style></head>
<body>
  <h1>PURCHASE ORDER</h1>
  <table>
    <tr>
      <td rowspan="3" style="width:45%"><span class="lbl">Invoice To/Dispatch to</span><br/>${supplierBlock}</td>
      <td style="width:27%"><span class="lbl">Voucher No.</span><br/>${esc(po.po_number)}</td>
      <td style="width:28%"><span class="lbl">Dated</span><br/>${esc(formatDate(po.po_date))}</td>
    </tr>
    <tr>
      <td><span class="lbl">Mode/Terms of Payment</span><br/>${esc(vendor?.payment_terms ?? "—")}</td>
      <td><span class="lbl">Expected Delivery</span><br/>${po.expected_date ? esc(formatDate(po.expected_date)) : "—"}</td>
    </tr>
    <tr>
      <td><span class="lbl">Supplier's GSTIN</span><br/>${esc(po.vendor_gst_snapshot ?? vendor?.gst_number ?? "—")}</td>
      <td><span class="lbl">Company's GSTIN</span><br/>${esc(company?.gst_number ?? "—")}</td>
    </tr>
    <tr>
      <td rowspan="2"><span class="lbl">Supplier</span><br/>${companyBlock}</td>
      <td><span class="lbl">Status</span><br/>${esc(String(po.status ?? "").toUpperCase())}</td>
      <td><span class="lbl">Tax Type</span><br/>${po.is_igst ? "IGST" : "CGST + SGST"}</td>
    </tr>
    <tr>
      <td colspan="2"><span class="lbl">Other Reference(s)</span><br/>${nl2br(po.notes ?? "—")}</td>
    </tr>
  </table>

  <table class="items" style="margin-top:6px">
    <thead>
      <tr>
        <th class="c" style="width:6%">Sl No.</th>
        <th>Description of Goods</th>
        <th class="c" style="width:11%">Due on</th>
        <th class="r" style="width:11%">Quantity</th>
        <th class="r" style="width:10%">Rate</th>
        <th class="c" style="width:7%">per</th>
        <th class="r" style="width:8%">Tax %</th>
        <th class="r" style="width:13%">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${rows || `<tr><td colspan="8" class="c">No line items</td></tr>`}
      <tr class="filler"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td class="r" colspan="6">Net Value</td><td class="r">${formatINR(po.net_value, { withSymbol: false })}</td></tr>
      ${taxRows}
      ${Number(po.round_off ?? 0) !== 0 ? `<tr><td></td><td>Round Off</td><td></td><td></td><td></td><td></td><td></td><td class="r">${formatINR(po.round_off, { withSymbol: false })}</td></tr>` : ""}
      <tr class="totals">
        <td></td><td>Total</td><td></td>
        <td class="r">${qtyTotal.toLocaleString("en-IN")}</td>
        <td></td><td></td>
        <td class="r">${formatINR(taxTotal, { withSymbol: false })}</td>
        <td class="r">₹ ${formatINR(po.grand_total, { withSymbol: false })}</td>
      </tr>
    </tbody>
  </table>

  <div class="words"><span class="lbl">Amount Chargeable (in words)</span><br/>${esc(amountInWords(Number(po.grand_total ?? 0)))}<br/><span class="muted">E. &amp; O.E</span></div>

  <div class="foot">
    <div class="muted">
      ${company?.pan_number ? `Company's PAN : ${esc(company.pan_number)}<br/>` : ""}
      ${po.vendor_gst_snapshot || vendor?.gst_number ? `Supplier's GSTIN : ${esc(po.vendor_gst_snapshot ?? vendor?.gst_number)}<br/>` : ""}
      ${vendor?.pan_number ? `Supplier's PAN : ${esc(vendor.pan_number)}` : ""}
    </div>
    <div class="sign">
      for ${esc(po.vendor_name_snapshot ?? vendor?.vendor_name ?? vendor?.company_name ?? "Supplier")}<br/><br/><br/>
      Authorised Signatory
    </div>
  </div>
  <div class="jur">SUBJECT TO ${esc((company?.city ?? "").toUpperCase() || "LOCAL")} JURISDICTION</div>
</body></html>`;
}
/** Opens the PO in a new window and triggers the browser print/save-as-PDF dialog. */
function printPOHtml(html) {
	const w = window.open("", "_blank", "width=900,height=1000");
	if (!w) return false;
	w.document.open();
	w.document.write(html);
	w.document.close();
	w.focus();
	setTimeout(() => w.print(), 400);
	return true;
}
function PurchaseOrderTable({ rows, isLoading, onRowClick }) {
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
				case "po":
					comparison = String(a.po_number ?? "").localeCompare(String(b.po_number ?? ""), void 0, { numeric: true });
					break;
				case "vendor":
					comparison = String(a.vendor_name_snapshot ?? "").localeCompare(String(b.vendor_name_snapshot ?? ""));
					break;
				case "date":
					comparison = new Date(a.po_date).getTime() - new Date(b.po_date).getTime();
					break;
				case "total":
					comparison = Number(a.grand_total ?? 0) - Number(b.grand_total ?? 0);
					break;
				case "expected": comparison = new Date(a.expected_date ?? 0).getTime() - new Date(b.expected_date ?? 0).getTime();
			}
			return sortDirection === "asc" ? comparison : -comparison;
		});
	}, [
		rows,
		sortField,
		sortDirection
	]);
	const statusColor = {
		draft: "bg-muted text-muted-foreground",
		sent: "bg-secondary text-secondary-foreground",
		received: "bg-[color:oklch(0.92_0.06_155)] text-[color:oklch(0.35_0.14_155)]",
		cancelled: "bg-destructive/10 text-destructive"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "cursor-pointer select-none",
			onClick: () => handleSort("po"),
			children: "PO #"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "cursor-pointer select-none",
			onClick: () => handleSort("date"),
			children: "Date"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "cursor-pointer select-none",
			onClick: () => handleSort("vendor"),
			children: "Vendor"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "cursor-pointer select-none text-right",
			onClick: () => handleSort("total"),
			children: "Total"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "cursor-pointer select-none",
			onClick: () => handleSort("expected"),
			children: "Expected"
		})
	] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
		isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: 6,
			className: "py-8 text-center text-muted-foreground",
			children: "Loading…"
		}) }),
		!isLoading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: 6,
			className: "py-10 text-center text-muted-foreground",
			children: "No purchase orders yet."
		}) }),
		sortedRows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
			className: onRowClick ? "cursor-pointer hover:bg-muted/40" : "hover:bg-muted/40",
			onClick: () => onRowClick?.(r),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-mono text-sm font-medium",
					children: r.po_number ?? "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(r.po_date) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.vendor_name_snapshot ?? "—" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right tabular-nums font-semibold",
					children: formatINR(r.grand_total)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: `text-[10px] uppercase ${statusColor[r.status] ?? ""}`,
					children: r.status ?? "—"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.expected_date ? formatDate(r.expected_date) : "—" })
			]
		}, r.id))
	] })] });
}
function PurchasesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Purchases",
		description: "Vendor directory and purchase orders."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "orders",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
				value: "orders",
				children: "Purchase Orders"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
				value: "vendors",
				children: "Vendors"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "orders",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PurchaseOrdersTab, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "vendors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorsTab, {})
			})
		]
	})] });
}
function VendorsTab() {
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { data: vendors = [] } = useQuery({
		queryKey: ["vendors"],
		queryFn: async () => (await supabase.from("vendors").select("*").order("vendor_name")).data ?? []
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => {
						setEditing(null);
						setOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), "Add Vendor"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Vendor" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Contact" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "GSTIN" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mobile" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "City / State" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Terms" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [vendors.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "py-8 text-center text-muted-foreground",
				children: "No vendors yet."
			}) }), vendors.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "cursor-pointer",
				onClick: () => {
					setEditing(v);
					setOpen(true);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "font-medium",
						children: [v.vendor_name, v.company_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: v.company_name
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: v.contact_person ?? "—" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-xs",
						children: v.gst_number ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: v.mobile ?? "—" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-xs",
						children: [v.city, v.state].filter(Boolean).join(", ") || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-xs",
						children: v.payment_terms ?? "—"
					})
				]
			}, v.id))] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorDialog, {
				open,
				onClose: () => setOpen(false),
				vendor: editing,
				onSaved: () => qc.invalidateQueries({ queryKey: ["vendors"] })
			})
		]
	}) });
}
function VendorDialog({ open, onClose, vendor, onSaved }) {
	const isEdit = !!vendor;
	const [form, setForm] = (0, import_react.useState)(vendor ?? {});
	const key = vendor?.id ?? "new";
	if (form.__key !== key) setForm({
		...vendor ?? {},
		__key: key
	});
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	const save = async () => {
		if (!form.vendor_name) return toast.error("Vendor name is required");
		const { __key, id, created_at, updated_at, created_by, ...payload } = form;
		if (isEdit) {
			const { error } = await supabase.from("vendors").update(payload).eq("id", vendor.id);
			if (error) return toast.error(error.message);
		} else {
			const { error } = await supabase.from("vendors").insert(payload);
			if (error) return toast.error(error.message);
		}
		toast.success(isEdit ? "Vendor updated" : "Vendor added");
		onSaved();
		onClose();
	};
	const del = async () => {
		if (!confirm("Delete this vendor?")) return;
		const { error } = await supabase.from("vendors").delete().eq("id", vendor.id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		onSaved();
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: isEdit ? "Edit Vendor" : "Add Vendor" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vendor Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.vendor_name ?? "",
							onChange: (e) => set("vendor_name", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Company Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.company_name ?? "",
							onChange: (e) => set("company_name", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Contact Person" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.contact_person ?? "",
							onChange: (e) => set("contact_person", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mobile" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.mobile ?? "",
							onChange: (e) => set("mobile", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.email ?? "",
							onChange: (e) => set("email", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "GSTIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.gst_number ?? "",
							onChange: (e) => set("gst_number", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PAN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.pan_number ?? "",
							onChange: (e) => set("pan_number", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.state ?? "",
							onChange: (e) => set("state", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.state_code ?? "",
							onChange: (e) => set("state_code", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.city ?? "",
							onChange: (e) => set("city", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: form.address ?? "",
								onChange: (e) => set("address", e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bank Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.bank_name ?? "",
							onChange: (e) => set("bank_name", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Account No." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.bank_account ?? "",
							onChange: (e) => set("bank_account", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "IFSC" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.bank_ifsc ?? "",
							onChange: (e) => set("bank_ifsc", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment Terms" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.payment_terms ?? "",
							onChange: (e) => set("payment_terms", e.target.value)
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "flex justify-between sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: isEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "destructive",
						size: "sm",
						onClick: del,
						children: "Delete"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: onClose,
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: save,
							children: isEdit ? "Save" : "Add Vendor"
						})]
					})]
				})
			]
		})
	});
}
function PurchaseOrdersTab() {
	const qc = useQueryClient();
	const [viewing, setViewing] = (0, import_react.useState)(null);
	const { data: pos = [] } = useQuery({
		queryKey: ["purchase_orders"],
		queryFn: async () => (await supabase.from("purchase_orders").select("*").order("po_date", { ascending: false })).data ?? []
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PurchaseOrderTable, {
			rows: pos,
			onRowClick: setViewing
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewPODialog, {
			po: viewing,
			onClose: () => setViewing(null),
			onSent: () => qc.invalidateQueries({ queryKey: ["purchase_orders"] })
		})]
	}) });
}
var emptyLine = () => ({
	product_id: null,
	product_name: "",
	description: "",
	hsn: "",
	qty: 1,
	rate: 0,
	tax_pct: 18
});
function NewPODialog({ open, onClose, onSaved }) {
	const qc = useQueryClient();
	const { data: vendors = [] } = useQuery({
		queryKey: ["vendors-select"],
		queryFn: async () => (await supabase.from("vendors").select("*").order("vendor_name")).data ?? []
	});
	const { data: products = [] } = useQuery({
		queryKey: ["products-po-select"],
		queryFn: async () => (await supabase.from("products").select("*").order("product_name")).data ?? []
	});
	const productOptions = products.map((p) => ({
		id: p.id,
		label: p.product_name ?? "",
		sublabel: p.hsn_code ?? void 0
	}));
	const [poNumber, setPoNumber] = (0, import_react.useState)("");
	const [poDate, setPoDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [expected, setExpected] = (0, import_react.useState)("");
	const [vendorId, setVendorId] = (0, import_react.useState)("");
	const [vendor, setVendor] = (0, import_react.useState)({});
	const setV = (k, v) => setVendor((f) => ({
		...f,
		[k]: v
	}));
	const [isIgst, setIsIgst] = (0, import_react.useState)(false);
	const [notes, setNotes] = (0, import_react.useState)("");
	const [lines, setLines] = (0, import_react.useState)([emptyLine()]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const emailPo = useServerFn(sendPoEmail);
	const isNewVendor = !vendorId && !!(vendor.vendor_name ?? "").trim();
	const pickVendor = (id) => {
		const v = vendors.find((x) => x.id === id);
		if (!v) return;
		setVendorId(v.id);
		setVendor({ ...v });
	};
	const addLine = () => setLines((l) => [...l, emptyLine()]);
	const rmLine = (i) => setLines((l) => l.filter((_, idx) => idx !== i));
	const setLine = (i, k, v) => setLines((l) => l.map((r, idx) => idx === i ? {
		...r,
		[k]: v
	} : r));
	const netValue = lines.reduce((a, l) => a + Number(l.qty) * Number(l.rate), 0);
	const totalTax = lines.reduce((a, l) => a + Number(l.qty) * Number(l.rate) * Number(l.tax_pct) / 100, 0);
	const sgst = isIgst ? 0 : totalTax / 2;
	const cgst = isIgst ? 0 : totalTax / 2;
	const igst = isIgst ? totalTax : 0;
	const rawTotal = netValue + totalTax;
	const rounded = Math.round(rawTotal);
	const roundOff = rounded - rawTotal;
	const save = async (send = false) => {
		if (saving) return;
		if (!poNumber.trim()) return toast.error("PO number required");
		const name = (vendor.vendor_name ?? "").trim();
		if (!name) return toast.error("Vendor name is required");
		if (lines.some((l) => !l.product_name.trim() && !l.description.trim())) return toast.error("Every line needs a product name");
		setSaving(true);
		try {
			let vId = vendorId;
			if (!vId) {
				const existing = vendors.find((v) => (v.vendor_name ?? "").toLowerCase() === name.toLowerCase());
				if (existing) vId = existing.id;
				else {
					const { data: newVendor, error: vErr } = await supabase.from("vendors").insert({
						vendor_name: name,
						company_name: vendor.company_name || null,
						contact_person: vendor.contact_person || null,
						mobile: vendor.mobile || null,
						email: vendor.email || null,
						gst_number: vendor.gst_number || null,
						pan_number: vendor.pan_number || null,
						address: vendor.address || null,
						state: vendor.state || null,
						state_code: vendor.state_code || null,
						payment_terms: vendor.payment_terms || null
					}).select("id").single();
					if (vErr || !newVendor) {
						toast.error(vErr?.message ?? "Could not create vendor");
						return;
					}
					vId = newVendor.id;
					qc.invalidateQueries({ queryKey: ["vendors"] });
					qc.invalidateQueries({ queryKey: ["vendors-select"] });
					toast.success(`Vendor "${name}" added`);
				}
			}
			const { data: po, error } = await supabase.from("purchase_orders").insert({
				po_number: poNumber.trim(),
				po_date: poDate,
				expected_date: expected || null,
				vendor_id: vId,
				vendor_name_snapshot: name,
				vendor_gst_snapshot: vendor.gst_number || null,
				vendor_address_snapshot: vendor.address || null,
				is_igst: isIgst,
				net_value: netValue,
				sub_total: netValue,
				sgst_amount: sgst,
				cgst_amount: cgst,
				igst_amount: igst,
				round_off: roundOff,
				grand_total: rounded,
				notes: notes || null,
				status: send ? "sent" : "draft"
			}).select("*").single();
			if (error || !po) {
				toast.error(error?.message?.includes("duplicate key") ? `PO number "${poNumber}" already exists` : error?.message ?? "Could not create purchase order");
				return;
			}
			const items = lines.map((l, i) => ({
				purchase_order_id: po.id,
				sr_no: i + 1,
				product_id: l.product_id,
				description: [l.product_name.trim(), l.description.trim()].filter(Boolean).join(" — "),
				hsn_code: l.hsn || null,
				quantity: Number(l.qty) || 0,
				unit_rate: Number(l.rate) || 0,
				tax_pct: Number(l.tax_pct) || 0,
				tax_amount: Number(l.qty) * Number(l.rate) * Number(l.tax_pct) / 100,
				total_amount: Number(l.qty) * Number(l.rate) * (1 + Number(l.tax_pct) / 100)
			}));
			const { error: iErr } = await supabase.from("purchase_order_items").insert(items);
			if (iErr) {
				toast.error(iErr.message);
				return;
			}
			if (send) {
				await supabase.from("company_profile").select("*").limit(1).maybeSingle();
				if (vendor.email) try {
					const res = await emailPo({ data: { poId: po.id } });
					if (res?.sent) toast.success(`PO emailed to ${res.email}`);
					else toast.warning(`PO saved, but the email was not sent (${res?.reason ?? "unknown"})`);
				} catch (e) {
					toast.error(`PO saved, but the email could not be sent: ${e?.message ?? "unknown error"}`);
				}
				else toast.warning("PO saved and marked sent, but this vendor has no email on file");
			} else toast.success("Purchase order saved as draft");
			setPoNumber("");
			setNotes("");
			setVendorId("");
			setVendor({});
			setLines([emptyLine()]);
			onSaved();
			onClose();
		} catch (e) {
			console.error("PO save failed", e);
			toast.error(e?.message ?? "Something went wrong while saving");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[calc(100vw-1rem)] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New Purchase Order" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-4 [&>div]:min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PO Number *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: poNumber,
							onChange: (e) => setPoNumber(e.target.value),
							placeholder: "PO-2026-001"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PO Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: poDate,
							onChange: (e) => setPoDate(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Expected" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: expected,
							onChange: (e) => setExpected(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tax Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: isIgst ? "igst" : "sgst",
							onValueChange: (v) => setIsIgst(v === "igst"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "sgst",
								children: "SGST + CGST (intra-state)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "igst",
								children: "IGST (inter-state)"
							})] })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vendor Name *" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeaheadInput, {
									value: vendor.vendor_name ?? "",
									onChange: (v) => {
										setVendorId("");
										setV("vendor_name", v);
									},
									onSelect: (o) => pickVendor(o.id),
									options: vendors.map((v) => ({
										id: v.id,
										label: v.vendor_name,
										sublabel: v.company_name ?? v.gst_number ?? void 0
									})),
									placeholder: "Type to search or add new vendor"
								}),
								isNewVendor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "New vendor — will be saved for reuse."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Company Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: vendor.company_name ?? "",
								onChange: (e) => setV("company_name", e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Contact Person" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.contact_person ?? "",
							onChange: (e) => setV("contact_person", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mobile" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.mobile ?? "",
							onChange: (e) => setV("mobile", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.email ?? "",
							onChange: (e) => setV("email", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "GSTIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.gst_number ?? "",
							onChange: (e) => setV("gst_number", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PAN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.pan_number ?? "",
							onChange: (e) => setV("pan_number", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.state ?? "",
							onChange: (e) => setV("state", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.state_code ?? "",
							onChange: (e) => setV("state_code", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment Terms" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.payment_terms ?? "",
							onChange: (e) => setV("payment_terms", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 sm:col-span-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: vendor.address ?? "",
								onChange: (e) => setV("address", e.target.value)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Line Items" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							onClick: addLine,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-3 w-3" }), "Add Line"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-md border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[700px] text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted/50 text-xs uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 text-left",
										children: "Product Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 text-left",
										children: "Description"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 w-20",
										children: "HSN"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 w-20",
										children: "Qty"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 w-24",
										children: "Rate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 w-20",
										children: "GST%"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 w-24 text-right",
										children: "Total"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-2 w-10" })
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeaheadInput, {
											value: l.product_name,
											options: productOptions,
											placeholder: "Product name",
											onChange: (v) => setLines((ls) => ls.map((r, idx) => idx === i ? {
												...r,
												product_name: v,
												product_id: null
											} : r)),
											onSelect: (opt) => {
												const p = products.find((x) => x.id === opt.id);
												setLines((ls) => ls.map((r, idx) => idx === i ? {
													...r,
													product_id: opt.id,
													product_name: opt.label,
													description: r.description || (p?.description ?? ""),
													hsn: r.hsn || (p?.hsn_code ?? ""),
													rate: r.rate || Number(p?.purchase_price ?? 0),
													tax_pct: p?.gst_percentage != null ? Number(p.gst_percentage) : r.tax_pct
												} : r));
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: l.description,
											onChange: (e) => setLine(i, "description", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: l.hsn,
											onChange: (e) => setLine(i, "hsn", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: l.qty,
											onChange: (e) => setLine(i, "qty", Number(e.target.value))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											step: "0.01",
											value: l.rate,
											onChange: (e) => setLine(i, "rate", Number(e.target.value))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: l.tax_pct,
											onChange: (e) => setLine(i, "tax_pct", Number(e.target.value))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1 text-right tabular-nums",
										children: formatINR(l.qty * l.rate * (1 + l.tax_pct / 100), { withSymbol: false })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => rmLine(i),
											disabled: lines.length === 1,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})
									})
								]
							}, i)) })]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 3,
						value: notes,
						onChange: (e) => setNotes(e.target.value)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Net Value",
								v: formatINR(netValue)
							}),
							isIgst ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "IGST",
								v: formatINR(igst)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "SGST",
								v: formatINR(sgst)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "CGST",
								v: formatINR(cgst)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Round Off",
								v: formatINR(roundOff)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Grand Total",
								v: formatINR(rounded),
								strong: true
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: onClose,
						disabled: saving,
						children: "Cancel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => save(false),
						disabled: saving,
						children: saving ? "Saving…" : "Save as Draft"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => save(true),
						disabled: saving,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mr-1 h-4 w-4" }), saving ? "Saving…" : "Save & Send"]
					})
				] })
			]
		})
	});
}
function Row({ k, v, strong }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex justify-between ${strong ? "border-t pt-1 font-bold text-base" : "text-muted-foreground"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums text-foreground",
			children: v
		})]
	});
}
function ViewPODialog({ po, onClose, onSent }) {
	const { data: items = [], isLoading } = useQuery({
		queryKey: ["purchase_order_items", po?.id],
		enabled: !!po?.id,
		queryFn: async () => (await supabase.from("purchase_order_items").select("*").eq("purchase_order_id", po.id).order("sr_no")).data ?? []
	});
	const { data: company } = useQuery({
		queryKey: ["company_profile"],
		queryFn: async () => (await supabase.from("company_profile").select("*").limit(1).maybeSingle()).data
	});
	const { data: vendor } = useQuery({
		queryKey: ["vendor", po?.vendor_id],
		enabled: !!po?.vendor_id,
		queryFn: async () => (await supabase.from("vendors").select("*").eq("id", po.vendor_id).maybeSingle()).data
	});
	const download = () => {
		if (!printPOHtml(buildPOHtml(po, items, company, vendor))) toast.error("Allow pop-ups to download the purchase order");
	};
	const emailPo = useServerFn(sendPoEmail);
	const [sending, setSending] = (0, import_react.useState)(false);
	const sendToVendor = async () => {
		if (!vendor?.email) return toast.error("This vendor has no email address on file");
		setSending(true);
		try {
			const res = await emailPo({ data: { poId: po.id } });
			if (res?.sent) {
				toast.success(`Purchase order emailed to ${res.email}`);
				onSent?.();
			} else toast.warning(`Could not send the purchase order (${res?.reason ?? "unknown"})`);
		} catch (e) {
			toast.error(e?.message ?? "Could not send the purchase order");
		} finally {
			setSending(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!po,
		onOpenChange: (o) => {
			if (!o) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Purchase Order ", po?.po_number] }) }),
				po && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Vendor",
									v: po.vendor_name_snapshot ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "GST",
									v: po.vendor_gst_snapshot ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "PO Date",
									v: formatDate(po.po_date)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Expected",
									v: po.expected_date ? formatDate(po.expected_date) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Status",
									v: String(po.status)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Tax type",
									v: po.is_igst ? "IGST" : "CGST + SGST"
								})
							]
						}),
						po.vendor_address_snapshot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: po.vendor_address_snapshot
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto rounded-md border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "#" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Description" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "HSN" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Rate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Tax %"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Total"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
								isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									colSpan: 7,
									className: "py-6 text-center text-muted-foreground",
									children: "Loading…"
								}) }),
								!isLoading && items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									colSpan: 7,
									className: "py-6 text-center text-muted-foreground",
									children: "No line items."
								}) }),
								items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: it.sr_no }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: it.description }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-xs",
										children: it.hsn_code ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "text-right tabular-nums",
										children: [
											Number(it.quantity),
											" ",
											it.uom ?? ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right tabular-nums",
										children: formatINR(it.unit_rate)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "text-right tabular-nums",
										children: [Number(it.tax_pct), "%"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right tabular-nums font-medium",
										children: formatINR(it.total_amount)
									})
								] }, it.id))
							] })] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto w-full max-w-xs space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Net value",
									v: formatINR(po.net_value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Sub total",
									v: formatINR(po.sub_total)
								}),
								po.is_igst ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "IGST",
									v: formatINR(po.igst_amount)
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "CGST",
									v: formatINR(po.cgst_amount)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "SGST",
									v: formatINR(po.sgst_amount)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Grand total",
									v: formatINR(po.grand_total),
									strong: true
								})
							]
						}),
						po.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Notes: ", po.notes]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: onClose,
							children: "Close"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: download,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), "Download PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: sendToVendor,
							disabled: !vendor?.email || sending,
							title: vendor?.email ? `Send to ${vendor.email}` : "No vendor email on file",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mr-1 h-4 w-4" }), sending ? "Sending…" : "Send to Vendor"]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { NewPODialog, PurchasesPage as component };

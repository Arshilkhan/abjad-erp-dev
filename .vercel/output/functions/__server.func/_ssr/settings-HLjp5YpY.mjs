import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Label, x as Textarea } from "./router-CkOQzNmy.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { t as Checkbox } from "./checkbox-kt6FvQcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-HLjp5YpY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HIDDEN_KEYS = /* @__PURE__ */ new Set([
	"rejected_items",
	"customer_credit",
	"credit_note",
	"inventory_adjustment",
	"history_tracking",
	"audit_log",
	"cancel_invoice",
	"import_invoice",
	"other_charges"
]);
function InvoiceConfigurationTab() {
	const qc = useQueryClient();
	const { data: allRows = [], isLoading } = useQuery({
		queryKey: ["invoice-config"],
		queryFn: async () => {
			const { data, error } = await supabase.from("invoice_configuration").select("*").order("sort_order", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	const rows = allRows.filter((r) => !HIDDEN_KEYS.has(r.feature_key));
	const toggle = async (row, patch) => {
		if (patch.is_editable === true) patch.is_read_only = false;
		if (patch.is_read_only === true) patch.is_editable = false;
		if (patch.is_mandatory === true) patch.is_visible = true;
		const { error } = await supabase.from("invoice_configuration").update(patch).eq("id", row.id);
		if (error) return toast.error(error.message);
		qc.invalidateQueries({ queryKey: ["invoice-config"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Invoice Configuration"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: ["Enable or disable features, and control the permission level applied on invoice forms.", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "mt-1 block text-xs text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Mandatory" }),
			" = required to save. ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Visible" }),
			" = shown on the form. ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Editable" }),
			" = user can modify. ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Read Only" }),
			" = shown but locked."
		]
	})] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2 text-left",
						children: "Feature"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2 text-center",
						children: "Enabled"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2 text-center",
						children: "Mandatory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2 text-center",
						children: "Visible"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2 text-center",
						children: "Editable"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2 text-center",
						children: "Read Only"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				colSpan: 6,
				className: "p-6 text-center text-muted-foreground",
				children: "Loading…"
			}) }), rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b last:border-b-0 hover:bg-muted/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-2 font-medium",
						children: r.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						checked: r.enabled,
						onChange: (v) => toggle(r, { enabled: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						checked: r.is_mandatory,
						onChange: (v) => toggle(r, { is_mandatory: v }),
						disabled: !r.enabled
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						checked: r.is_visible,
						onChange: (v) => toggle(r, { is_visible: v }),
						disabled: !r.enabled || r.is_mandatory
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						checked: r.is_editable,
						onChange: (v) => toggle(r, { is_editable: v }),
						disabled: !r.enabled
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						checked: r.is_read_only,
						onChange: (v) => toggle(r, { is_read_only: v }),
						disabled: !r.enabled
					})
				]
			}, r.id))] })]
		})
	}) })] });
}
function Cell({ checked, onChange, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: "p-2 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
			checked,
			onCheckedChange: (v) => onChange(!!v),
			disabled
		})
	});
}
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Settings",
		description: "Configure invoice fields, company profile, and financial year."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "config",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
				value: "config",
				children: "Invoice Configuration"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
				value: "company",
				children: "Company Profile"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "config",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoiceConfigurationTab, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "company",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyProfile, {})
			})
		]
	})] });
}
function CompanyProfile() {
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: ["company"],
		queryFn: async () => (await supabase.from("company_profile").select("*").limit(1).maybeSingle()).data
	});
	const [state, setState] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (data) setState(data);
	}, [data]);
	const save = useMutation({
		mutationFn: async () => {
			const { id, created_at, updated_at, ...rest } = state;
			const { error } = await supabase.from("company_profile").update(rest).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Company profile updated");
			qc.invalidateQueries({ queryKey: ["company"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const setField = (k) => (e) => setState((s) => ({
		...s,
		[k]: e.target.value
	}));
	const field = (k, label, type = "text", full = false) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `space-y-1.5 ${full ? "sm:col-span-2" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			htmlFor: `cp-${k}`,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id: `cp-${k}`,
			type,
			value: state[k] ?? "",
			onChange: setField(k)
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Company Profile"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Appears on invoice header and footer." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "grid gap-3 sm:grid-cols-2",
		children: [
			field("name", "Company Name"),
			field("website", "Website"),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5 sm:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Address"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 2,
					value: state.address ?? "",
					onChange: setField("address")
				})]
			}),
			field("city", "City"),
			field("pincode", "Pincode"),
			field("state", "State"),
			field("state_code", "State Code"),
			field("gst_number", "GST Number"),
			field("pan_number", "PAN Number"),
			field("mobile", "Mobile"),
			field("alt_mobile", "Alt Mobile"),
			field("email", "Email", "email"),
			field("financial_year", "Financial Year"),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-span-2 grid gap-3 rounded-lg border p-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-2 text-sm font-semibold",
						children: "Bank Details"
					}),
					field("bank_name", "Bank Name"),
					field("bank_branch", "Branch"),
					field("bank_account", "Account Number"),
					field("bank_ifsc", "IFSC")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5 sm:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Declaration"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 3,
					value: state.declaration ?? "",
					onChange: setField("declaration")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-span-2 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => save.mutate(),
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save Profile"
				})
			})
		]
	})] });
}
//#endregion
export { SettingsPage as component };

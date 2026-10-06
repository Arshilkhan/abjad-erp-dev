import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR, t as amountInWords } from "./format-COxJqFG7.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { n as salesDocumentConfig } from "./sales-documents-CfQh3Qhc.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { C as useNavigate, T as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./server-CLqueqhS.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-CYA_x1QZ.mjs";
import { E as LoaderCircle, b as Plus, et as ArrowLeft, f as Trash2, s as Upload, t as X } from "../_libs/lucide-react.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBJ7eSG_.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Label, _ as SelectContent, a as useAuth, b as SelectValue, c as TypeaheadInput, g as Select, v as SelectItem, x as Textarea, y as SelectTrigger } from "./router-CkOQzNmy.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { n as logInvoiceEvent } from "./invoice-history-DN84FPn5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoice-form-CzTgyY8d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_DATA_URL_CHARS = 16e6;
var extractInvoicePdf = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (typeof input?.fileData !== "string" || !input.fileData.startsWith("data:application/pdf")) throw new Error("Please upload a valid PDF file.");
	if (input.fileData.length > MAX_DATA_URL_CHARS) throw new Error("That PDF is too large. Please upload a file under 10 MB.");
	return input;
}).handler(createSsrRpc("f4f20b17fadc7157c8e2477c3c61073e02e4a1928f9571c15263f33efb184168"));
/**
* Emails an invoice PDF to the customer on file.
* Returns a reason instead of throwing when there is nothing to send to.
*/
var sendInvoiceEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input?.invoiceId) throw new Error("invoiceId is required");
	return input;
}).handler(createSsrRpc("db219711c9090bfe058637d5bc5d6be04e6de6d12bb7f09fcab360c2e5579bce"));
var FALLBACK = {
	visible: true,
	mandatory: false,
	readOnly: false,
	label: ""
};
function useInvoiceConfig() {
	const { data: rows = [], isLoading } = useQuery({
		queryKey: ["invoice-config"],
		queryFn: async () => {
			const { data, error } = await supabase.from("invoice_configuration").select("*").order("sort_order", { ascending: true });
			if (error) throw error;
			return data ?? [];
		},
		staleTime: 3e4
	});
	const map = new Map(rows.map((r) => [r.feature_key, r]));
	const cfg = (key) => {
		const r = map.get(key);
		if (!r) return FALLBACK;
		const enabled = r.enabled;
		return {
			visible: enabled && r.is_visible,
			mandatory: enabled && r.is_mandatory,
			readOnly: enabled ? r.is_read_only || !r.is_editable : true,
			label: r.label
		};
	};
	return {
		cfg,
		rows,
		isLoading
	};
}
var MOVEMENT_REASONS = [
	"Delivery / Supply",
	"Job Work",
	"Repair",
	"Returnable Goods",
	"Sample / Demo",
	"Stock Transfer",
	"Other"
];
function emptyItem(sr) {
	return {
		sr_no: sr,
		product_id: null,
		hsn_code: "",
		description: "",
		quantity: 1,
		uom: "NOS",
		unit_rate: 0,
		discount_mode: "pct",
		discount_value: 0,
		tax_pct: 18,
		serial_batch_number: ""
	};
}
function computeItem(it) {
	const gross = it.quantity * it.unit_rate;
	const raw = Number(it.discount_value || 0);
	const discount_amount = it.discount_mode === "flat" ? Math.min(Math.max(raw, 0), gross) : gross * Math.min(Math.max(raw, 0), 100) / 100;
	const discount_pct = gross > 0 ? discount_amount / gross * 100 : 0;
	const net = gross - discount_amount;
	const tax_amount = net * it.tax_pct / 100;
	return {
		discount_amount,
		discount_pct,
		tax_amount,
		total_amount: net + tax_amount,
		net
	};
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between py-0.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums font-medium",
			children: value
		})]
	});
}
function ChargeRow({ config, fallbackLabel, value, onChange }) {
	if (!config.visible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
			className: "text-xs text-muted-foreground",
			children: [config.label || fallbackLabel, config.mandatory && " *"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "h-8 w-32 text-right",
			type: "number",
			value,
			readOnly: config.readOnly,
			disabled: config.readOnly,
			onChange: (e) => onChange(Number(e.target.value))
		})]
	});
}
function ProductLineItems({ items, productTexts, products, isChallan, setItem, setProductText, applyProduct, removeItem, addItem }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-row items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: isChallan ? "Goods Being Moved" : "Line Items"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				variant: "outline",
				onClick: addItem,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), "Add Row"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-left w-10",
								children: "#"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-left w-48",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-left w-24",
								children: "HSN"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-left",
								children: "Description"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right w-20",
								children: "Qty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-left w-16",
								children: "UOM"
							}),
							isChallan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-left w-40",
								children: "Serial / Batch No."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-right w-24",
									children: "Rate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-right w-40",
									children: "Discount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-right w-16",
									children: "Tax%"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-right w-28",
									children: "Total"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-8" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((it, idx) => {
						const c = computeItem(it);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-1 text-center text-muted-foreground",
									children: it.sr_no
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeaheadInput, {
										value: productTexts[idx] ?? "",
										onChange: (value) => {
											setProductText(idx, value);
											if (it.product_id) setItem(idx, { product_id: null });
										},
										options: products.map((p) => ({
											id: p.id,
											label: p.product_name,
											sublabel: `${p.product_code ?? ""}${p.hsn_code ? ` • HSN ${p.hsn_code}` : ""}`
										})),
										onSelect: (option) => applyProduct(idx, option.id),
										placeholder: "Type product…",
										inputClassName: "h-8"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "h-8 font-mono text-xs",
										value: it.hsn_code,
										onChange: (e) => setItem(idx, { hsn_code: e.target.value })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "h-8",
										value: it.description,
										onChange: (e) => setItem(idx, { description: e.target.value })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "h-8 text-right tabular-nums",
										type: "number",
										value: it.quantity,
										onChange: (e) => setItem(idx, { quantity: Number(e.target.value) })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "h-8",
										value: it.uom,
										onChange: (e) => setItem(idx, { uom: e.target.value })
									})
								}),
								isChallan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "h-8",
										value: it.serial_batch_number,
										onChange: (e) => setItem(idx, { serial_batch_number: e.target.value }),
										placeholder: "Serial / Batch"
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											className: "h-8 text-right tabular-nums",
											type: "number",
											value: it.unit_rate,
											onChange: (e) => setItem(idx, { unit_rate: Number(e.target.value) })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex min-w-36 gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												className: "h-8 min-w-0 text-right tabular-nums",
												type: "number",
												min: 0,
												max: it.discount_mode === "pct" ? 100 : void 0,
												step: "0.01",
												value: it.discount_value,
												"aria-label": `Discount value for item ${it.sr_no}`,
												onChange: (e) => setItem(idx, { discount_value: Number(e.target.value) })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: it.discount_mode,
												onValueChange: (value) => setItem(idx, { discount_mode: value === "flat" ? "flat" : "pct" }),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 w-20 px-2",
													"aria-label": `Discount type for item ${it.sr_no}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "pct",
													children: "%"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "flat",
													children: "Flat"
												})] })]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											className: "h-8 text-right tabular-nums",
											type: "number",
											value: it.tax_pct,
											onChange: (e) => setItem(idx, { tax_pct: Number(e.target.value) })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2 text-right tabular-nums font-medium",
										children: formatINR(c.total_amount)
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "icon",
										variant: "ghost",
										onClick: () => removeItem(idx),
										disabled: items.length === 1,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})
								})
							]
						}, idx);
					}) })]
				})
			})
		})]
	});
}
function DocumentDetails({ isChallan, isEdit, isTaxInvoice, docLabel, customers, settings, customerId, customerText, custCompany, custAddress, custMobile, custEmail, custGst, invoiceDate, movementReason, challanNumber, challanDates, challanDateInput, workOrder, extracting, pdfName, pdfImported, setCustomerId, setCustomerText, setCustCompany, setCustAddress, setCustMobile, setCustEmail, setCustGst, setInvoiceDate, setMovementReason, setChallanNumber, setChallanDateInput, setWorkOrder, setChallanDates, addChallanDate, handlePdf }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 lg:grid-cols-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "lg:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row items-center justify-between gap-3 space-y-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: isChallan ? "Delivery Challan Details" : "Invoice Details"
				}), !isEdit && isTaxInvoice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "invoice-pdf",
					type: "file",
					accept: "application/pdf",
					className: "hidden",
					disabled: extracting,
					onChange: (e) => {
						const f = e.target.files?.[0];
						e.target.value = "";
						if (f) handlePdf(f);
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					disabled: extracting,
					asChild: !extracting,
					children: extracting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }), "Importing…"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						htmlFor: "invoice-pdf",
						className: "cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-1 h-4 w-4" }), "Import Invoice"]
					})
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					!isEdit && pdfName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-2 space-y-1.5 md:col-span-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center gap-2 rounded-md border border-dashed p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: extracting ? `Reading ${pdfName}…` : pdfImported ? `${pdfName} imported. Review the details below before saving.` : `Could not import ${pdfName}. Choose another PDF to try again.`
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Customer Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeaheadInput, {
								value: customerText,
								onChange: (v) => {
									setCustomerText(v);
									if (customerId) setCustomerId("");
								},
								options: customers.map((c) => ({
									id: c.id,
									label: c.customer_name || c.company_name || "",
									sublabel: [c.company_name, c.gst_number].filter(Boolean).join(" • ")
								})),
								onSelect: (opt) => {
									setCustomerId(opt.id);
									setCustomerText(opt.label);
								},
								placeholder: "Type a customer name — new names are saved automatically"
							}),
							!customerId && customerText.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "New customer — will be added to your directory on save."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Company Name *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: custCompany,
							onChange: (e) => setCustCompany(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: custAddress,
							onChange: (e) => setCustAddress(e.target.value),
							placeholder: "Customer billing address"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Mobile"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: custMobile,
							onChange: (e) => setCustMobile(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: custEmail,
							onChange: (e) => setCustEmail(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "text-xs",
							children: ["GST Number", settings?.mandatory_gst_number && " *"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "font-mono",
							value: custGst,
							onChange: (e) => setCustGst(e.target.value.toUpperCase())
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: docLabel,
							readOnly: true,
							disabled: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: isChallan ? "Delivery Challan Date" : "Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: invoiceDate,
							onChange: (e) => setInvoiceDate(e.target.value)
						})]
					}),
					isChallan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Reason for Movement"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: movementReason,
							onValueChange: setMovementReason,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: MOVEMENT_REASONS.map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: reason,
								children: reason
							}, reason)) })]
						})]
					}),
					isChallan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "text-xs",
								children: ["Challan Numbers (comma separated)", settings?.mandatory_challan_number && " *"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: challanNumber,
								placeholder: "DC-001, DC-002, DC-003",
								onChange: (e) => setChallanNumber(e.target.value)
							}),
							challanNumber.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5 pt-1",
								children: challanNumber.split(",").map((n) => n.trim()).filter(Boolean).map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-muted px-2 py-0.5 text-xs",
									children: n
								}, `${n}-${i}`))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Challan Dates"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: challanDateInput,
									onChange: (e) => setChallanDateInput(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addChallanDate();
										}
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "secondary",
									onClick: addChallanDate,
									children: "Add"
								})]
							}),
							challanDates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5 pt-1",
								children: challanDates.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs",
									children: [d, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": `Remove ${d}`,
										className: "text-muted-foreground hover:text-destructive",
										onClick: () => setChallanDates((prev) => prev.filter((x) => x !== d)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})]
								}, d))
							})
						]
					})] }),
					(settings?.show_work_order || isEdit) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Work Order Number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: workOrder,
							onChange: (e) => setWorkOrder(e.target.value)
						})]
					})
				]
			})]
		})
	});
}
function InvoiceForm({ editId, importMode, documentType = "tax_invoice" }) {
	const docCfg = salesDocumentConfig(documentType);
	const docTable = docCfg.table;
	const docItemsTable = docCfg.itemsTable;
	const isTaxInvoice = documentType === "tax_invoice";
	const nav = useNavigate();
	const router = useRouter();
	const { user } = useAuth();
	const isEdit = !!editId;
	const qc = useQueryClient();
	const [items, setItems] = (0, import_react.useState)([emptyItem(1)]);
	const [customerId, setCustomerId] = (0, import_react.useState)("");
	const [customerText, setCustomerText] = (0, import_react.useState)("");
	const [custCompany, setCustCompany] = (0, import_react.useState)("");
	const [custAddress, setCustAddress] = (0, import_react.useState)("");
	const [custMobile, setCustMobile] = (0, import_react.useState)("");
	const [custEmail, setCustEmail] = (0, import_react.useState)("");
	const [custGst, setCustGst] = (0, import_react.useState)("");
	const [productTexts, setProductTexts] = (0, import_react.useState)([""]);
	const [invoiceType, setInvoiceType] = (0, import_react.useState)(documentType);
	const [challanNumber, setChallanNumber] = (0, import_react.useState)("");
	const [challanDates, setChallanDates] = (0, import_react.useState)([]);
	const [challanDateInput, setChallanDateInput] = (0, import_react.useState)("");
	const [workOrder, setWorkOrder] = (0, import_react.useState)("");
	const [freight, setFreight] = (0, import_react.useState)(0);
	const [packing, setPacking] = (0, import_react.useState)(0);
	const [otherCharges, setOtherCharges] = (0, import_react.useState)(0);
	const [transportCharges, setTransportCharges] = (0, import_react.useState)(0);
	const [deliveryCharges, setDeliveryCharges] = (0, import_react.useState)(0);
	const [deliveryMode, setDeliveryMode] = (0, import_react.useState)("By Road");
	const [paymentTerms, setPaymentTerms] = (0, import_react.useState)("30 Days");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [movementReason, setMovementReason] = (0, import_react.useState)("Delivery / Supply");
	const [transporterName, setTransporterName] = (0, import_react.useState)("");
	const [placeOfDispatch, setPlaceOfDispatch] = (0, import_react.useState)("");
	const [placeOfDelivery, setPlaceOfDelivery] = (0, import_react.useState)("");
	const [invoiceDate, setInvoiceDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const isChallan = invoiceType === "delivery_challan";
	const addChallanDate = () => {
		const d = challanDateInput;
		if (!d) return;
		setChallanDates((prev) => prev.includes(d) ? prev : [...prev, d].sort());
		setChallanDateInput("");
	};
	const { data: customers = [] } = useQuery({
		queryKey: ["customers-list"],
		queryFn: async () => (await supabase.from("customers").select("id, customer_name, company_name, gst_number, billing_address, state, state_code, contact_person, mobile, email")).data ?? []
	});
	const { data: products = [] } = useQuery({
		queryKey: ["products-list"],
		queryFn: async () => (await supabase.from("products").select("id, product_name, product_code, hsn_code, unit, gst_percentage, selling_price")).data ?? []
	});
	const { data: settings } = useQuery({
		queryKey: ["invoice-settings"],
		queryFn: async () => (await supabase.from("invoice_settings").select("*").limit(1).maybeSingle()).data
	});
	const { cfg } = useInvoiceConfig();
	const { data: company } = useQuery({
		queryKey: ["company"],
		queryFn: async () => (await supabase.from("company_profile").select("state_code").limit(1).maybeSingle()).data
	});
	const { data: existing } = useQuery({
		queryKey: [
			"invoice-edit",
			documentType,
			editId
		],
		enabled: isEdit,
		queryFn: async () => {
			const [inv, its] = await Promise.all([supabase.from(docTable).select("*").eq("id", editId).single(), supabase.from(docItemsTable).select("*").eq("invoice_id", editId).order("sr_no")]);
			if (inv.error) throw inv.error;
			return {
				invoice: inv.data,
				items: its.data ?? []
			};
		}
	});
	(0, import_react.useEffect)(() => {
		if (!existing || hydrated) return;
		const inv = existing.invoice;
		setCustomerId(inv.customer_id ?? "");
		setCustomerText(inv.customer_name_snapshot ?? "");
		setInvoiceType(documentType);
		setInvoiceDate(inv.invoice_date);
		if (isChallan) {
			setChallanNumber(inv.challan_number ?? "");
			setChallanDates(inv.challan_dates ?? (inv.challan_date ? [inv.challan_date] : []));
		}
		setWorkOrder(inv.work_order_number ?? "");
		if (!isChallan) {
			setFreight(Number(inv.freight ?? 0));
			setPacking(Number(inv.packing_charges ?? 0));
			setOtherCharges(Number(inv.other_charges ?? 0));
			if (isTaxInvoice) {
				setTransportCharges(Number(inv.transportation_charges ?? 0));
				setDeliveryCharges(Number(inv.delivery_charges ?? 0));
			}
		}
		setDeliveryMode(inv.delivery_mode ?? "");
		setPaymentTerms(inv.payment_terms ?? "");
		setNotes(inv.notes ?? "");
		setMovementReason(inv.movement_reason ?? "Delivery / Supply");
		setTransporterName(inv.transporter_name ?? "");
		setPlaceOfDispatch(inv.place_of_dispatch ?? "");
		setPlaceOfDelivery(inv.place_of_delivery ?? "");
		setItems(existing.items.length ? existing.items.map((it, i) => ({
			sr_no: it.sr_no ?? i + 1,
			product_id: it.product_id,
			hsn_code: it.hsn_code ?? "",
			description: it.description ?? "",
			quantity: Number(it.quantity ?? 1),
			uom: it.uom ?? "NOS",
			unit_rate: isChallan ? 0 : Number(it.unit_rate ?? 0),
			discount_mode: "pct",
			discount_value: isChallan ? 0 : Number(it.discount_pct ?? 0),
			tax_pct: isChallan ? 0 : Number(it.tax_pct ?? 18),
			serial_batch_number: it.serial_batch_number ?? ""
		})) : [emptyItem(1)]);
		setProductTexts(existing.items.length ? existing.items.map((it) => it.description ?? "") : [""]);
		setHydrated(true);
	}, [existing, hydrated]);
	const customer = customers.find((c) => c.id === customerId);
	const isIGST = !!(customer?.state_code && company?.state_code && customer.state_code !== company.state_code);
	(0, import_react.useEffect)(() => {
		if (!customer) return;
		setCustomerText(customer.customer_name || customer.company_name || "");
		setCustCompany(customer.company_name ?? "");
		setCustAddress(customer.billing_address ?? "");
		setCustMobile(customer.mobile ?? "");
		setCustEmail(customer.email ?? "");
		setCustGst(customer.gst_number ?? "");
	}, [customerId, customer]);
	const totals = (0, import_react.useMemo)(() => {
		let net = 0, tax = 0, disc = 0;
		for (const it of items) {
			const c = computeItem(it);
			net += c.net;
			tax += c.tax_amount;
			disc += c.discount_amount;
		}
		const subtotal = net + Number(freight || 0) + Number(packing || 0) + Number(otherCharges || 0) + Number(transportCharges || 0) + Number(deliveryCharges || 0);
		const preRound = subtotal + tax;
		const grand = Math.round(preRound);
		const round_off = grand - preRound;
		return {
			net,
			tax,
			disc,
			subtotal,
			grand,
			round_off
		};
	}, [
		items,
		freight,
		packing,
		otherCharges,
		transportCharges,
		deliveryCharges
	]);
	const setItem = (idx, patch) => {
		setItems((prev) => prev.map((it, i) => i === idx ? {
			...it,
			...patch
		} : it));
	};
	const addItem = () => {
		setItems((p) => [...p, emptyItem(p.length + 1)]);
		setProductTexts((p) => [...p, ""]);
	};
	const removeItem = (idx) => {
		setItems((p) => p.filter((_, i) => i !== idx).map((it, i) => ({
			...it,
			sr_no: i + 1
		})));
		setProductTexts((p) => p.filter((_, i) => i !== idx));
	};
	const applyProduct = (idx, pid) => {
		const p = products.find((x) => x.id === pid);
		if (!p) return;
		setItem(idx, {
			product_id: p.id,
			hsn_code: p.hsn_code ?? "",
			description: p.product_name,
			unit_rate: Number(p.selling_price ?? 0),
			uom: p.unit ?? "NOS",
			tax_pct: Number(p.gst_percentage ?? 18)
		});
	};
	const setProductText = (idx, value) => {
		setProductTexts((prev) => prev.map((text, i) => i === idx ? value : text));
	};
	const sendEmail = useServerFn(sendInvoiceEmail);
	const save = useMutation({
		mutationFn: async (status) => {
			const nameTyped = customerText.trim();
			if (!custCompany.trim()) throw new Error("Please enter a company name");
			if (settings?.mandatory_gst_number && !custGst.trim()) throw new Error("Customer GST Number is mandatory");
			if (isChallan && settings?.mandatory_challan_number && !challanNumber) throw new Error("Challan Number is mandatory");
			const requireCharge = (key, val) => {
				const c = cfg(key);
				if (c.visible && c.mandatory && !Number(val)) throw new Error(`${c.label || key} is mandatory`);
			};
			if (!isChallan) {
				requireCharge("freight_charges", freight);
				requireCharge("packing_charges", packing);
				requireCharge("other_charges", otherCharges);
				if (isTaxInvoice) {
					requireCharge("transportation_charges", transportCharges);
					requireCharge("delivery_charges", deliveryCharges);
				}
			}
			if (items.length === 0) throw new Error("Add at least one item");
			let cust = customer ?? customers.find((c) => (c.customer_name ?? "").toLowerCase() === nameTyped.toLowerCase() || (c.company_name ?? "").toLowerCase() === nameTyped.toLowerCase());
			if (cust) {
				const patch = {};
				if (custCompany.trim() && custCompany !== (cust.company_name ?? "")) patch.company_name = custCompany.trim();
				if (nameTyped && nameTyped !== (cust.contact_person ?? "")) patch.contact_person = nameTyped;
				if (custAddress.trim() && custAddress !== (cust.billing_address ?? "")) patch.billing_address = custAddress.trim();
				if (custMobile.trim() && custMobile !== (cust.mobile ?? "")) patch.mobile = custMobile.trim();
				if (custEmail.trim() && custEmail !== (cust.email ?? "")) patch.email = custEmail.trim();
				if (custGst.trim() && custGst !== (cust.gst_number ?? "")) patch.gst_number = custGst.trim();
				if (Object.keys(patch).length) {
					const { data, error } = await supabase.from("customers").update(patch).eq("id", cust.id).select().single();
					if (error) throw error;
					cust = data;
				}
			} else {
				const { data, error } = await supabase.from("customers").insert({
					customer_name: nameTyped,
					company_name: custCompany.trim() || null,
					contact_person: nameTyped || null,
					billing_address: custAddress.trim() || null,
					mobile: custMobile.trim() || null,
					email: custEmail.trim() || null,
					gst_number: custGst.trim() || null,
					created_by: user?.id ?? null
				}).select().single();
				if (error) throw error;
				cust = data;
				setCustomerId(cust.id);
			}
			const resolvedItems = [];
			for (let i = 0; i < items.length; i++) {
				const it = items[i];
				const typed = (productTexts[i] ?? "").trim();
				if (it.product_id || !typed) {
					resolvedItems.push({
						...it,
						description: it.description || typed
					});
					continue;
				}
				const match = products.find((p) => (p.product_name ?? "").toLowerCase() === typed.toLowerCase());
				if (match) {
					resolvedItems.push({
						...it,
						product_id: match.id,
						description: it.description || typed
					});
					continue;
				}
				const { data: newProd, error: pErr } = await supabase.from("products").insert({
					product_name: typed,
					hsn_code: it.hsn_code || null,
					description: it.description || null,
					unit: it.uom || null,
					selling_price: Number(it.unit_rate) || 0,
					gst_percentage: Number(it.tax_pct) || 0,
					stock_quantity: Number(it.quantity) || 0
				}).select().single();
				if (pErr) throw pErr;
				resolvedItems.push({
					...it,
					product_id: newProd.id,
					description: it.description || typed
				});
			}
			const sgst_amount = isIGST ? 0 : totals.tax / 2;
			const cgst_amount = isIGST ? 0 : totals.tax / 2;
			const igst_amount = isIGST ? totals.tax : 0;
			const payload = {
				invoice_type: invoiceType,
				invoice_date: invoiceDate,
				customer_id: cust.id,
				customer_name_snapshot: cust.company_name || cust.customer_name,
				customer_gst_snapshot: cust.gst_number,
				customer_address_snapshot: custAddress.trim() || cust.billing_address,
				work_order_number: workOrder || null,
				delivery_mode: deliveryMode || null,
				contact_person: nameTyped || null,
				contact_mobile: custMobile || null,
				notes: notes || null,
				status
			};
			if (isChallan) Object.assign(payload, {
				challan_number: challanNumber || null,
				challan_date: challanDates[0] || invoiceDate,
				challan_dates: challanDates.length ? challanDates : [invoiceDate],
				movement_reason: movementReason || null,
				transporter_name: transporterName.trim() || null,
				place_of_dispatch: placeOfDispatch.trim() || null,
				place_of_delivery: placeOfDelivery.trim() || null
			});
			else {
				Object.assign(payload, {
					is_igst: isIGST,
					net_value: totals.net,
					discount_amount: totals.disc,
					freight: Number(freight || 0),
					packing_charges: Number(packing || 0),
					other_charges: Number(otherCharges || 0),
					subtotal: totals.subtotal,
					sgst_amount,
					cgst_amount,
					igst_amount,
					round_off: totals.round_off,
					grand_total: totals.grand,
					amount_in_words: amountInWords(totals.grand),
					payment_terms: paymentTerms || null
				});
				if (isTaxInvoice) {
					payload.transportation_charges = Number(transportCharges || 0);
					payload.delivery_charges = Number(deliveryCharges || 0);
				}
			}
			let invId;
			let invNumber;
			if (isEdit) {
				const { data: inv, error } = await supabase.from(docTable).update(payload).eq("id", editId).select().single();
				if (error) throw error;
				invId = inv.id;
				invNumber = inv.invoice_number;
				const { error: dErr } = await supabase.from(docItemsTable).delete().eq("invoice_id", invId);
				if (dErr) throw dErr;
			} else {
				const slug = (custCompany || cust.company_name || cust.customer_name || customerText || "customer").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "customer";
				const { data: existing } = await supabase.from(docTable).select("invoice_number");
				const seqRe = docCfg.prefix ? new RegExp(`^${docCfg.prefix}(\\d+)-`, "i") : /^(\d+)-/;
				let seq = 0;
				for (const row of existing ?? []) {
					const m = seqRe.exec(row.invoice_number ?? "");
					if (m) seq = Math.max(seq, Number(m[1]));
				}
				let inserted = null;
				let lastErr = null;
				for (let attempt = 0; attempt < 25; attempt++) {
					seq += 1;
					const invoice_number = `${docCfg.prefix}${seq}-${slug}`;
					const insertPayload = {
						...payload,
						invoice_number,
						created_by: user?.id
					};
					if (isTaxInvoice && (importMode || pdfImported)) {
						insertPayload.is_imported = true;
						insertPayload.import_source = "manual";
					}
					const { data: inv, error } = await supabase.from(docTable).insert(insertPayload).select().single();
					if (!error) {
						inserted = inv;
						lastErr = null;
						break;
					}
					lastErr = error;
					if (error.code !== "23505") break;
				}
				if (!inserted) throw lastErr ?? /* @__PURE__ */ new Error("Could not generate a unique invoice number");
				invId = inserted.id;
				invNumber = inserted.invoice_number;
			}
			const rows = resolvedItems.map((it) => {
				const c = computeItem(it);
				const base = {
					invoice_id: invId,
					sr_no: it.sr_no,
					product_id: it.product_id,
					hsn_code: it.hsn_code || null,
					description: it.description,
					quantity: it.quantity,
					uom: it.uom,
					serial_batch_number: it.serial_batch_number?.trim() || null
				};
				return isChallan ? base : {
					...base,
					unit_rate: it.unit_rate,
					discount_pct: c.discount_pct,
					discount_amount: c.discount_amount,
					tax_pct: it.tax_pct,
					tax_amount: c.tax_amount,
					total_amount: c.total_amount
				};
			});
			const { error: iErr } = await supabase.from(docItemsTable).insert(rows);
			if (iErr) throw iErr;
			return {
				id: invId,
				invoice_number: invNumber
			};
		},
		onSuccess: async (inv, status) => {
			qc.invalidateQueries({ queryKey: ["customers-list"] });
			qc.invalidateQueries({ queryKey: ["products-list"] });
			if (!isTaxInvoice) {} else if (isEdit) await logInvoiceEvent(inv.id, "edited", "Invoice edited");
			else if (importMode || pdfImported) await logInvoiceEvent(inv.id, "imported", `Imported invoice ${inv.invoice_number}`);
			else await logInvoiceEvent(inv.id, "created", `Created invoice ${inv.invoice_number}`);
			toast.success(`${docCfg.label} ${inv.invoice_number} ${isEdit ? "updated" : importMode ? "imported" : "created"}`);
			if (status === "sent") try {
				const res = await sendEmail({ data: {
					invoiceId: inv.id,
					kind: documentType
				} });
				if (res?.sent) {
					toast.success(`Invoice emailed to ${res.email}`);
					if (isTaxInvoice) await logInvoiceEvent(inv.id, "sent", `Invoice emailed to ${res.email}`);
				} else if (res?.reason === "no_email") toast.info("Saved. No customer email on file, so nothing was sent.");
				else if (res?.reason === "recipient_suppressed") toast.warning("Saved. The customer has unsubscribed from emails.");
			} catch (err) {
				toast.error(`Invoice saved, but the email could not be sent: ${err?.message ?? "unknown error"}`);
			}
			nav({
				to: "/invoices/$id",
				params: { id: inv.id },
				search: { kind: documentType }
			});
		},
		onError: (e) => toast.error(e.message)
	});
	const runExtract = useServerFn(extractInvoicePdf);
	const [extracting, setExtracting] = (0, import_react.useState)(false);
	const [pdfName, setPdfName] = (0, import_react.useState)("");
	const [pdfImported, setPdfImported] = (0, import_react.useState)(false);
	const handlePdf = async (file) => {
		if (file.type !== "application/pdf") return toast.error("Please choose a PDF file.");
		if (file.size > 15728640) return toast.error("PDF is too large (max 15 MB).");
		setPdfName(file.name);
		setPdfImported(false);
		setExtracting(true);
		try {
			const fileData = await new Promise((resolve, reject) => {
				const r = new FileReader();
				r.onload = () => resolve(String(r.result));
				r.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that file."));
				r.readAsDataURL(file);
			});
			const d = await runExtract({ data: { fileData } });
			if (d.customer_name) {
				const match = customers.find((c) => (c.customer_name ?? "").toLowerCase() === d.customer_name.toLowerCase() || (c.company_name ?? "").toLowerCase() === d.customer_name.toLowerCase());
				setCustomerId(match?.id ?? "");
				setCustomerText(d.customer_name);
			}
			if (d.customer_name || d.company_name) setCustCompany(d.customer_name || d.company_name);
			if (d.mobile) setCustMobile(d.mobile);
			const footerMobiles = (d.footer_contact_mobiles ?? []).length > 0 ? d.footer_contact_mobiles.join(" / ") : "";
			if (footerMobiles && !d.mobile) setCustMobile(footerMobiles);
			if (d.email) setCustEmail(d.email);
			if (d.gst_number) setCustGst(d.gst_number);
			if (d.invoice_date) setInvoiceDate(d.invoice_date);
			if (d.work_order_number) setWorkOrder(d.work_order_number);
			if (isTaxInvoice && d.freight) setFreight(d.freight);
			if (isTaxInvoice && d.packing_charges) setPacking(d.packing_charges);
			if (isTaxInvoice && d.other_charges) setOtherCharges(d.other_charges);
			if (d.delivery_mode) setDeliveryMode(d.delivery_mode);
			if (d.payment_terms) setPaymentTerms(d.payment_terms);
			if (d.notes) setNotes(d.notes);
			if (d.items.length) {
				setItems(d.items.map((it, i) => ({
					sr_no: i + 1,
					product_id: products.find((p) => (p.product_name ?? "").toLowerCase() === it.description.toLowerCase())?.id ?? null,
					hsn_code: it.hsn_code,
					description: it.description,
					quantity: it.quantity,
					uom: it.uom,
					unit_rate: it.unit_rate,
					discount_mode: "pct",
					discount_value: Number(it.discount_pct ?? 0),
					tax_pct: it.tax_pct || 18,
					serial_batch_number: ""
				})));
				setProductTexts(d.items.map((it) => it.description));
			}
			setPdfImported(true);
			toast.success(`Imported ${d.items.length} line item${d.items.length === 1 ? "" : "s"} from the PDF.`);
		} catch (e) {
			toast.error(e?.message || "Could not read that PDF.");
		} finally {
			setExtracting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: isEdit ? `Edit ${docCfg.label}${existing?.invoice?.invoice_number ? ` — ${existing.invoice.invoice_number}` : ""}` : importMode ? "Import Invoice" : `New ${docCfg.label}`,
			description: importMode ? "Record an invoice that was created outside the software. It'll be tagged 'Imported' and behaves like a normal invoice." : isEdit ? `Update ${docCfg.label.toLowerCase()} details.` : isTaxInvoice ? "Create a GST tax invoice. Field visibility and mandatory rules follow your Settings." : `Create a ${docCfg.label.toLowerCase()}.`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => router.history.back(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1 h-4 w-4" }), " Back"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => save.mutate("draft"),
						disabled: save.isPending,
						children: "Save Draft"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => save.mutate("sent"),
						disabled: save.isPending,
						children: save.isPending ? "Saving…" : isEdit ? "Save Changes" : "Save & Send"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentDetails, {
			isChallan,
			isEdit,
			isTaxInvoice,
			docLabel: docCfg.label,
			customers,
			settings,
			customerId,
			customerText,
			custCompany,
			custAddress,
			custMobile,
			custEmail,
			custGst,
			invoiceDate,
			movementReason,
			challanNumber,
			challanDates,
			challanDateInput,
			workOrder,
			extracting,
			pdfName,
			pdfImported,
			setCustomerId,
			setCustomerText,
			setCustCompany,
			setCustAddress,
			setCustMobile,
			setCustEmail,
			setCustGst,
			setInvoiceDate,
			setMovementReason,
			setChallanNumber,
			setChallanDateInput,
			setWorkOrder,
			setChallanDates,
			addChallanDate,
			handlePdf
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductLineItems, {
			items,
			productTexts,
			products,
			isChallan,
			setItem,
			setProductText,
			applyProduct,
			removeItem,
			addItem
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Additional Details"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid grid-cols-2 gap-3",
				children: [
					(settings?.show_delivery || isEdit) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Delivery Mode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: deliveryMode,
							onChange: (e) => setDeliveryMode(e.target.value)
						})]
					}),
					!isChallan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Payment Terms"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: paymentTerms,
							onChange: (e) => setPaymentTerms(e.target.value)
						})]
					}),
					isChallan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Transporter Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: transporterName,
								onChange: (e) => setTransporterName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Place of Dispatch"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: placeOfDispatch,
								onChange: (e) => setPlaceOfDispatch(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Place of Delivery"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: placeOfDelivery,
								onChange: (e) => setPlaceOfDelivery(e.target.value)
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Notes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: notes,
							onChange: (e) => setNotes(e.target.value)
						})]
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: isChallan ? "hidden" : void 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Totals"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Net Value",
							value: formatINR(totals.net)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChargeRow, {
							config: cfg("freight_charges"),
							fallbackLabel: "Freight",
							value: freight,
							onChange: setFreight
						}),
						isTaxInvoice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChargeRow, {
							config: cfg("transportation_charges"),
							fallbackLabel: "Transportation Charges",
							value: transportCharges,
							onChange: setTransportCharges
						}),
						isTaxInvoice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChargeRow, {
							config: cfg("delivery_charges"),
							fallbackLabel: "Delivery Charges",
							value: deliveryCharges,
							onChange: setDeliveryCharges
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChargeRow, {
							config: cfg("packing_charges"),
							fallbackLabel: "Packing & Forwarding",
							value: packing,
							onChange: setPacking
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChargeRow, {
							config: cfg("other_charges"),
							fallbackLabel: "Other Charges",
							value: otherCharges,
							onChange: setOtherCharges
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Subtotal",
									value: formatINR(totals.subtotal)
								}),
								isIGST ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "IGST",
									value: formatINR(totals.tax)
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "CGST",
									value: formatINR(totals.tax / 2)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "SGST",
									value: formatINR(totals.tax / 2)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Round Off",
									value: formatINR(totals.round_off)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t pt-2 text-base font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grand Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatINR(totals.grand)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pt-1 text-xs italic text-muted-foreground",
							children: amountInWords(totals.grand)
						})
					]
				})]
			})]
		})
	] });
}
//#endregion
export { InvoiceForm as t };

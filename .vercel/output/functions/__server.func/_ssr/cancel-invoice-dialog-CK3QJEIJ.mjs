import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Label, d as DialogDescription, f as DialogFooter, h as DialogTrigger, l as Dialog, m as DialogTitle, p as DialogHeader, u as DialogContent, x as Textarea } from "./router-CkOQzNmy.mjs";
import { n as logInvoiceEvent } from "./invoice-history-DN84FPn5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cancel-invoice-dialog-CK3QJEIJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CancelInvoiceDialog({ invoiceId, invoiceNumber, trigger, onCancelled }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [reason, setReason] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const cancel = async () => {
		setBusy(true);
		const { data: u } = await supabase.auth.getUser();
		const { error } = await supabase.from("invoices").update({
			status: "cancelled",
			cancelled_at: (/* @__PURE__ */ new Date()).toISOString(),
			cancelled_by: u.user?.id ?? null,
			cancellation_reason: reason || null
		}).eq("id", invoiceId);
		setBusy(false);
		if (error) return toast.error(error.message);
		await logInvoiceEvent(invoiceId, "cancelled", `Invoice cancelled${reason ? `: ${reason}` : ""}`, { reason });
		toast.success(`Invoice ${invoiceNumber} cancelled`);
		setOpen(false);
		onCancelled?.();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
				"Cancel invoice ",
				invoiceNumber,
				"?"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				"The invoice will be marked ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Cancelled" }),
				". It stays searchable and appears in reports, but cannot be edited or deleted. The invoice number is retained and never reused."
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "reason",
					className: "text-xs",
					children: "Cancellation reason (optional)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "reason",
					rows: 3,
					value: reason,
					onChange: (e) => setReason(e.target.value),
					placeholder: "e.g. Customer withdrew order, wrong details, duplicate…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => setOpen(false),
				disabled: busy,
				children: "Keep invoice"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "destructive",
				onClick: cancel,
				disabled: busy,
				children: busy ? "Cancelling…" : "Confirm cancel"
			})] })
		] })]
	});
}
//#endregion
export { CancelInvoiceDialog as t };

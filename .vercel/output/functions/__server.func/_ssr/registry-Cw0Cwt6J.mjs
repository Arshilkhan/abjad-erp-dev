import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Body } from "../_libs/react-email__body.mjs";
import { t as Container } from "../_libs/react-email__container.mjs";
import { t as Head } from "../_libs/react-email__head.mjs";
import { t as Heading } from "../_libs/react-email__heading.mjs";
import { t as Hr } from "../_libs/react-email__hr.mjs";
import { t as Html } from "../_libs/react-email__html.mjs";
import { t as Preview } from "../_libs/react-email__preview.mjs";
import { t as Section } from "../_libs/react-email__section.mjs";
import { t as Text } from "../_libs/react-email__text.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var Email = ({ invoiceNumber = "", invoiceDate = "", companyName = "", senderName = "ABJAD Engineering Works" }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: `Invoice ${invoiceNumber} from ${senderName}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: brand,
						children: senderName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Heading, {
						style: h1,
						children: ["Invoice ", invoiceNumber]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						style: card,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: label,
										children: "Invoice No."
									}),
									" ",
									invoiceNumber
								]
							}),
							invoiceDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: label,
										children: "Date"
									}),
									" ",
									invoiceDate
								]
							}) : null,
							companyName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: label,
										children: "Billed to"
									}),
									" ",
									companyName
								]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: text,
						children: "The invoice PDF is attached to this email."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: muted,
						children: "Thank you for your business."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: muted,
						children: senderName
					})
				]
			})
		})
	]
});
var template = {
	component: Email,
	subject: (data) => `Invoice ${data["invoiceNumber"] ?? ""} from ${data["senderName"] ?? "ABJAD Engineering Works"}`.trim(),
	displayName: "Invoice sent to customer",
	previewData: {
		invoiceNumber: "12-fluid-tech",
		invoiceDate: "2026-08-29",
		companyName: "Fluid Tech Systems",
		senderName: "ABJAD Engineering Works"
	}
};
var main = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, Helvetica, sans-serif"
};
var container = {
	padding: "24px",
	maxWidth: "560px"
};
var brand = {
	fontSize: "12px",
	letterSpacing: "1px",
	textTransform: "uppercase",
	color: "#6b7280",
	margin: "0 0 8px"
};
var h1 = {
	fontSize: "22px",
	color: "#111827",
	margin: "0 0 16px"
};
var text = {
	fontSize: "14px",
	lineHeight: "22px",
	color: "#374151",
	margin: "0 0 12px"
};
var card = {
	backgroundColor: "#f9fafb",
	borderRadius: "8px",
	padding: "16px",
	margin: "16px 0"
};
var row = {
	fontSize: "14px",
	color: "#111827",
	margin: "0 0 6px"
};
var label = {
	display: "inline-block",
	width: "110px",
	color: "#6b7280"
};
var hr = {
	borderColor: "#e5e7eb",
	margin: "20px 0"
};
var muted = {
	fontSize: "12px",
	color: "#6b7280",
	margin: "0 0 4px"
};
/**
* Template registry — maps template names to their React Email components.
*/
var TEMPLATES = { "invoice-sent": template };
//#endregion
export { TEMPLATES as t };

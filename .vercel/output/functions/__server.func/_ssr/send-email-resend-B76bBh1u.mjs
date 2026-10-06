import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as render } from "../_libs/@react-email/render+[...].mjs";
import { t as TEMPLATES } from "./registry-Cw0Cwt6J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/send-email-resend-B76bBh1u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var SITE_NAME = "ABJAD Engineering Works";
var FROM_ADDRESS = process.env["RESEND_FROM_ADDRESS"] || "invoices@abjadengineeringworks.in";
/**
* Renders a registered React Email template and sends it through Resend
* using the project's own RESEND_API_KEY. Throws on provider failure with
* the upstream status and body included.
*/
async function sendResendEmail(templateName, to, options = {}) {
	const apiKey = process.env["RESEND_API_KEY"];
	if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
	const template = TEMPLATES[templateName];
	if (!template) throw new Error(`Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(", ")}`);
	const recipient = template.to || to;
	if (!recipient) throw new Error("Recipient is required (the template defines no fixed recipient)");
	const templateData = options.templateData ?? {};
	const element = import_react.createElement(template.component, templateData);
	const html = await render(element);
	const text = await render(element, { plainText: true });
	const subject = typeof template.subject === "function" ? template.subject(templateData) : template.subject;
	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			from: `${SITE_NAME} <${FROM_ADDRESS}>`,
			to: [recipient],
			subject,
			html,
			text,
			...options.replyTo ? { reply_to: options.replyTo } : {},
			...options.attachments?.length ? { attachments: options.attachments.map((a) => ({
				filename: a.filename,
				content: a.content,
				...a.contentType ? { content_type: a.contentType } : {}
			})) } : {}
		})
	});
	if (!response.ok) {
		const errorBody = await response.text();
		console.error(`[resend] send failed [${response.status}]: ${errorBody}`);
		throw new Error(`Resend request failed [${response.status}]: ${errorBody}`);
	}
	return {
		sent: true,
		id: (await response.json().catch(() => ({}))).id
	};
}
/** Sends a ready-made HTML email through Resend (no template registry lookup). */
async function sendResendHtmlEmail(opts) {
	const apiKey = process.env["RESEND_API_KEY"];
	if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			from: `${SITE_NAME} <${FROM_ADDRESS}>`,
			to: [opts.to],
			subject: opts.subject,
			html: opts.html,
			...opts.text ? { text: opts.text } : {},
			...opts.replyTo ? { reply_to: opts.replyTo } : {},
			...opts.attachments?.length ? { attachments: opts.attachments.map((a) => ({
				filename: a.filename,
				content: a.content,
				...a.contentType ? { content_type: a.contentType } : {}
			})) } : {}
		})
	});
	if (!response.ok) {
		const errorBody = await response.text();
		console.error(`[resend] send failed [${response.status}]: ${errorBody}`);
		throw new Error(`Resend request failed [${response.status}]: ${errorBody}`);
	}
	return {
		sent: true,
		id: (await response.json().catch(() => ({}))).id
	};
}
//#endregion
export { sendResendEmail, sendResendHtmlEmail };

//#region node_modules/.nitro/vite/services/ssr/assets/sales-documents-CfQh3Qhc.js
var SALES_DOCUMENTS = {
	tax_invoice: {
		table: "invoices",
		itemsTable: "invoice_items",
		panelPath: "/invoices",
		label: "Tax Invoice",
		prefix: ""
	},
	proforma: {
		table: "performa",
		itemsTable: "performa_items",
		panelPath: "/proformas",
		label: "Proforma Invoice",
		prefix: "pf-"
	},
	quotation: {
		table: "quotation",
		itemsTable: "quotation_items",
		panelPath: "/quotations",
		label: "Quotation",
		prefix: "qt-"
	},
	delivery_challan: {
		table: "challan",
		itemsTable: "challan_items",
		panelPath: "/challans",
		label: "Delivery Challan",
		prefix: "dc-"
	}
};
function salesDocumentConfig(kind) {
	return SALES_DOCUMENTS[kind];
}
function isSalesDocumentKind(value) {
	return value in SALES_DOCUMENTS;
}
//#endregion
export { salesDocumentConfig as n, isSalesDocumentKind as t };

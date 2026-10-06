import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Route$4 } from "./router-CkOQzNmy.mjs";
import { t as InvoiceForm } from "./invoice-form-CzTgyY8d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoices._id.edit-BAKb1QD_.js
var import_jsx_runtime = require_jsx_runtime();
function EditPage() {
	const { id } = Route$4.useParams();
	const { kind } = Route$4.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoiceForm, {
		editId: id,
		documentType: kind ?? "tax_invoice"
	}, `${kind}-${id}`);
}
//#endregion
export { EditPage as component };

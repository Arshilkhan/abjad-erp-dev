import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { C as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { i as NewPODialog } from "./router-CkOQzNmy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/purchases.new-Cbms4Nth.js
var import_jsx_runtime = require_jsx_runtime();
function NewPurchaseOrderPage() {
	const navigate = useNavigate({ from: "/purchases/new" });
	const queryClient = useQueryClient();
	const returnToPurchases = () => navigate({ to: "/purchases" });
	const handleSaved = async () => {
		await queryClient.invalidateQueries({ queryKey: ["purchase_orders"] });
		await returnToPurchases();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewPODialog, {
		open: true,
		onClose: returnToPurchases,
		onSaved: handleSaved
	});
}
//#endregion
export { NewPurchaseOrderPage as component };

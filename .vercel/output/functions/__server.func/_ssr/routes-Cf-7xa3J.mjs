import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { S as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useAuth } from "./router-CkOQzNmy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cf-7xa3J.js
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	const { user, loading } = useAuth();
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: user ? "/dashboard" : "/auth" });
}
//#endregion
export { Index as component };

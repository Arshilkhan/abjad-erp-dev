import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { r as createServerFn } from "./server-CLqueqhS.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-CYA_x1QZ.mjs";
import { f as Trash2 } from "../_libs/lucide-react.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBJ7eSG_.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Label, a as useAuth, o as PANELS } from "./router-CkOQzNmy.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Checkbox } from "./checkbox-kt6FvQcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-DSUFo1te.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var listAppUsers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("18a52846064de54c02432e991eea4ab62b183a1fc1a48d39461c93e573f06611"));
var createAppUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.email?.includes("@")) throw new Error("Valid email required");
	if (!input.password || input.password.length < 8) throw new Error("Password must be at least 8 characters");
	return input;
}).handler(createSsrRpc("7b8416df0fd9a1185a3b3b6c3d25ed708f1df63619f4a7ca60cd46eb64a2b574"));
var setUserPanels = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("9d6bea1cdb986fde31b1304b57fac68d867957f36203da9e477eeb7a78160b81"));
var deleteAppUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("5cae714715f87171e2dbb8b1145a1dc86bf08436993e0fe73a425c03bd929f59"));
function UsersPanel() {
	const { isAdmin, loading } = useAuth();
	const qc = useQueryClient();
	const fetchUsers = useServerFn(listAppUsers);
	const createFn = useServerFn(createAppUser);
	const saveFn = useServerFn(setUserPanels);
	const delFn = useServerFn(deleteAppUser);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [newPanels, setNewPanels] = (0, import_react.useState)([]);
	const [draft, setDraft] = (0, import_react.useState)({});
	const { data: users, isLoading } = useQuery({
		queryKey: ["app-users"],
		queryFn: () => fetchUsers(),
		enabled: isAdmin
	});
	const create = useMutation({
		mutationFn: () => createFn({ data: {
			email,
			password,
			fullName,
			panels: newPanels
		} }),
		onSuccess: () => {
			toast.success("User created");
			setEmail("");
			setPassword("");
			setFullName("");
			setNewPanels([]);
			qc.invalidateQueries({ queryKey: ["app-users"] });
		},
		onError: (e) => toast.error(e?.message ?? "Could not create user")
	});
	const save = useMutation({
		mutationFn: (v) => saveFn({ data: v }),
		onSuccess: () => {
			toast.success("Permissions updated");
			qc.invalidateQueries({ queryKey: ["app-users"] });
		},
		onError: (e) => toast.error(e?.message ?? "Could not save permissions")
	});
	const remove = useMutation({
		mutationFn: (userId) => delFn({ data: { userId } }),
		onSuccess: () => {
			toast.success("User deleted");
			qc.invalidateQueries({ queryKey: ["app-users"] });
		},
		onError: (e) => toast.error(e?.message ?? "Could not delete user")
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading…"
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "You don't have access to this section."
	});
	const panelsFor = (u) => draft[u.id] ?? u.panels;
	const toggle = (list, key) => list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Users",
			description: "Create users and control which panels each one can access."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Create new user"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "nu-name",
									children: "Full name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "nu-name",
									value: fullName,
									onChange: (e) => setFullName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "nu-email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "nu-email",
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "nu-pass",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "nu-pass",
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "Panel access"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4",
						children: PANELS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: newPanels.includes(p.key),
								onCheckedChange: () => setNewPanels((l) => toggle(l, p.key))
							}), p.label]
						}, p.key))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => create.mutate(),
						disabled: create.isPending,
						children: create.isPending ? "Creating…" : "Create user"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Existing users"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "space-y-4",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading users…"
			}) : (users ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No users yet."
			}) : (users ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: u.full_name ?? u.email
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: u.email
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [u.roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[10px] uppercase",
							children: r.replace("_", " ")
						}, r)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => {
								if (confirm(`Delete ${u.email}?`)) remove.mutate(u.id);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
						})]
					})]
				}), u.roles.some((r) => r === "admin" || r === "super_admin") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: "Admins have access to all panels."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4",
					children: PANELS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: panelsFor(u).includes(p.key),
							onCheckedChange: () => setDraft((d) => ({
								...d,
								[u.id]: toggle(panelsFor(u), p.key)
							}))
						}), p.label]
					}, p.key))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					className: "mt-3",
					disabled: save.isPending,
					onClick: () => save.mutate({
						userId: u.id,
						panels: panelsFor(u)
					}),
					children: "Save permissions"
				})] })]
			}, u.id))
		})] })
	] });
}
//#endregion
export { UsersPanel as component };

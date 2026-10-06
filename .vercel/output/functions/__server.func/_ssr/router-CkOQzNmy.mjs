import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR } from "./format-COxJqFG7.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { t as isSalesDocumentKind } from "./sales-documents-CfQh3Qhc.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { l as require_react_dom, u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { T as useRouter, _ as Outlet, b as createRootRouteWithContext, f as Scripts, g as createRouter, p as HeadContent, v as lazyRouteComponent, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./server-CLqueqhS.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-CYA_x1QZ.mjs";
import { t as Body } from "../_libs/react-email__body.mjs";
import { t as Button$1 } from "../_libs/react-email__button.mjs";
import { t as Container } from "../_libs/react-email__container.mjs";
import { t as Head } from "../_libs/react-email__head.mjs";
import { t as Heading } from "../_libs/react-email__heading.mjs";
import { t as Html } from "../_libs/react-email__html.mjs";
import { t as Link$1 } from "../_libs/react-email__link.mjs";
import { t as Preview } from "../_libs/react-email__preview.mjs";
import { n as render } from "../_libs/@react-email/render+[...].mjs";
import { t as Text } from "../_libs/react-email__text.mjs";
import { t as TEMPLATES } from "./registry-Cw0Cwt6J.mjs";
import { t as Label$1 } from "../_libs/radix-ui__react-label.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { T as Mail, X as ChevronDown, Z as Check, b as Plus, f as Trash2, q as ChevronUp, t as X } from "../_libs/lucide-react.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBJ7eSG_.mjs";
import { i as useQueryClient, n as useQuery, r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as createAuthEmailHandler } from "../_libs/@lovable.dev/email-js+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/label-DBD1bRRP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Label$1.displayName;
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/textarea-kko37XEX.js
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/select-CYB-gyWu.js
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/dialog-DIo89e4g.js
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/typeahead-input-DZ6La5zh.js
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
/**
* Text input with suggestions. Free-form typing allowed.
* Calls onSelect when a suggestion is picked, onChange for raw text.
* If user leaves the field with text that doesn't match any option,
* onMissing(text) is invoked (used to prompt "add new").
*/
function TypeaheadInput({ value, onChange, onSelect, onMissing, options, placeholder, className, inputClassName, disabled }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [highlight, setHighlight] = (0, import_react.useState)(0);
	const wrapRef = (0, import_react.useRef)(null);
	const [rect, setRect] = (0, import_react.useState)(null);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	const filtered = (0, import_react.useMemo)(() => {
		const q = value.trim().toLowerCase();
		if (!q) return options.slice(0, 8);
		return options.filter((o) => o.label.toLowerCase().includes(q) || (o.sublabel ?? "").toLowerCase().includes(q)).slice(0, 8);
	}, [value, options]);
	(0, import_react.useEffect)(() => {
		const onDoc = (e) => {
			if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);
	(0, import_react.useLayoutEffect)(() => {
		if (!open) return;
		const update = () => {
			const el = wrapRef.current;
			if (!el) return;
			const r = el.getBoundingClientRect();
			setRect({
				top: r.bottom + 4,
				left: r.left,
				width: r.width
			});
		};
		update();
		window.addEventListener("scroll", update, true);
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update, true);
			window.removeEventListener("resize", update);
		};
	}, [open, filtered.length]);
	const pick = (opt) => {
		onSelect(opt);
		onChange(opt.label);
		setOpen(false);
	};
	const handleBlur = () => {
		setTimeout(() => {
			const t = value.trim();
			if (!t) return;
			if (!options.find((o) => o.label.toLowerCase() === t.toLowerCase()) && onMissing) onMissing(t);
		}, 150);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: `relative ${className ?? ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			disabled,
			placeholder,
			className: inputClassName,
			onChange: (e) => {
				onChange(e.target.value);
				setOpen(true);
				setHighlight(0);
			},
			onFocus: () => setOpen(true),
			onBlur: handleBlur,
			onKeyDown: (e) => {
				if (!open) return;
				if (e.key === "ArrowDown") {
					e.preventDefault();
					setHighlight((h) => Math.min(h + 1, filtered.length - 1));
				} else if (e.key === "ArrowUp") {
					e.preventDefault();
					setHighlight((h) => Math.max(h - 1, 0));
				} else if (e.key === "Enter" && filtered[highlight]) {
					e.preventDefault();
					pick(filtered[highlight]);
				} else if (e.key === "Escape") setOpen(false);
			}
		}), mounted && open && filtered.length > 0 && rect && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			style: {
				position: "fixed",
				top: rect.top,
				left: rect.left,
				width: Math.max(rect.width, 220)
			},
			className: "z-[100] max-h-64 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md",
			children: filtered.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				onMouseDown: (e) => {
					e.preventDefault();
					pick(o);
				},
				onMouseEnter: () => setHighlight(i),
				className: `cursor-pointer px-3 py-1.5 text-sm ${i === highlight ? "bg-accent text-accent-foreground" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: o.label
				}), o.sublabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: o.sublabel
				})]
			}, o.id))
		}), document.body)]
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/po-email.functions-D5o3wuaY.js
/**
* Emails a purchase order to the vendor on file.
* The PO document is rendered as the HTML email body.
*/
var sendPoEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input?.poId) throw new Error("poId is required");
	return input;
}).handler(createSsrRpc("f32a019e8ff50e60dc4f8cdc69e03d18b10e4edbe56e3a4cdef57e9996e8bd23"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-CkOQzNmy.js
var styles_default = "/assets/styles-RdqTcbAf.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var PANELS = [
	{
		key: "dashboard",
		label: "Dashboard",
		url: "/dashboard"
	},
	{
		key: "invoices",
		label: "Invoices",
		url: "/invoices"
	},
	{
		key: "cancelled-invoices",
		label: "Cancelled Invoices",
		url: "/cancelled-invoices"
	},
	{
		key: "quotations",
		label: "Quotations",
		url: "/quotations"
	},
	{
		key: "challans",
		label: "Challans",
		url: "/challans"
	},
	{
		key: "customers",
		label: "Customers",
		url: "/customers"
	},
	{
		key: "products",
		label: "Products",
		url: "/products"
	},
	{
		key: "inventory",
		label: "Inventory",
		url: "/inventory"
	},
	{
		key: "rejected-items",
		label: "Rejected Items",
		url: "/rejected-items"
	},
	{
		key: "customer-credits",
		label: "Customer Credits",
		url: "/customer-credits"
	},
	{
		key: "purchases",
		label: "Purchases",
		url: "/purchases"
	},
	{
		key: "payments",
		label: "Payments",
		url: "/payments"
	},
	{
		key: "reports",
		label: "Reports",
		url: "/reports"
	},
	{
		key: "settings",
		label: "Settings",
		url: "/settings"
	},
	{
		key: "backups",
		label: "Backups",
		url: "/backups"
	}
];
var ADMIN_ROLES = ["super_admin", "admin"];
var Ctx = (0, import_react.createContext)({
	user: null,
	session: null,
	loading: true,
	roles: [],
	panels: [],
	isAdmin: false,
	canAccess: () => false,
	signOut: async () => {}
});
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [panels, setPanels] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const loadAccess = async (userId) => {
		const [{ data: rd }, { data: pd }] = await Promise.all([supabase.from("user_roles").select("role").eq("user_id", userId), supabase.from("user_panel_permissions").select("panel").eq("user_id", userId)]);
		setRoles((rd ?? []).map((r) => r.role));
		setPanels((pd ?? []).map((p) => p.panel));
	};
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
			setSession(s);
			setUser(s?.user ?? null);
			if (s?.user) setTimeout(() => {
				loadAccess(s.user.id);
			}, 0);
			else {
				setRoles([]);
				setPanels([]);
			}
		});
		supabase.auth.getSession().then(async ({ data }) => {
			setSession(data.session);
			setUser(data.session?.user ?? null);
			if (data.session?.user) await loadAccess(data.session.user.id);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	const isAdmin = roles.some((r) => ADMIN_ROLES.includes(r));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			user,
			session,
			loading,
			roles,
			panels,
			isAdmin,
			canAccess: (panel) => isAdmin || panels.includes(panel),
			signOut: async () => {
				await supabase.auth.signOut();
			}
		},
		children
	});
}
function useAuth() {
	return (0, import_react.useContext)(Ctx);
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$39 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ABJAD ERP — Billing & Inventory" },
			{
				name: "description",
				content: "GST billing, inventory, and manufacturing management for ABJAD Engineering Works."
			},
			{
				name: "author",
				content: "ABJAD Engineering Works"
			},
			{
				property: "og:title",
				content: "ABJAD ERP — Billing & Inventory"
			},
			{
				property: "og:description",
				content: "GST billing, inventory, and manufacturing management for ABJAD Engineering Works."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/fav-icon.png",
			type: "image/png"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$39.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})] })
	});
}
var $$splitComponentImporter$33 = () => import("./routes-Cf-7xa3J.mjs");
var Route$38 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "ABJAD ERP — Workspace" },
		{
			name: "description",
			content: "Open the ABJAD Engineering Works ERP workspace."
		},
		{
			property: "og:title",
			content: "ABJAD ERP — Workspace"
		},
		{
			property: "og:description",
			content: "Open the ABJAD Engineering Works ERP workspace."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("../_authenticated-Cyz8XTQV.mjs");
var Route$37 = createFileRoute("/_authenticated")({ component: lazyRouteComponent($$splitComponentImporter$32, "component") });
var $$splitComponentImporter$31 = () => import("./auth-BHys0cVR.mjs");
var Route$36 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — ABJAD ERP" },
		{
			name: "description",
			content: "Sign in to the ABJAD billing and inventory ERP."
		},
		{
			property: "og:title",
			content: "Sign in — ABJAD ERP"
		},
		{
			property: "og:description",
			content: "Sign in to the ABJAD billing and inventory ERP."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./reset-password-DaqqyY0Q.mjs");
var Route$35 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset password — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./backups-BpoBT6nx.mjs");
var Route$34 = createFileRoute("/_authenticated/backups")({
	head: () => ({ meta: [
		{ title: "Backups — ABJAD ERP" },
		{
			name: "description",
			content: "Back up ABJAD ERP invoices and records to Google Drive, on demand or on a schedule."
		},
		{
			property: "og:title",
			content: "Backups — ABJAD ERP"
		},
		{
			property: "og:description",
			content: "Back up ABJAD ERP invoices and records to Google Drive."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./cancelled-invoices-DluoIzGK.mjs");
var Route$33 = createFileRoute("/_authenticated/cancelled-invoices")({
	head: () => ({ meta: [{ title: "Cancelled Invoices — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./challans-DNWSs1RF.mjs");
var Route$32 = createFileRoute("/_authenticated/challans")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
var $$splitComponentImporter$26 = () => import("./customer-credits-DMJwIs-L.mjs");
var Route$31 = createFileRoute("/_authenticated/customer-credits")({
	head: () => ({ meta: [{ title: "Customer Credits — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./customers-B65Aanas.mjs");
var Route$30 = createFileRoute("/_authenticated/customers")({
	head: () => ({ meta: [{ title: "Customers — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./dashboard-tnuCYsoh.mjs");
var Route$29 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./inventory-CUO-x-Uf.mjs");
var Route$28 = createFileRoute("/_authenticated/inventory")({
	head: () => ({ meta: [{ title: "Inventory — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./invoices-rX6TL26a.mjs");
var Route$27 = createFileRoute("/_authenticated/invoices")({
	head: () => ({ meta: [{ title: "Invoices — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./payments-CtMsPWeS.mjs");
var Route$26 = createFileRoute("/_authenticated/payments")({
	head: () => ({ meta: [{ title: "Payments — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./products-LQTLaIUW.mjs");
var Route$25 = createFileRoute("/_authenticated/products")({
	head: () => ({ meta: [{ title: "Products — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./proformas-BuFyEm7l.mjs");
var Route$24 = createFileRoute("/_authenticated/proformas")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./purchases-Bp0WegSQ.mjs");
var Route$23 = createFileRoute("/_authenticated/purchases")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./quotations-CsKfc1I4.mjs");
var Route$22 = createFileRoute("/_authenticated/quotations")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./rejected-items-BaWFbw6m.mjs");
var Route$21 = createFileRoute("/_authenticated/rejected-items")({
	head: () => ({ meta: [{ title: "Rejected Items — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./reports-Dp2UXOFj.mjs");
var Route$20 = createFileRoute("/_authenticated/reports")({
	head: () => ({ meta: [{ title: "Reports — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./settings-HLjp5YpY.mjs");
var Route$19 = createFileRoute("/_authenticated/settings")({
	head: () => ({ meta: [{ title: "Settings — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./users-DSUFo1te.mjs");
var Route$18 = createFileRoute("/_authenticated/users")({
	head: () => ({ meta: [
		{ title: "Users & Permissions — ABJAD ERP" },
		{
			name: "description",
			content: "Create users and control which ERP panels each user can access."
		},
		{
			property: "og:title",
			content: "Users & Permissions — ABJAD ERP"
		},
		{
			property: "og:description",
			content: "Create users and control which ERP panels each user can access."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./challans.index-BFQ7Pn7d.mjs");
var Route$17 = createFileRoute("/_authenticated/challans/")({
	head: () => ({ meta: [
		{ title: "Delivery Challans — ABJAD ERP" },
		{
			name: "description",
			content: "Every delivery challan issued to customers, filed in one place."
		},
		{
			property: "og:title",
			content: "Delivery Challans — ABJAD ERP"
		},
		{
			property: "og:description",
			content: "Every delivery challan issued to customers, filed in one place."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./challans.new-B-ajHPtt.mjs");
var Route$16 = createFileRoute("/_authenticated/challans/new")({
	head: () => ({ meta: [
		{ title: "New Delivery Challan — ABJAD ERP" },
		{
			name: "description",
			content: "Create a new delivery challan."
		},
		{
			property: "og:title",
			content: "New Delivery Challan — ABJAD ERP"
		},
		{
			property: "og:description",
			content: "Create a new delivery challan."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./invoices.import-CuHDDxZy.mjs");
var Route$15 = createFileRoute("/_authenticated/invoices/import")({
	head: () => ({ meta: [{ title: "Import Invoice — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./invoices.new-CBKPpkBn.mjs");
var Route$14 = createFileRoute("/_authenticated/invoices/new")({
	head: () => ({ meta: [
		{ title: "New Tax Invoice — ABJAD ERP" },
		{
			name: "description",
			content: "Create a new GST tax invoice."
		},
		{
			property: "og:title",
			content: "New Tax Invoice — ABJAD ERP"
		},
		{
			property: "og:description",
			content: "Create a new GST tax invoice."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./proformas.index-DaQRnfXG.mjs");
var Route$13 = createFileRoute("/_authenticated/proformas/")({
	head: () => ({ meta: [
		{ title: "Proforma Invoices — ABJAD ERP" },
		{
			name: "description",
			content: "Create and manage customer proforma invoices."
		},
		{
			property: "og:title",
			content: "Proforma Invoices — ABJAD ERP"
		},
		{
			property: "og:description",
			content: "Create and manage customer proforma invoices."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./proformas.new-TzEvtKw5.mjs");
var Route$12 = createFileRoute("/_authenticated/proformas/new")({
	head: () => ({ meta: [
		{ title: "New Proforma Invoice — ABJAD ERP" },
		{
			name: "description",
			content: "Create a new proforma invoice."
		},
		{
			property: "og:title",
			content: "New Proforma Invoice — ABJAD ERP"
		},
		{
			property: "og:description",
			content: "Create a new proforma invoice."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./purchases.index-DgZY-Nej.mjs");
var Route$11 = createFileRoute("/_authenticated/purchases/")({
	head: () => ({ meta: [{ title: "Purchases — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var emptyLine = () => ({
	product_id: null,
	product_name: "",
	description: "",
	hsn: "",
	qty: 1,
	rate: 0,
	tax_pct: 18
});
function NewPODialog({ open, onClose, onSaved }) {
	const qc = useQueryClient();
	const { data: vendors = [] } = useQuery({
		queryKey: ["vendors-select"],
		queryFn: async () => (await supabase.from("vendors").select("*").order("vendor_name")).data ?? []
	});
	const { data: products = [] } = useQuery({
		queryKey: ["products-po-select"],
		queryFn: async () => (await supabase.from("products").select("*").order("product_name")).data ?? []
	});
	const productOptions = products.map((p) => ({
		id: p.id,
		label: p.product_name ?? "",
		sublabel: p.hsn_code ?? void 0
	}));
	const [poNumber, setPoNumber] = (0, import_react.useState)("");
	const [poDate, setPoDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [expected, setExpected] = (0, import_react.useState)("");
	const [vendorId, setVendorId] = (0, import_react.useState)("");
	const [vendor, setVendor] = (0, import_react.useState)({});
	const setV = (k, v) => setVendor((f) => ({
		...f,
		[k]: v
	}));
	const [isIgst, setIsIgst] = (0, import_react.useState)(false);
	const [notes, setNotes] = (0, import_react.useState)("");
	const [lines, setLines] = (0, import_react.useState)([emptyLine()]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const emailPo = useServerFn(sendPoEmail);
	const isNewVendor = !vendorId && !!(vendor.vendor_name ?? "").trim();
	const pickVendor = (id) => {
		const v = vendors.find((x) => x.id === id);
		if (!v) return;
		setVendorId(v.id);
		setVendor({ ...v });
	};
	const addLine = () => setLines((l) => [...l, emptyLine()]);
	const rmLine = (i) => setLines((l) => l.filter((_, idx) => idx !== i));
	const setLine = (i, k, v) => setLines((l) => l.map((r, idx) => idx === i ? {
		...r,
		[k]: v
	} : r));
	const netValue = lines.reduce((a, l) => a + Number(l.qty) * Number(l.rate), 0);
	const totalTax = lines.reduce((a, l) => a + Number(l.qty) * Number(l.rate) * Number(l.tax_pct) / 100, 0);
	const sgst = isIgst ? 0 : totalTax / 2;
	const cgst = isIgst ? 0 : totalTax / 2;
	const igst = isIgst ? totalTax : 0;
	const rawTotal = netValue + totalTax;
	const rounded = Math.round(rawTotal);
	const roundOff = rounded - rawTotal;
	const save = async (send = false) => {
		if (saving) return;
		if (!poNumber.trim()) return toast.error("PO number required");
		const name = (vendor.vendor_name ?? "").trim();
		if (!name) return toast.error("Vendor name is required");
		if (lines.some((l) => !l.product_name.trim() && !l.description.trim())) return toast.error("Every line needs a product name");
		setSaving(true);
		try {
			let vId = vendorId;
			if (!vId) {
				const existing = vendors.find((v) => (v.vendor_name ?? "").toLowerCase() === name.toLowerCase());
				if (existing) vId = existing.id;
				else {
					const { data: newVendor, error: vErr } = await supabase.from("vendors").insert({
						vendor_name: name,
						company_name: vendor.company_name || null,
						contact_person: vendor.contact_person || null,
						mobile: vendor.mobile || null,
						email: vendor.email || null,
						gst_number: vendor.gst_number || null,
						pan_number: vendor.pan_number || null,
						address: vendor.address || null,
						state: vendor.state || null,
						state_code: vendor.state_code || null,
						payment_terms: vendor.payment_terms || null
					}).select("id").single();
					if (vErr || !newVendor) {
						toast.error(vErr?.message ?? "Could not create vendor");
						return;
					}
					vId = newVendor.id;
					qc.invalidateQueries({ queryKey: ["vendors"] });
					qc.invalidateQueries({ queryKey: ["vendors-select"] });
					toast.success(`Vendor "${name}" added`);
				}
			}
			const { data: po, error } = await supabase.from("purchase_orders").insert({
				po_number: poNumber.trim(),
				po_date: poDate,
				expected_date: expected || null,
				vendor_id: vId,
				vendor_name_snapshot: name,
				vendor_gst_snapshot: vendor.gst_number || null,
				vendor_address_snapshot: vendor.address || null,
				is_igst: isIgst,
				net_value: netValue,
				sub_total: netValue,
				sgst_amount: sgst,
				cgst_amount: cgst,
				igst_amount: igst,
				round_off: roundOff,
				grand_total: rounded,
				notes: notes || null,
				status: send ? "sent" : "draft"
			}).select("*").single();
			if (error || !po) {
				toast.error(error?.message?.includes("duplicate key") ? `PO number "${poNumber}" already exists` : error?.message ?? "Could not create purchase order");
				return;
			}
			const items = lines.map((l, i) => ({
				purchase_order_id: po.id,
				sr_no: i + 1,
				product_id: l.product_id,
				description: [l.product_name.trim(), l.description.trim()].filter(Boolean).join(" — "),
				hsn_code: l.hsn || null,
				quantity: Number(l.qty) || 0,
				unit_rate: Number(l.rate) || 0,
				tax_pct: Number(l.tax_pct) || 0,
				tax_amount: Number(l.qty) * Number(l.rate) * Number(l.tax_pct) / 100,
				total_amount: Number(l.qty) * Number(l.rate) * (1 + Number(l.tax_pct) / 100)
			}));
			const { error: iErr } = await supabase.from("purchase_order_items").insert(items);
			if (iErr) {
				toast.error(iErr.message);
				return;
			}
			if (send) {
				await supabase.from("company_profile").select("*").limit(1).maybeSingle();
				if (vendor.email) try {
					const res = await emailPo({ data: { poId: po.id } });
					if (res?.sent) toast.success(`PO emailed to ${res.email}`);
					else toast.warning(`PO saved, but the email was not sent (${res?.reason ?? "unknown"})`);
				} catch (e) {
					toast.error(`PO saved, but the email could not be sent: ${e?.message ?? "unknown error"}`);
				}
				else toast.warning("PO saved and marked sent, but this vendor has no email on file");
			} else toast.success("Purchase order saved as draft");
			setPoNumber("");
			setNotes("");
			setVendorId("");
			setVendor({});
			setLines([emptyLine()]);
			onSaved();
			onClose();
		} catch (e) {
			console.error("PO save failed", e);
			toast.error(e?.message ?? "Something went wrong while saving");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[calc(100vw-1rem)] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New Purchase Order" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-4 [&>div]:min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PO Number *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: poNumber,
							onChange: (e) => setPoNumber(e.target.value),
							placeholder: "PO-2026-001"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PO Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: poDate,
							onChange: (e) => setPoDate(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Expected" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: expected,
							onChange: (e) => setExpected(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tax Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: isIgst ? "igst" : "sgst",
							onValueChange: (v) => setIsIgst(v === "igst"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "sgst",
								children: "SGST + CGST (intra-state)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "igst",
								children: "IGST (inter-state)"
							})] })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vendor Name *" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeaheadInput, {
									value: vendor.vendor_name ?? "",
									onChange: (v) => {
										setVendorId("");
										setV("vendor_name", v);
									},
									onSelect: (o) => pickVendor(o.id),
									options: vendors.map((v) => ({
										id: v.id,
										label: v.vendor_name,
										sublabel: v.company_name ?? v.gst_number ?? void 0
									})),
									placeholder: "Type to search or add new vendor"
								}),
								isNewVendor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "New vendor — will be saved for reuse."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Company Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: vendor.company_name ?? "",
								onChange: (e) => setV("company_name", e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Contact Person" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.contact_person ?? "",
							onChange: (e) => setV("contact_person", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mobile" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.mobile ?? "",
							onChange: (e) => setV("mobile", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.email ?? "",
							onChange: (e) => setV("email", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "GSTIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.gst_number ?? "",
							onChange: (e) => setV("gst_number", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PAN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.pan_number ?? "",
							onChange: (e) => setV("pan_number", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.state ?? "",
							onChange: (e) => setV("state", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.state_code ?? "",
							onChange: (e) => setV("state_code", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment Terms" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor.payment_terms ?? "",
							onChange: (e) => setV("payment_terms", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 sm:col-span-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: vendor.address ?? "",
								onChange: (e) => setV("address", e.target.value)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Line Items" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							onClick: addLine,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-3 w-3" }), "Add Line"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-md border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[700px] text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted/50 text-xs uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 text-left",
										children: "Product Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 text-left",
										children: "Description"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 w-20",
										children: "HSN"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 w-20",
										children: "Qty"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 w-24",
										children: "Rate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 w-20",
										children: "GST%"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 w-24 text-right",
										children: "Total"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-2 w-10" })
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeaheadInput, {
											value: l.product_name,
											options: productOptions,
											placeholder: "Product name",
											onChange: (v) => setLines((ls) => ls.map((r, idx) => idx === i ? {
												...r,
												product_name: v,
												product_id: null
											} : r)),
											onSelect: (opt) => {
												const p = products.find((x) => x.id === opt.id);
												setLines((ls) => ls.map((r, idx) => idx === i ? {
													...r,
													product_id: opt.id,
													product_name: opt.label,
													description: r.description || (p?.description ?? ""),
													hsn: r.hsn || (p?.hsn_code ?? ""),
													rate: r.rate || Number(p?.purchase_price ?? 0),
													tax_pct: p?.gst_percentage != null ? Number(p.gst_percentage) : r.tax_pct
												} : r));
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: l.description,
											onChange: (e) => setLine(i, "description", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: l.hsn,
											onChange: (e) => setLine(i, "hsn", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: l.qty,
											onChange: (e) => setLine(i, "qty", Number(e.target.value))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											step: "0.01",
											value: l.rate,
											onChange: (e) => setLine(i, "rate", Number(e.target.value))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: l.tax_pct,
											onChange: (e) => setLine(i, "tax_pct", Number(e.target.value))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1 text-right tabular-nums",
										children: formatINR(l.qty * l.rate * (1 + l.tax_pct / 100), { withSymbol: false })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => rmLine(i),
											disabled: lines.length === 1,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})
									})
								]
							}, i)) })]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 3,
						value: notes,
						onChange: (e) => setNotes(e.target.value)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Net Value",
								v: formatINR(netValue)
							}),
							isIgst ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "IGST",
								v: formatINR(igst)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "SGST",
								v: formatINR(sgst)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "CGST",
								v: formatINR(cgst)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Round Off",
								v: formatINR(roundOff)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Grand Total",
								v: formatINR(rounded),
								strong: true
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: onClose,
						disabled: saving,
						children: "Cancel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => save(false),
						disabled: saving,
						children: saving ? "Saving…" : "Save as Draft"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => save(true),
						disabled: saving,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mr-1 h-4 w-4" }), saving ? "Saving…" : "Save & Send"]
					})
				] })
			]
		})
	});
}
function Row({ k, v, strong }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex justify-between ${strong ? "border-t pt-1 font-bold text-base" : "text-muted-foreground"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums text-foreground",
			children: v
		})]
	});
}
var $$splitComponentImporter$5 = () => import("./purchases.new-Cbms4Nth.mjs");
var Route$10 = createFileRoute("/_authenticated/purchases/new")({
	head: () => ({ meta: [
		{ title: "New Purchase Order — ABJAD ERP" },
		{
			name: "description",
			content: "Create a new vendor purchase order."
		},
		{
			property: "og:title",
			content: "New Purchase Order — ABJAD ERP"
		},
		{
			property: "og:description",
			content: "Create a new vendor purchase order."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./quotations.index-DCaqq-HK.mjs");
var Route$9 = createFileRoute("/_authenticated/quotations/")({
	head: () => ({ meta: [
		{ title: "Quotations — ABJAD ERP" },
		{
			name: "description",
			content: "All customer quotations and proforma documents in one place."
		},
		{
			property: "og:title",
			content: "Quotations — ABJAD ERP"
		},
		{
			property: "og:description",
			content: "All customer quotations and proforma documents in one place."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./quotations.new-CFLm2NJZ.mjs");
var Route$8 = createFileRoute("/_authenticated/quotations/new")({
	head: () => ({ meta: [
		{ title: "New Quotation — ABJAD ERP" },
		{
			name: "description",
			content: "Create a new customer quotation."
		},
		{
			property: "og:title",
			content: "New Quotation — ABJAD ERP"
		},
		{
			property: "og:description",
			content: "Create a new customer quotation."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var Route$7 = createFileRoute("/api/google-drive/callback")({ server: { handlers: { GET: async ({ request }) => {
	const url = new URL(request.url);
	const origin = `${url.protocol}//${url.host}`;
	const back = (status) => new Response(null, {
		status: 302,
		headers: { location: `/backups?drive=${status}` }
	});
	const error = url.searchParams.get("error");
	if (error) return back(encodeURIComponent(error));
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	if (!code || !state) return back("missing_code");
	const { verifyState, exchangeCodeAndStore } = await import("./google-drive.server-CD-9kSxZ.mjs");
	const userId = await verifyState(state);
	if (!userId) return back("invalid_state");
	try {
		await exchangeCodeAndStore(code, origin, userId);
		return back("connected");
	} catch (e) {
		console.error("[google-drive callback]", e);
		return back("failed");
	}
} } } });
/**
* Hourly cron entry point. Runs the Drive backup only when the configured
* schedule is due. Protected by a shared secret header / bearer token.
*/
var Route$6 = createFileRoute("/api/public/backup-cron")({ server: { handlers: {
	GET: async ({ request }) => handle(request),
	POST: async ({ request }) => handle(request)
} } });
async function handle(request) {
	const secret = process.env["BACKUP_CRON_SECRET"] || process.env["CRON_SECRET"];
	if (!secret) return Response.json({ error: "Cron secret not configured" }, { status: 500 });
	if ((request.headers.get("x-backup-secret") ?? (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "")) !== secret) return new Response("Unauthorized", { status: 401 });
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: settings } = await supabaseAdmin.from("backup_settings").select("id, frequency, hour_utc, last_run_at").limit(1).maybeSingle();
	const s = settings;
	if (!s || s.frequency === "off") return Response.json({ skipped: "disabled" });
	const now = /* @__PURE__ */ new Date();
	const last = s.last_run_at ? new Date(s.last_run_at) : null;
	const minGapMs = s.frequency === "daily" ? 144e6 : s.frequency === "weekly" ? 5616e5 : 23328e5;
	if (last && now.getTime() - last.getTime() < minGapMs) return Response.json({ skipped: "too_soon" });
	await supabaseAdmin.from("backup_settings").update({ last_run_at: now.toISOString() }).eq("id", s.id);
	try {
		const { runBackup } = await import("./backup.server-DUAOmWO7.mjs");
		const result = await runBackup({ trigger: "scheduled" });
		return Response.json({
			ok: true,
			...result
		});
	} catch (e) {
		console.error("[backup-cron]", e);
		return Response.json({
			ok: false,
			error: e instanceof Error ? e.message : String(e)
		}, { status: 500 });
	}
}
var $$splitComponentImporter$2 = () => import("./invoices._id.index-BjhtvW_X.mjs");
var Route$5 = createFileRoute("/_authenticated/invoices/$id/")({
	validateSearch: (search) => {
		const k = typeof search.kind === "string" ? search.kind : "";
		return isSalesDocumentKind(k) ? { kind: k } : {};
	},
	head: () => ({ meta: [{ title: "Document — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./invoices._id.edit-BAKb1QD_.mjs");
var Route$4 = createFileRoute("/_authenticated/invoices/$id/edit")({
	validateSearch: (search) => {
		const k = typeof search.kind === "string" ? search.kind : "";
		return isSalesDocumentKind(k) ? { kind: k } : {};
	},
	head: () => ({ meta: [{ title: "Edit Invoice — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./invoices.folder._company-BTExJ0Q2.mjs");
var Route$3 = createFileRoute("/_authenticated/invoices/folder/$company")({
	head: () => ({ meta: [{ title: "Company Folder — ABJAD ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var SignupEmail = ({ siteName, siteUrl, recipient, confirmationUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: darkModeCss$4 }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Preview, { children: ["Confirm your email for ", siteName] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$5,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$5,
						children: "Confirm your email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$5,
						children: [
							"Thanks for signing up for",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								href: siteUrl,
								style: link$2,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: siteName })
							}),
							"!"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$5,
						children: [
							"Please confirm your email address (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								href: `mailto:${recipient}`,
								style: link$2,
								children: recipient
							}),
							") by clicking the button below:"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						className: "dm-btn",
						style: button$4,
						href: confirmationUrl,
						children: "Verify Email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer$5,
						children: "If you didn't create an account, you can safely ignore this email."
					})
				]
			})
		})
	]
});
var main$5 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$5 = { padding: "20px 25px" };
var h1$5 = {
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 20px"
};
var text$5 = {
	fontSize: "14px",
	color: "#55575d",
	lineHeight: "1.5",
	margin: "0 0 25px"
};
var link$2 = {
	color: "inherit",
	textDecoration: "underline"
};
var button$4 = {
	backgroundColor: "#000000",
	color: "#ffffff",
	fontSize: "14px",
	border: "1px solid #000000",
	borderRadius: "8px",
	padding: "12px 20px",
	textDecoration: "none"
};
var footer$5 = {
	fontSize: "12px",
	color: "#999999",
	margin: "30px 0 0"
};
var darkModeCss$4 = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  }
  [data-ogsc] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  [data-ogsb] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
`;
var InviteEmail = ({ siteName, siteUrl, confirmationUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: darkModeCss$3 }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Preview, { children: ["You've been invited to join ", siteName] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$4,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$4,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$4,
						children: "You've been invited"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$4,
						children: [
							"You've been invited to join",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								href: siteUrl,
								style: link$1,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: siteName })
							}),
							". Click the button below to accept the invitation and create your account."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						className: "dm-btn",
						style: button$3,
						href: confirmationUrl,
						children: "Accept Invitation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer$4,
						children: "If you weren't expecting this invitation, you can safely ignore this email."
					})
				]
			})
		})
	]
});
var main$4 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$4 = { padding: "20px 25px" };
var h1$4 = {
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 20px"
};
var text$4 = {
	fontSize: "14px",
	color: "#55575d",
	lineHeight: "1.5",
	margin: "0 0 25px"
};
var link$1 = {
	color: "inherit",
	textDecoration: "underline"
};
var button$3 = {
	backgroundColor: "#000000",
	color: "#ffffff",
	fontSize: "14px",
	border: "1px solid #000000",
	borderRadius: "8px",
	padding: "12px 20px",
	textDecoration: "none"
};
var footer$4 = {
	fontSize: "12px",
	color: "#999999",
	margin: "30px 0 0"
};
var darkModeCss$3 = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  }
  [data-ogsc] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  [data-ogsb] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
`;
var MagicLinkEmail = ({ siteName, confirmationUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: darkModeCss$2 }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Preview, { children: ["Your login link for ", siteName] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$3,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$3,
						children: "Your login link"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$3,
						children: [
							"Click the button below to log in to ",
							siteName,
							". This link will expire shortly."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						className: "dm-btn",
						style: button$2,
						href: confirmationUrl,
						children: "Log In"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer$3,
						children: "If you didn't request this link, you can safely ignore this email."
					})
				]
			})
		})
	]
});
var main$3 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$3 = { padding: "20px 25px" };
var h1$3 = {
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 20px"
};
var text$3 = {
	fontSize: "14px",
	color: "#55575d",
	lineHeight: "1.5",
	margin: "0 0 25px"
};
var button$2 = {
	backgroundColor: "#000000",
	color: "#ffffff",
	fontSize: "14px",
	border: "1px solid #000000",
	borderRadius: "8px",
	padding: "12px 20px",
	textDecoration: "none"
};
var footer$3 = {
	fontSize: "12px",
	color: "#999999",
	margin: "30px 0 0"
};
var darkModeCss$2 = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  }
  [data-ogsc] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  [data-ogsb] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
`;
var RecoveryEmail = ({ siteName, confirmationUrl, token }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: darkModeCss$1 }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Preview, { children: ["Your password reset code for ", siteName] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$2,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$2,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$2,
						children: "Reset your password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$2,
						children: [
							"We received a request to reset your password for ",
							siteName,
							". Enter this verification code on the password reset page:"
						]
					}),
					token ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: codeBox,
						children: token
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: text$2,
						children: "Alternatively, click the button below to choose a new password directly."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						className: "dm-btn",
						style: button$1,
						href: confirmationUrl,
						children: "Reset Password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer$2,
						children: "If you didn't request a password reset, you can safely ignore this email. Your password will not be changed."
					})
				]
			})
		})
	]
});
var main$2 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$2 = { padding: "20px 25px" };
var h1$2 = {
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 20px"
};
var text$2 = {
	fontSize: "14px",
	color: "#55575d",
	lineHeight: "1.5",
	margin: "0 0 25px"
};
var button$1 = {
	backgroundColor: "#000000",
	color: "#ffffff",
	fontSize: "14px",
	border: "1px solid #000000",
	borderRadius: "8px",
	padding: "12px 20px",
	textDecoration: "none"
};
var codeBox = {
	fontSize: "32px",
	fontWeight: "bold",
	letterSpacing: "8px",
	textAlign: "center",
	color: "#000000",
	backgroundColor: "#f4f4f5",
	border: "1px solid #e4e4e7",
	borderRadius: "8px",
	padding: "16px 0",
	margin: "0 0 25px"
};
var footer$2 = {
	fontSize: "12px",
	color: "#999999",
	margin: "30px 0 0"
};
var darkModeCss$1 = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  }
  [data-ogsc] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  [data-ogsb] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
`;
var EmailChangeEmail = ({ siteName, oldEmail, newEmail, confirmationUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: darkModeCss }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Preview, { children: ["Confirm your email change for ", siteName] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$1,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$1,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$1,
						children: "Confirm your email change"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$1,
						children: [
							"You requested to change your email address for ",
							siteName,
							" from",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								href: `mailto:${oldEmail}`,
								style: link,
								children: oldEmail
							}),
							" ",
							"to",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								href: `mailto:${newEmail}`,
								style: link,
								children: newEmail
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: text$1,
						children: "Click the button below to confirm this change:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						className: "dm-btn",
						style: button,
						href: confirmationUrl,
						children: "Confirm Email Change"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer$1,
						children: "If you didn't request this change, please secure your account immediately."
					})
				]
			})
		})
	]
});
var main$1 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$1 = { padding: "20px 25px" };
var h1$1 = {
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 20px"
};
var text$1 = {
	fontSize: "14px",
	color: "#55575d",
	lineHeight: "1.5",
	margin: "0 0 25px"
};
var link = {
	color: "inherit",
	textDecoration: "underline"
};
var button = {
	backgroundColor: "#000000",
	color: "#ffffff",
	fontSize: "14px",
	border: "1px solid #000000",
	borderRadius: "8px",
	padding: "12px 20px",
	textDecoration: "none"
};
var footer$1 = {
	fontSize: "12px",
	color: "#999999",
	margin: "30px 0 0"
};
var darkModeCss = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  }
  [data-ogsc] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  [data-ogsb] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
`;
var ReauthenticationEmail = ({ token }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: "Your verification code" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1,
						children: "Confirm reauthentication"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: text,
						children: "Use the code below to confirm your identity:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: codeStyle,
						children: token
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer,
						children: "This code will expire shortly. If you didn't request this, you can safely ignore this email."
					})
				]
			})
		})
	]
});
var main = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container = { padding: "20px 25px" };
var h1 = {
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 20px"
};
var text = {
	fontSize: "14px",
	color: "#55575d",
	lineHeight: "1.5",
	margin: "0 0 25px"
};
var codeStyle = {
	fontFamily: "Courier, monospace",
	fontSize: "22px",
	fontWeight: "bold",
	color: "#000000",
	margin: "0 0 30px"
};
var footer = {
	fontSize: "12px",
	color: "#999999",
	margin: "30px 0 0"
};
var EMAIL_TEMPLATES = {
	signup: SignupEmail,
	invite: InviteEmail,
	magiclink: MagicLinkEmail,
	recovery: RecoveryEmail,
	email_change: EmailChangeEmail,
	reauthentication: ReauthenticationEmail
};
var SITE_NAME$1 = "ABJAD ERP";
var SAMPLE_PROJECT_URL = "https://dev-erp.lovable.app";
var SAMPLE_EMAIL = "user@example.test";
var SAMPLE_DATA = {
	signup: {
		siteName: SITE_NAME$1,
		siteUrl: SAMPLE_PROJECT_URL,
		recipient: SAMPLE_EMAIL,
		confirmationUrl: SAMPLE_PROJECT_URL
	},
	magiclink: {
		siteName: SITE_NAME$1,
		confirmationUrl: SAMPLE_PROJECT_URL
	},
	recovery: {
		siteName: SITE_NAME$1,
		confirmationUrl: SAMPLE_PROJECT_URL,
		token: "123456"
	},
	invite: {
		siteName: SITE_NAME$1,
		siteUrl: SAMPLE_PROJECT_URL,
		confirmationUrl: SAMPLE_PROJECT_URL
	},
	email_change: {
		siteName: SITE_NAME$1,
		oldEmail: SAMPLE_EMAIL,
		email: SAMPLE_EMAIL,
		newEmail: SAMPLE_EMAIL,
		confirmationUrl: SAMPLE_PROJECT_URL
	},
	reauthentication: { token: "123456" }
};
var Route$2 = createFileRoute("/lovable/email/auth/preview")({ server: { handlers: { POST: async ({ request }) => {
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) return Response.json({ error: "Server configuration error" }, { status: 500 });
	const authHeader = request.headers.get("Authorization");
	if (!authHeader || authHeader !== `Bearer ${apiKey}`) return Response.json({ error: "Unauthorized" }, { status: 401 });
	let type;
	try {
		type = (await request.json()).type;
	} catch {
		return Response.json({ error: "Invalid JSON in request body" }, { status: 400 });
	}
	const EmailTemplate = EMAIL_TEMPLATES[type];
	if (!EmailTemplate) return Response.json({ error: `Unknown email type: ${type}` }, { status: 400 });
	const sampleData = SAMPLE_DATA[type] || {};
	const html = await render(import_react.createElement(EmailTemplate, sampleData));
	return new Response(html, {
		status: 200,
		headers: { "Content-Type": "text/html; charset=utf-8" }
	});
} } } });
var SITE_NAME = "ABJAD ERP";
var SENDER_DOMAIN = "notify.abjadengineeringworks.in";
var ROOT_DOMAIN = "abjadengineeringworks.in";
var FROM_DOMAIN = "abjadengineeringworks.in";
var SITE_URL = `https://${ROOT_DOMAIN}`;
var Route$1 = createFileRoute("/lovable/email/auth/webhook")({ server: { handlers: { POST: ({ request }) => {
	return createAuthEmailHandler({
		apiKey: process.env["LOVABLE_API_KEY"],
		from: `"${SITE_NAME}" <noreply@${FROM_DOMAIN}>`,
		senderDomain: SENDER_DOMAIN,
		sendUrl: process.env["LOVABLE_SEND_URL"],
		emails: {
			signup: {
				subject: "Confirm your email",
				render: (data) => import_react.createElement(SignupEmail, {
					siteName: SITE_NAME,
					siteUrl: SITE_URL,
					recipient: data.email,
					confirmationUrl: data.url
				})
			},
			invite: {
				subject: "You've been invited",
				render: (data) => import_react.createElement(InviteEmail, {
					siteName: SITE_NAME,
					siteUrl: SITE_URL,
					confirmationUrl: data.url
				})
			},
			magiclink: {
				subject: "Your login link",
				render: (data) => import_react.createElement(MagicLinkEmail, {
					siteName: SITE_NAME,
					confirmationUrl: data.url
				})
			},
			recovery: {
				subject: "Reset your password",
				render: (data) => import_react.createElement(RecoveryEmail, {
					siteName: SITE_NAME,
					confirmationUrl: data.url,
					token: data.token ?? ""
				})
			},
			email_change: {
				subject: "Confirm your new email",
				render: (data) => import_react.createElement(EmailChangeEmail, {
					siteName: SITE_NAME,
					oldEmail: data.old_email ?? "",
					email: data.email,
					newEmail: data.new_email ?? "",
					confirmationUrl: data.url
				})
			},
			reauthentication: {
				subject: "Your verification code",
				render: (data) => import_react.createElement(ReauthenticationEmail, { token: data.token ?? "" })
			}
		}
	})(request);
} } } });
var Route = createFileRoute("/lovable/email/transactional/preview")({ server: { handlers: { POST: async ({ request }) => {
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) return Response.json({ error: "Server configuration error" }, { status: 500 });
	if (request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") !== apiKey) return Response.json({ error: "Unauthorized" }, { status: 401 });
	const templateNames = Object.keys(TEMPLATES);
	const results = [];
	for (const name of templateNames) {
		const entry = TEMPLATES[name];
		const displayName = entry.displayName || name;
		if (!entry.previewData) {
			results.push({
				templateName: name,
				displayName,
				subject: "",
				html: "",
				status: "preview_data_required"
			});
			continue;
		}
		try {
			const html = await render(import_react.createElement(entry.component, entry.previewData));
			const resolvedSubject = typeof entry.subject === "function" ? entry.subject(entry.previewData) : entry.subject;
			results.push({
				templateName: name,
				displayName,
				subject: resolvedSubject,
				html,
				status: "ready"
			});
		} catch (err) {
			console.error("Failed to render template for preview", {
				template: name,
				error: err
			});
			results.push({
				templateName: name,
				displayName,
				subject: "",
				html: "",
				status: "render_failed",
				errorMessage: err instanceof Error ? err.message : String(err)
			});
		}
	}
	return Response.json({ templates: results });
} } } });
var IndexRoute = Route$38.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$39
});
var AuthenticatedRoute = Route$37.update({
	id: "/_authenticated",
	getParentRoute: () => Route$39
});
var AuthRoute = Route$36.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$39
});
var ResetPasswordRoute = Route$35.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$39
});
var AuthenticatedBackupsRoute = Route$34.update({
	id: "/backups",
	path: "/backups",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedCancelledInvoicesRoute = Route$33.update({
	id: "/cancelled-invoices",
	path: "/cancelled-invoices",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedChallansRoute = Route$32.update({
	id: "/challans",
	path: "/challans",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedCustomerCreditsRoute = Route$31.update({
	id: "/customer-credits",
	path: "/customer-credits",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedCustomersRoute = Route$30.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedDashboardRoute = Route$29.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedInventoryRoute = Route$28.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedInvoicesRoute = Route$27.update({
	id: "/invoices",
	path: "/invoices",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedPaymentsRoute = Route$26.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedProductsRoute = Route$25.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedProformasRoute = Route$24.update({
	id: "/proformas",
	path: "/proformas",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedPurchasesRoute = Route$23.update({
	id: "/purchases",
	path: "/purchases",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedQuotationsRoute = Route$22.update({
	id: "/quotations",
	path: "/quotations",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedRejectedItemsRoute = Route$21.update({
	id: "/rejected-items",
	path: "/rejected-items",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedReportsRoute = Route$20.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedSettingsRoute = Route$19.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedUsersRoute = Route$18.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedChallansIndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedChallansRoute
});
var AuthenticatedChallansNewRoute = Route$16.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AuthenticatedChallansRoute
});
var AuthenticatedInvoicesImportRoute = Route$15.update({
	id: "/import",
	path: "/import",
	getParentRoute: () => AuthenticatedInvoicesRoute
});
var AuthenticatedInvoicesNewRoute = Route$14.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AuthenticatedInvoicesRoute
});
var AuthenticatedProformasIndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedProformasRoute
});
var AuthenticatedProformasNewRoute = Route$12.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AuthenticatedProformasRoute
});
var AuthenticatedPurchasesIndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedPurchasesRoute
});
var AuthenticatedPurchasesNewRoute = Route$10.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AuthenticatedPurchasesRoute
});
var AuthenticatedQuotationsIndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedQuotationsRoute
});
var AuthenticatedQuotationsNewRoute = Route$8.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AuthenticatedQuotationsRoute
});
var ApiGoogleDriveCallbackRoute = Route$7.update({
	id: "/api/google-drive/callback",
	path: "/api/google-drive/callback",
	getParentRoute: () => Route$39
});
var ApiPublicBackupCronRoute = Route$6.update({
	id: "/api/public/backup-cron",
	path: "/api/public/backup-cron",
	getParentRoute: () => Route$39
});
var AuthenticatedInvoicesIdIndexRoute = Route$5.update({
	id: "/$id/",
	path: "/$id/",
	getParentRoute: () => AuthenticatedInvoicesRoute
});
var AuthenticatedInvoicesIdEditRoute = Route$4.update({
	id: "/$id/edit",
	path: "/$id/edit",
	getParentRoute: () => AuthenticatedInvoicesRoute
});
var AuthenticatedInvoicesFolderCompanyRoute = Route$3.update({
	id: "/folder/$company",
	path: "/folder/$company",
	getParentRoute: () => AuthenticatedInvoicesRoute
});
var LovableEmailAuthPreviewRoute = Route$2.update({
	id: "/lovable/email/auth/preview",
	path: "/lovable/email/auth/preview",
	getParentRoute: () => Route$39
});
var LovableEmailAuthWebhookRoute = Route$1.update({
	id: "/lovable/email/auth/webhook",
	path: "/lovable/email/auth/webhook",
	getParentRoute: () => Route$39
});
var LovableEmailTransactionalPreviewRoute = Route.update({
	id: "/lovable/email/transactional/preview",
	path: "/lovable/email/transactional/preview",
	getParentRoute: () => Route$39
});
var AuthenticatedChallansRouteChildren = {
	AuthenticatedChallansNewRoute,
	AuthenticatedChallansIndexRoute
};
var AuthenticatedChallansRouteWithChildren = AuthenticatedChallansRoute._addFileChildren(AuthenticatedChallansRouteChildren);
var AuthenticatedInvoicesRouteChildren = {
	AuthenticatedInvoicesImportRoute,
	AuthenticatedInvoicesNewRoute,
	AuthenticatedInvoicesIdEditRoute,
	AuthenticatedInvoicesFolderCompanyRoute,
	AuthenticatedInvoicesIdIndexRoute
};
var AuthenticatedInvoicesRouteWithChildren = AuthenticatedInvoicesRoute._addFileChildren(AuthenticatedInvoicesRouteChildren);
var AuthenticatedProformasRouteChildren = {
	AuthenticatedProformasNewRoute,
	AuthenticatedProformasIndexRoute
};
var AuthenticatedProformasRouteWithChildren = AuthenticatedProformasRoute._addFileChildren(AuthenticatedProformasRouteChildren);
var AuthenticatedPurchasesRouteChildren = {
	AuthenticatedPurchasesNewRoute,
	AuthenticatedPurchasesIndexRoute
};
var AuthenticatedPurchasesRouteWithChildren = AuthenticatedPurchasesRoute._addFileChildren(AuthenticatedPurchasesRouteChildren);
var AuthenticatedQuotationsRouteChildren = {
	AuthenticatedQuotationsNewRoute,
	AuthenticatedQuotationsIndexRoute
};
var AuthenticatedRouteChildren = {
	AuthenticatedBackupsRoute,
	AuthenticatedCancelledInvoicesRoute,
	AuthenticatedChallansRoute: AuthenticatedChallansRouteWithChildren,
	AuthenticatedCustomerCreditsRoute,
	AuthenticatedCustomersRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedInventoryRoute,
	AuthenticatedInvoicesRoute: AuthenticatedInvoicesRouteWithChildren,
	AuthenticatedPaymentsRoute,
	AuthenticatedProductsRoute,
	AuthenticatedProformasRoute: AuthenticatedProformasRouteWithChildren,
	AuthenticatedPurchasesRoute: AuthenticatedPurchasesRouteWithChildren,
	AuthenticatedQuotationsRoute: AuthenticatedQuotationsRoute._addFileChildren(AuthenticatedQuotationsRouteChildren),
	AuthenticatedRejectedItemsRoute,
	AuthenticatedReportsRoute,
	AuthenticatedSettingsRoute,
	AuthenticatedUsersRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRoute: AuthenticatedRoute._addFileChildren(AuthenticatedRouteChildren),
	AuthRoute,
	ResetPasswordRoute,
	ApiGoogleDriveCallbackRoute,
	ApiPublicBackupCronRoute,
	LovableEmailAuthPreviewRoute,
	LovableEmailAuthWebhookRoute,
	LovableEmailTransactionalPreviewRoute
};
var routeTree = Route$39._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Label as S, SelectContent as _, useAuth as a, SelectValue as b, TypeaheadInput as c, DialogDescription as d, DialogFooter as f, Select as g, DialogTrigger as h, NewPODialog as i, Dialog as l, DialogTitle as m, Route$4 as n, PANELS as o, DialogHeader as p, Route$5 as r, sendPoEmail as s, router_exports as t, DialogContent as u, SelectItem as v, Textarea as x, SelectTrigger as y };

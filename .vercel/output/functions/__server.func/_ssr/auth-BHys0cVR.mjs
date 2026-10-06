import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { C as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as EyeOff, z as Eye } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Label, a as useAuth } from "./router-CkOQzNmy.mjs";
import { t as aew_logo_default } from "./aew-logo-CKFlGa9z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BHys0cVR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RECOVERY_SESSION_MARKER = "abjad-password-recovery-active";
function AuthPage() {
	const nav = useNavigate();
	const { user, loading } = useAuth();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [showNewPassword, setShowNewPassword] = (0, import_react.useState)(false);
	const [showConfirmPassword, setShowConfirmPassword] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [checkingRecoveryRefresh, setCheckingRecoveryRefresh] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const clearRecoverySessionAfterRefresh = async () => {
			if (window.sessionStorage.getItem(RECOVERY_SESSION_MARKER) === "true") {
				window.sessionStorage.removeItem(RECOVERY_SESSION_MARKER);
				await supabase.auth.signOut();
				setMode("signin");
			}
			setCheckingRecoveryRefresh(false);
		};
		clearRecoverySessionAfterRefresh();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!checkingRecoveryRefresh && !loading && user && mode === "signin") nav({ to: "/dashboard" });
	}, [
		user,
		loading,
		mode,
		nav,
		checkingRecoveryRefresh
	]);
	const describe = (error) => {
		const err = error;
		const msg = err?.message?.trim();
		if (!msg || msg === "{}" || /fetch|network|failed to fetch/i.test(msg) || (err?.status ?? 0) >= 500) return "Can't reach the server right now. Please try again in a moment.";
		return msg;
	};
	const signIn = async (e) => {
		e.preventDefault();
		window.sessionStorage.removeItem(RECOVERY_SESSION_MARKER);
		setBusy(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		setBusy(false);
		if (error) return toast.error(describe(error));
		toast.success("Signed in");
		nav({ to: "/dashboard" });
	};
	const sendOtp = async (e) => {
		e.preventDefault();
		setBusy(true);
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
		setBusy(false);
		if (error) return toast.error(describe(error));
		toast.success("Verification code sent to your email");
		setMode("forgot-otp");
	};
	const verifyOtp = async (e) => {
		e.preventDefault();
		setBusy(true);
		const { error } = await supabase.auth.verifyOtp({
			email,
			token: otp.trim(),
			type: "recovery"
		});
		setBusy(false);
		if (error) return toast.error(describe(error));
		window.sessionStorage.setItem(RECOVERY_SESSION_MARKER, "true");
		toast.success("Code verified");
		setMode("forgot-new");
	};
	const updatePassword = async (e) => {
		e.preventDefault();
		if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");
		if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
		setBusy(true);
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		if (error) {
			setBusy(false);
			return toast.error(describe(error));
		}
		window.sessionStorage.removeItem(RECOVERY_SESSION_MARKER);
		await supabase.auth.signOut();
		setBusy(false);
		toast.success("Password updated. Please sign in.");
		setPassword("");
		setOtp("");
		setNewPassword("");
		setConfirmPassword("");
		setMode("signin");
	};
	if (checkingRecoveryRefresh) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid h-screen grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-background md:grid-cols-[45fr_55fr] md:grid-rows-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative hidden flex-col overflow-hidden bg-primary px-14 py-12 text-primary-foreground md:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "h-full w-full",
						preserveAspectRatio: "xMidYMid slice",
						viewBox: "0 0 800 800",
						xmlns: "http://www.w3.org/2000/svg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "bgGrad",
									x1: "0%",
									y1: "0%",
									x2: "100%",
									y2: "100%",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "oklch(0.32 0.10 255)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "55%",
											stopColor: "oklch(0.24 0.09 255)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "oklch(0.20 0.08 255)"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
									id: "glowTop",
									cx: "80%",
									cy: "20%",
									r: "60%",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "oklch(0.58 0.12 255 / 0.22)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "oklch(0.58 0.12 255 / 0)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
									id: "glowBottom",
									cx: "20%",
									cy: "90%",
									r: "55%",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "oklch(0.50 0.10 240 / 0.18)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "oklch(0.50 0.10 240 / 0)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "arcGrad",
									x1: "0%",
									y1: "0%",
									x2: "100%",
									y2: "100%",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "oklch(1 0 0 / 0.08)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "oklch(1 0 0 / 0)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
									id: "grid",
									width: "72",
									height: "72",
									patternUnits: "userSpaceOnUse",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M 72 0 L 0 0 0 72",
										fill: "none",
										stroke: "oklch(1 0 0 / 0.035)",
										strokeWidth: "1"
									})
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								width: "800",
								height: "800",
								fill: "url(#bgGrad)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								width: "800",
								height: "800",
								fill: "url(#grid)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "640",
								cy: "160",
								r: "360",
								fill: "url(#glowTop)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "160",
								cy: "680",
								r: "320",
								fill: "url(#glowBottom)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M -40 600 Q 200 480 400 560 T 840 520",
								fill: "none",
								stroke: "url(#arcGrad)",
								strokeWidth: "2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M -40 680 Q 220 560 440 640 T 840 600",
								fill: "none",
								stroke: "url(#arcGrad)",
								strokeWidth: "1.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								stroke: "oklch(1 0 0 / 0.05)",
								strokeWidth: "1.5",
								fill: "none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "720",
										cy: "280",
										r: "90"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "720",
										cy: "280",
										r: "130"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "120",
										y1: "120",
										x2: "240",
										y2: "220"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "240",
										y1: "220",
										x2: "220",
										y2: "380"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "240",
										cy: "220",
										r: "4",
										fill: "oklch(1 0 0 / 0.10)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "220",
										cy: "380",
										r: "4",
										fill: "oklch(1 0 0 / 0.10)"
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-primary/25" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-10 flex flex-1 flex-col justify-center pt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-[380px] space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-semibold leading-tight",
							children: "Billing and inventory, in one place."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base leading-relaxed text-primary-foreground/80",
							children: "Invoices, challans, purchases and payments — managed end to end for your engineering works."
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden border-b-4 border-warning bg-primary px-6 pb-3 pt-8 text-primary-foreground md:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 mx-auto max-w-[400px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-7 inline-flex items-center bg-primary-foreground p-2 shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: aew_logo_default,
									alt: "ABJAD Engineering Works",
									className: "h-12 w-auto object-contain"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase text-primary-foreground/70",
								children: "ABJAD Engineering Works"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-[300px] text-xl font-semibold leading-snug",
								children: "Billing and inventory, wherever work takes you."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-8 -right-8 h-28 w-28 rotate-12 border-2 border-primary-foreground/10" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-5 right-12 h-12 w-12 rotate-12 border border-primary-foreground/10" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 items-start justify-center overflow-hidden bg-background px-6 py-8 md:items-center md:p-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-[400px]",
					children: [
						mode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-7 md:mb-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-semibold tracking-tight",
								children: "Welcome back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm text-muted-foreground",
								children: "Sign in to continue to ABJAD ERP."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: signIn,
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "e1",
										children: "Email address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "e1",
										type: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										className: "h-11 rounded-lg"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "p1",
											children: "Password"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setMode("forgot-email"),
											className: "text-sm font-medium text-primary hover:underline",
											children: "Forgot password?"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "p1",
											type: showPassword ? "text" : "password",
											required: true,
											value: password,
											onChange: (e) => setPassword(e.target.value),
											className: "h-11 rounded-lg pr-11"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "ghost",
											size: "icon",
											className: "absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:text-foreground",
											onClick: () => setShowPassword((visible) => !visible),
											"aria-label": showPassword ? "Hide password" : "Show password",
											title: showPassword ? "Hide password" : "Show password",
											children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-11 w-full rounded-lg text-base font-medium",
									disabled: busy,
									children: busy ? "Signing in…" : "Sign in"
								})
							]
						})] }),
						mode === "forgot-email" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-semibold tracking-tight",
								children: "Reset your password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Enter your email address and we'll send you a verification code."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: sendOtp,
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "fe",
										children: "Email address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "fe",
										type: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										className: "h-11 rounded-lg"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-11 w-full rounded-lg text-base font-medium",
									disabled: busy,
									children: busy ? "Sending code…" : "Send verification code"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMode("signin"),
									className: "w-full text-center text-sm font-medium text-primary hover:underline",
									children: "Back to sign in"
								})
							]
						})] }),
						mode === "forgot-otp" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-semibold tracking-tight",
								children: "Check your email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [
									"We sent a 6-digit verification code to ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: email
									}),
									"."
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: verifyOtp,
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "otp",
										children: "Verification code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "otp",
										type: "text",
										inputMode: "numeric",
										autoComplete: "one-time-code",
										required: true,
										maxLength: 6,
										placeholder: "Enter 6-digit code",
										value: otp,
										onChange: (e) => setOtp(e.target.value.replace(/\D/g, "")),
										className: "h-11 rounded-lg tracking-[0.3em]"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-11 w-full rounded-lg text-base font-medium",
									disabled: busy || otp.length !== 6,
									children: busy ? "Verifying…" : "Verify code"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMode("forgot-email"),
									className: "w-full text-center text-sm font-medium text-primary hover:underline",
									children: "Use a different email"
								})
							]
						})] }),
						mode === "forgot-new" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-semibold tracking-tight",
								children: "Set a new password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Choose a strong password of at least 8 characters."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: updatePassword,
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "np1",
										children: "New password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "np1",
											type: showNewPassword ? "text" : "password",
											required: true,
											minLength: 8,
											value: newPassword,
											onChange: (e) => setNewPassword(e.target.value),
											className: "h-11 rounded-lg pr-11"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "ghost",
											size: "icon",
											className: "absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:text-foreground",
											onClick: () => setShowNewPassword((visible) => !visible),
											"aria-label": showNewPassword ? "Hide new password" : "Show new password",
											title: showNewPassword ? "Hide new password" : "Show new password",
											children: showNewPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "np2",
										children: "Confirm password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "np2",
											type: showConfirmPassword ? "text" : "password",
											required: true,
											minLength: 8,
											value: confirmPassword,
											onChange: (e) => setConfirmPassword(e.target.value),
											className: "h-11 rounded-lg pr-11"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "ghost",
											size: "icon",
											className: "absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:text-foreground",
											onClick: () => setShowConfirmPassword((visible) => !visible),
											"aria-label": showConfirmPassword ? "Hide confirmation password" : "Show confirmation password",
											title: showConfirmPassword ? "Hide confirmation password" : "Show confirmation password",
											children: showConfirmPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-11 w-full rounded-lg text-base font-medium",
									disabled: busy,
									children: busy ? "Updating…" : "Update password"
								})
							]
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { AuthPage as component };

import { i as __toESM } from "../_runtime.mjs";
import { i as formatDate } from "./format-COxJqFG7.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { r as createServerFn } from "./server-CLqueqhS.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-CYA_x1QZ.mjs";
import { O as Link2, P as HardDriveDownload, W as CloudUpload, _ as RefreshCw, c as Unplug } from "../_libs/lucide-react.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBJ7eSG_.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Label, _ as SelectContent, b as SelectValue, g as Select, v as SelectItem, y as SelectTrigger } from "./router-CkOQzNmy.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/backups-BpoBT6nx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Returns the Google consent URL so the browser can start the OAuth flow. */
var getGoogleDriveAuthUrl = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("542bac49ba76ab09cb0065d62a06ab00cbe50264811ab2b20b6c5f92dc57cc7c"));
var getBackupStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a654e0a991f0ac01d980ee9a5a1c08772630ad6a14d76cdbeb7effc83e137285"));
var saveBackupSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (![
		"off",
		"daily",
		"weekly",
		"monthly"
	].includes(input?.frequency)) throw new Error("Invalid backup frequency.");
	const hour = Number(input.hour_utc);
	if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new Error("Invalid backup hour.");
	return {
		frequency: input.frequency,
		hour_utc: hour
	};
}).handler(createSsrRpc("bf4abba475811682a8057b5ebf678bd3a1fab8e82e6876576317d7a2aa71b1e9"));
var disconnectGoogleDrive = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("58f26b0f771388c458e0971fde192b1c3280fa298a10058c360853fe4215cd06"));
var runBackupNow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("3ddd903848bf4ee03371baed83c1338cb47560614b318b4d506c768e9bb81ac4"));
var fmtSize = (n) => {
	const b = Number(n ?? 0);
	if (!b) return "-";
	if (b > 1048576) return `${(b / 1024 / 1024).toFixed(1)} MB`;
	return `${(b / 1024).toFixed(0)} KB`;
};
var fmtWhen = (s) => s ? `${formatDate(s)} ${new Date(s).toLocaleTimeString([], {
	hour: "2-digit",
	minute: "2-digit"
})}` : "-";
function BackupsPage() {
	const qc = useQueryClient();
	const status = useServerFn(getBackupStatus);
	const runNow = useServerFn(runBackupNow);
	const saveSettings = useServerFn(saveBackupSettings);
	const disconnect = useServerFn(disconnectGoogleDrive);
	const authUrl = useServerFn(getGoogleDriveAuthUrl);
	const { data, isLoading, error } = useQuery({
		queryKey: ["backup-status"],
		queryFn: () => status({ data: void 0 })
	});
	const [frequency, setFrequency] = (0, import_react.useState)("off");
	const [hour, setHour] = (0, import_react.useState)("20");
	(0, import_react.useEffect)(() => {
		if (data?.settings) {
			setFrequency(data.settings.frequency ?? "off");
			setHour(String(data.settings.hour_utc ?? 20));
		}
	}, [data]);
	(0, import_react.useEffect)(() => {
		const p = new URLSearchParams(window.location.search).get("drive");
		if (!p) return;
		if (p === "connected") toast.success("Google Drive connected");
		else toast.error(`Google Drive connection failed (${p})`);
		window.history.replaceState({}, "", "/backups");
		qc.invalidateQueries({ queryKey: ["backup-status"] });
	}, [qc]);
	const connect = useMutation({
		mutationFn: async () => await authUrl({ data: void 0 }),
		onSuccess: (r) => {
			window.location.href = r.url;
		},
		onError: (e) => toast.error(e.message)
	});
	const backup = useMutation({
		mutationFn: async () => await runNow({ data: void 0 }),
		onSuccess: (r) => {
			toast.success(`Backup uploaded: ${r.fileName} (${r.invoiceCount} invoices)`);
			qc.invalidateQueries({ queryKey: ["backup-status"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const save = useMutation({
		mutationFn: async () => await saveSettings({ data: {
			frequency,
			hour_utc: Number(hour)
		} }),
		onSuccess: () => {
			toast.success("Backup schedule saved");
			qc.invalidateQueries({ queryKey: ["backup-status"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const unlink = useMutation({
		mutationFn: async () => await disconnect({ data: void 0 }),
		onSuccess: () => {
			toast.success("Google Drive disconnected");
			qc.invalidateQueries({ queryKey: ["backup-status"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Backups",
		description: "Save your invoices and records to Google Drive."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border p-8 text-center text-sm text-muted-foreground",
		children: error.message
	})] });
	const connected = !!data?.connected;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Backups",
			description: "Save your invoices and records to Google Drive."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Google Drive"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "A ZIP with every invoice PDF plus spreadsheet exports is stored in an “ABJAD ERP Backups” folder." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "Loading…"
				}) : connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "bg-emerald-600 hover:bg-emerald-600",
						children: "Connected"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: data?.accountEmail ?? "Google account"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => backup.mutate(),
							disabled: backup.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "mr-1 h-4 w-4" }), backup.isPending ? "Backing up…" : "Back up now"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => connect.mutate(),
							disabled: connect.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1 h-4 w-4" }), " Reconnect"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => unlink.mutate(),
							disabled: unlink.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unplug, { className: "mr-1 h-4 w-4" }), " Disconnect"]
						})
					]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "Not connected yet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => connect.mutate(),
					disabled: connect.isPending,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "mr-1 h-4 w-4" }), " Connect Google Drive"]
				})] })
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Automatic backup"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Runs by itself at the chosen hour (UTC)." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Frequency"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: frequency,
								onValueChange: setFrequency,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "off",
										children: "Off"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "daily",
										children: "Every 2 days"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "weekly",
										children: "Every week"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "monthly",
										children: "Every month"
									})
								] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-md border border-dashed p-2 text-xs text-muted-foreground",
								children: "Automatic backups run once a day, at a time chosen by the host."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: ["Last automatic run: ", fmtWhen((data?.settings)?.last_run_at)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => save.mutate(),
							disabled: save.isPending,
							children: save.isPending ? "Saving…" : "Save schedule"
						})
					})
				]
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "History"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "The last 20 backup runs." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/50 text-xs uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-left",
									children: "Started"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-left",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-left",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-right",
									children: "Invoices"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-right",
									children: "Size"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-left",
									children: "File"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [(data?.history ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "p-6 text-center text-muted-foreground",
							children: "No backups yet."
						}) }), (data?.history ?? []).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2",
									children: fmtWhen(h.started_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 capitalize",
									children: h.trigger_source
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2",
									children: h.status === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-emerald-600 hover:bg-emerald-600",
										children: "Success"
									}) : h.status === "failed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "destructive",
										title: h.error ?? "",
										children: "Failed"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: "Running"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 text-right",
									children: h.invoice_count ?? "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 text-right",
									children: fmtSize(h.file_size)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2",
									children: h.drive_link ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										className: "text-primary underline",
										href: h.drive_link,
										target: "_blank",
										rel: "noreferrer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDriveDownload, { className: "mr-1 inline h-3.5 w-3.5" }), h.file_name ?? "Open"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: h.error ? String(h.error).slice(0, 80) : "-"
									})
								})
							]
						}, h.id))] })]
					})
				})
			})]
		})
	] });
}
//#endregion
export { BackupsPage as component };

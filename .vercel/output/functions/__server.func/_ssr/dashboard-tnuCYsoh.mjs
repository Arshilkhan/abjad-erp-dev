import { i as __toESM } from "../_runtime.mjs";
import { a as formatINR, i as formatDate, n as billNo, r as formatCompactINR } from "./format-COxJqFG7.mjs";
import { t as supabase } from "./client-CuGeCb7I.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Package, K as CircleAlert, L as FileSpreadsheet, M as IndianRupee, d as TrendingUp, i as Users, p as ShoppingCart } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as SelectContent, a as useAuth, b as SelectValue, g as Select, v as SelectItem, y as SelectTrigger } from "./router-CkOQzNmy.mjs";
import { t as PageHeader } from "./page-header-DEJXM2OA.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-tnuCYsoh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function currentFyStart() {
	const d = /* @__PURE__ */ new Date();
	return d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
}
function useDashboardData(fyStart) {
	return useQuery({
		queryKey: ["dashboard", fyStart],
		queryFn: async () => {
			const today = /* @__PURE__ */ new Date();
			const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
			const startMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
			const fyFrom = `${fyStart}-04-01`;
			const fyTo = `${fyStart + 1}-04-01`;
			const [todaySales, monthSales, outstanding, customersCount, productsInv, pendingQuotes, recentInvoices, monthly] = await Promise.all([
				supabase.from("invoices").select("grand_total").gte("created_at", startToday).eq("invoice_type", "tax_invoice"),
				supabase.from("invoices").select("grand_total").gte("created_at", startMonth).eq("invoice_type", "tax_invoice"),
				supabase.from("invoices").select("grand_total, amount_paid").in("status", ["sent", "partial"]),
				supabase.from("customers").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("products").select("stock_quantity, purchase_price"),
				supabase.from("quotation").select("id", {
					count: "exact",
					head: true
				}).eq("status", "sent"),
				supabase.from("invoices").select("id, invoice_number, customer_name_snapshot, grand_total, status, invoice_date").order("created_at", { ascending: false }).limit(5),
				supabase.from("invoices").select("invoice_date, grand_total, status").gte("invoice_date", fyFrom).lt("invoice_date", fyTo).neq("status", "cancelled")
			]);
			const sum = (rows) => (rows ?? []).reduce((a, r) => a + Number(r.grand_total ?? 0), 0);
			const outstandingTotal = (outstanding.data ?? []).reduce((a, r) => a + (Number(r.grand_total ?? 0) - Number(r.amount_paid ?? 0)), 0);
			const inventoryValue = (productsInv.data ?? []).reduce((a, r) => a + Number(r.stock_quantity ?? 0) * Number(r.purchase_price ?? 0), 0);
			const monthMap = /* @__PURE__ */ new Map();
			for (let i = 0; i < 12; i++) {
				const d = new Date(fyStart, 3 + i, 1);
				const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
				monthMap.set(key, 0);
			}
			(monthly.data ?? []).forEach((r) => {
				const key = String(r.invoice_date).slice(0, 7);
				if (monthMap.has(key)) monthMap.set(key, (monthMap.get(key) ?? 0) + Number(r.grand_total ?? 0));
			});
			const chart = Array.from(monthMap.entries()).map(([k, v]) => ({
				month: (/* @__PURE__ */ new Date(k + "-01")).toLocaleDateString("en-IN", { month: "short" }),
				sales: v
			}));
			return {
				todaySales: sum(todaySales.data),
				monthSales: sum(monthSales.data),
				outstandingTotal,
				customersCount: customersCount.count ?? 0,
				inventoryValue,
				pendingQuotesCount: pendingQuotes.count ?? 0,
				recent: recentInvoices.data ?? [],
				chart
			};
		}
	});
}
var statusStyles = {
	paid: "bg-[color:oklch(0.92_0.06_155)] text-[color:oklch(0.35_0.14_155)] border-transparent",
	sent: "bg-secondary text-secondary-foreground",
	partial: "bg-[color:oklch(0.94_0.09_75)] text-[color:oklch(0.40_0.15_75)] border-transparent",
	draft: "bg-muted text-muted-foreground",
	cancelled: "bg-destructive/10 text-destructive border-transparent"
};
function Kpi({ label, value, sub, icon: Icon, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "relative overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute inset-y-0 left-0 w-1 ${accent ?? "bg-primary"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-2xl font-bold tracking-tight tabular-nums",
						children: value
					}),
					sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: sub
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md bg-secondary p-2 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				})]
			})
		})]
	});
}
function Dashboard() {
	const { isAdmin } = useAuth();
	const [fyStart, setFyStart] = (0, import_react.useState)(currentFyStart());
	const { data, isLoading } = useDashboardData(fyStart);
	const fyOptions = (0, import_react.useMemo)(() => {
		const cur = currentFyStart();
		return [
			cur - 2,
			cur - 1,
			cur,
			cur + 1
		];
	}, []);
	const fyLabel = `${fyStart}-${String(fyStart + 1).slice(-2)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Dashboard",
			description: isAdmin ? "Live snapshot of sales, inventory, and receivables." : "Your most recent invoices."
		}),
		isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Today's Sales",
					value: formatINR(data?.todaySales ?? 0),
					icon: IndianRupee
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Monthly Sales",
					value: formatCompactINR(data?.monthSales ?? 0),
					sub: formatINR(data?.monthSales ?? 0),
					icon: TrendingUp,
					accent: "bg-chart-2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Outstanding",
					value: formatCompactINR(data?.outstandingTotal ?? 0),
					sub: formatINR(data?.outstandingTotal ?? 0),
					icon: CircleAlert,
					accent: "bg-warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Total Customers",
					value: String(data?.customersCount ?? 0),
					icon: Users,
					accent: "bg-chart-3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Inventory Value",
					value: formatCompactINR(data?.inventoryValue ?? 0),
					sub: formatINR(data?.inventoryValue ?? 0),
					icon: Package,
					accent: "bg-chart-2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Pending Quotations",
					value: String(data?.pendingQuotesCount ?? 0),
					icon: FileSpreadsheet,
					accent: "bg-chart-4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Pending POs",
					value: "0",
					icon: ShoppingCart,
					accent: "bg-chart-5"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Financial Year",
					value: fyLabel,
					sub: "April – March",
					icon: TrendingUp
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `mt-6 grid gap-4 ${isAdmin ? "lg:grid-cols-3" : ""}`,
			children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between space-y-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base",
						children: ["Monthly Sales — FY ", fyLabel]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: String(fyStart),
						onValueChange: (v) => setFyStart(Number(v)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-8 w-36 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: fyOptions.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: String(y),
							children: [
								"FY ",
								y,
								"-",
								String(y + 1).slice(-2)
							]
						}, y)) })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: data?.chart ?? [],
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "#e2e8f0",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									stroke: "#64748b",
									fontSize: 12
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "#64748b",
									fontSize: 12,
									tickFormatter: (v) => formatCompactINR(v)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (v) => [formatINR(Number(v)), "Sales"],
									contentStyle: {
										borderRadius: 8,
										border: "1px solid #e2e8f0"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "sales",
									fill: "#2563eb",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row items-center justify-between space-y-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Recent Invoices"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/invoices",
					className: "text-xs font-medium text-primary hover:underline",
					children: "View all"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-5 text-sm text-muted-foreground",
					children: "Loading…"
				}) : (data?.recent ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "p-5 text-sm text-muted-foreground",
					children: [
						"No invoices yet. ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/invoices",
							className: "text-primary hover:underline",
							children: "Create one"
						}),
						"."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: data.recent.map((inv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between px-5 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium text-sm",
								children: billNo(inv.invoice_number)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: [
									inv.customer_name_snapshot ?? "—",
									" • ",
									formatDate(inv.invoice_date)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold tabular-nums",
								children: formatINR(inv.grand_total)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: `mt-1 text-[10px] font-medium uppercase ${statusStyles[inv.status] ?? ""}`,
								children: inv.status
							})]
						})]
					}, inv.id))
				})
			})] })]
		})
	] });
}
//#endregion
export { Dashboard as component };

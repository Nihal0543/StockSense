import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as Boxes, M as ArrowRight, S as FileChartColumnIncreasing, a as TrendingUp, f as Plus, g as PackageX, h as Package, i as TriangleAlert, j as Bell, r as Upload, u as ShieldAlert } from "../_libs/lucide-react.mjs";
import { i as useCurrentUser } from "./use-current-user-susDe7cr.mjs";
import { a as formatDateTime, f as useStockStore, i as formatDate, r as daysLabel } from "./store-CI4xhis3.mjs";
import { t as Button } from "./button-B0j3GnJP.mjs";
import { a as PageHeader, i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-vxmViGqq.mjs";
import { i as useCatalog, n as countByRisk, t as atRisk } from "./selectors-DyjYHDXe.mjs";
import { t as KpiCard } from "./kpi-card-DJscfmpH.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Cx8cnEVm.mjs";
import { t as RiskBadge } from "./risk-badge-VyZ5CF1V.mjs";
import { t as EmptyState } from "./empty-state--AZKMyur.mjs";
import { d as ResponsiveContainer, f as Tooltip, l as Pie, n as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
import { t as ForecastChart } from "./forecast-chart-umKTjUMU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-HM36Tyiq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = {
	Safe: "#15803D",
	Watch: "#C2410C",
	Critical: "#DC2626",
	"Out of Stock": "#7F1D1D"
};
function HealthChart({ counts }) {
	const data = [
		{
			name: "Safe",
			value: counts.safe
		},
		{
			name: "Watch",
			value: counts.watch
		},
		{
			name: "Critical",
			value: counts.critical
		},
		{
			name: "Out of Stock",
			value: counts.out_of_stock
		}
	].filter((d) => d.value > 0);
	const total = Object.values(counts).reduce((a, b) => a + b, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-40 w-40 shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
					data,
					dataKey: "value",
					nameKey: "name",
					innerRadius: 48,
					outerRadius: 70,
					paddingAngle: 2,
					stroke: "transparent",
					children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[d.name] }, d.name))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
					borderRadius: 12,
					border: "1px solid #E2E8F0",
					fontSize: 12
				} })] })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-w-0 flex-1 space-y-2",
			children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2 text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-2 rounded-full",
						style: { background: COLORS[d.name] }
					}), d.name]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums font-medium text-foreground",
					children: [d.value, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1 text-xs font-normal text-muted-foreground",
						children: [
							"(",
							total ? Math.round(d.value / total * 100) : 0,
							"%)"
						]
					})]
				})]
			}, d.name))
		})]
	});
}
function OwnerDashboard() {
	const user = useCurrentUser();
	const catalog = useCatalog();
	const alerts = useStockStore((s) => s.alerts);
	const history = useStockStore((s) => s.history);
	const forecasts = useStockStore((s) => s.forecasts);
	const counts = countByRisk(catalog);
	const attention = atRisk(catalog).sort((a, b) => {
		const order = {
			out_of_stock: 0,
			critical: 1,
			watch: 2,
			safe: 3
		};
		const byRisk = order[a.insight.risk] - order[b.insight.risk];
		if (byRisk !== 0) return byRisk;
		return (a.insight.daysUntilStockout ?? 999) - (b.insight.daysUntilStockout ?? 999);
	});
	const headline = attention[0];
	const urgentCount = counts.out_of_stock + counts.critical;
	const openAlerts = alerts.filter((a) => a.status === "open").sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
	const defaultId = attention[0]?.product.id ?? catalog[0]?.product.id ?? "";
	const [productId, setProductId] = (0, import_react.useState)(defaultId);
	const [horizon, setHorizon] = (0, import_react.useState)(14);
	const selected = catalog.find((c) => c.product.id === productId) ?? catalog[0];
	const firstName = user?.displayName?.split(" ")[0] ?? "there";
	const chartKey = (0, import_react.useMemo)(() => `${selected?.product.id}-${horizon}`, [selected?.product.id, horizon]);
	if (!catalog.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, { title: `Good to see you, ${firstName}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-5" }),
			title: "No inventory data yet.",
			description: "Upload your sales and stock CSV to generate your first prediction.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/upload",
					children: "Upload data"
				})
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `Good to see you, ${firstName}`,
				description: "Here is what needs attention in the shop today — not a spreadsheet dump.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/upload",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Upload data"]
					})
				})
			}),
			headline ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 rounded-xl bg-navy px-4 py-3 text-navy-fg sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0 text-amber" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold",
								children: [
									urgentCount,
									" product",
									urgentCount === 1 ? "" : "s",
									" need action today."
								]
							}),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-navy-muted",
								children: headline.insight.risk === "out_of_stock" ? `${headline.product.name} is already out of stock.` : `${headline.product.name} is the most urgent — expected to run out ${daysLabel(headline.insight.daysUntilStockout).toLowerCase()}.`
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					asChild: true,
					className: "shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/inventory",
						children: "Review now"
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Total products",
						value: catalog.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Products at risk",
						value: counts.watch + counts.critical + counts.out_of_stock,
						hint: "Watch, critical, or out",
						tone: "watch",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Critical",
						value: counts.critical,
						hint: "Likely to run out within 7 days",
						tone: "critical",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Out of stock",
						value: counts.out_of_stock,
						hint: "Customers cannot buy these today",
						tone: "oos",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageX, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,4fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Inventory health" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthChart, { counts }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex-row items-center justify-between space-y-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Needs a reorder" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/inventory",
						className: "text-xs font-medium text-primary hover:underline",
						children: "View all"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "px-0 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "divide-y",
						children: [attention.slice(0, 5).map(({ product, insight }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/inventory/$productId",
							params: { productId: product.id },
							className: "flex items-center gap-3 px-5 py-3 hover:bg-muted/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: product.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										product.currentStock,
										" ",
										product.unit,
										" left · run-out",
										" ",
										formatDate(insight.predictedStockoutDate),
										" · reorder",
										" ",
										insight.recommendedReorderQty
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { risk: insight.risk })]
						}) }, product.id)), !attention.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "px-5 py-6 text-sm text-muted-foreground",
							children: "Everything is comfortably above reorder levels."
						}) : null]
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Demand forecast" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Historical sales against what StockSense expects next."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: productId,
						onValueChange: setProductId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[220px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose a product" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: catalog.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c.product.id,
							children: c.product.name
						}, c.product.id)) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex rounded-lg bg-muted p-1",
						children: [
							7,
							14,
							30
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setHorizon(h),
							className: `h-8 rounded-md px-3 text-xs font-medium ${horizon === h ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
							children: [h, " days"]
						}, h))
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForecastChart, {
				history: history[selected.product.id] ?? [],
				forecast: forecasts[selected.product.id] ?? [],
				horizon
			}) }, chartKey) : null })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex-row items-center justify-between space-y-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent alerts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/alerts",
						className: "text-xs font-medium text-primary hover:underline",
						children: "Open inbox"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "px-0 pb-2",
					children: openAlerts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y",
						children: openAlerts.map((a) => {
							const p = catalog.find((c) => c.product.id === a.productId)?.product;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 px-5 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: p?.name ?? a.productId
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Shortage ",
											formatDate(a.predictedShortageDate),
											" ·",
											" ",
											formatDateTime(a.createdAt)
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { risk: a.severity })]
							}, a.id);
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-5 py-6 text-sm text-muted-foreground",
						children: "No open alerts."
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Quick actions" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
							to: "/upload",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
							label: "Upload sales & stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
							to: "/products",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }),
							label: "Add a product"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
							to: "/predictions",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4" }),
							label: "View predictions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
							to: "/alerts",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }),
							label: "View alerts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
							to: "/reports",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumnIncreasing, { className: "size-4" }),
							label: "Generate a report"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
							to: "/inventory",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "size-4" }),
							label: "Browse inventory"
						})
					]
				})] })]
			})
		]
	});
}
function QuickAction({ to, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "flex h-11 items-center gap-3 rounded-lg border border-transparent px-3 text-sm font-medium hover:border-border hover:bg-muted/70",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-8 place-items-center rounded-md bg-secondary text-primary",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 text-muted-foreground" })
		]
	});
}
//#endregion
export { OwnerDashboard as component };

import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as formatDate, o as formatNumber, s as formatPercent, u as predictedDemand } from "./store-CI4xhis3.mjs";
import { a as PageHeader, t as Card } from "./card-vxmViGqq.mjs";
import { i as useCatalog, r as matchesRisk } from "./selectors-DyjYHDXe.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Cx8cnEVm.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CvedoCk7.mjs";
import { t as RiskBadge } from "./risk-badge-VyZ5CF1V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/predictions-mhcw2uSs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PredictionsPage() {
	const catalog = useCatalog();
	const [horizon, setHorizon] = (0, import_react.useState)(14);
	const [risk, setRisk] = (0, import_react.useState)("all");
	const rows = (0, import_react.useMemo)(() => {
		const order = {
			out_of_stock: 0,
			critical: 1,
			watch: 2,
			safe: 3
		};
		return catalog.filter((c) => matchesRisk(c.insight.risk, risk)).sort((a, b) => order[a.insight.risk] - order[b.insight.risk]);
	}, [catalog, risk]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Shortage predictions",
				description: "For each product: how much you will sell, when stock hits zero, and how much to order."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex rounded-lg bg-muted p-1",
					children: [
						7,
						14,
						30
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setHorizon(h),
						className: `h-8 rounded-md px-3 text-xs font-medium ${horizon === h ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
						children: [
							"Next ",
							h,
							" days"
						]
					}, h))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: risk,
					onValueChange: setRisk,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All risk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "out_of_stock",
							children: "Out of Stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "critical",
							children: "Critical"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "watch",
							children: "Watch"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "safe",
							children: "Safe"
						})
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden overflow-x-auto md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
						className: "min-w-[56rem]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Stock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Demand"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Stockout" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Horizon" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Risk" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Conf."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Reorder"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: rows.map(({ product, insight }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/inventory/$productId",
								params: { productId: product.id },
								className: "font-medium hover:underline",
								children: product.name
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right tabular-nums",
								children: formatNumber(product.currentStock)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right tabular-nums",
								children: formatNumber(predictedDemand(insight.avgDailySales, horizon))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(insight.predictedStockoutDate) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: "text-muted-foreground",
								children: [horizon, " days"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { risk: insight.risk }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right tabular-nums",
								children: formatPercent(insight.confidence)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right tabular-nums font-medium",
								children: formatNumber(insight.recommendedReorderQty)
							})
						] }, product.id)) })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y md:hidden",
					children: rows.map(({ product, insight }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/inventory/$productId",
						params: { productId: product.id },
						className: "block p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: product.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { risk: insight.risk })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								"Demand ",
								formatNumber(predictedDemand(insight.avgDailySales, horizon)),
								" · run-out",
								" ",
								formatDate(insight.predictedStockoutDate),
								" · order ",
								insight.recommendedReorderQty
							]
						})]
					}, product.id))
				})]
			})
		]
	});
}
//#endregion
export { PredictionsPage as component };

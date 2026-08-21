import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { p as Phone } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as cn } from "./router-BRoFgmkY.mjs";
import { a as formatDateTime, f as useStockStore, i as formatDate } from "./store-CI4xhis3.mjs";
import { t as Button } from "./button-B0j3GnJP.mjs";
import { a as PageHeader, t as Card } from "./card-vxmViGqq.mjs";
import { t as RiskBadge } from "./risk-badge-VyZ5CF1V.mjs";
import { t as EmptyState } from "./empty-state--AZKMyur.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts-BpQ2xOjr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AlertsPage() {
	const alerts = useStockStore((s) => s.alerts);
	const products = useStockStore((s) => s.products);
	const resolve = useStockStore((s) => s.resolveAlert);
	const reopen = useStockStore((s) => s.reopenAlert);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const rows = (0, import_react.useMemo)(() => {
		return alerts.filter((a) => {
			if (filter === "resolved") return a.status === "resolved";
			if (filter === "all") return a.status === "open";
			if (filter === "critical") return a.status === "open" && (a.severity === "critical" || a.severity === "out_of_stock");
			return a.status === "open" && a.severity === "watch";
		}).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	}, [alerts, filter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Alerts",
				description: "When a product is heading for a shortage, it shows up here with what to order and who to call."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "inline-flex flex-wrap rounded-lg bg-muted p-1",
				children: [
					["all", "Open"],
					["critical", "Critical"],
					["watch", "Watch"],
					["resolved", "Resolved"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilter(id),
					className: cn("h-8 rounded-md px-3 text-xs font-medium", filter === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"),
					children: label
				}, id))
			}),
			!rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nothing in this inbox.",
				description: "When stock nears a shortage, StockSense will raise an alert here."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: rows.map((a) => {
					const p = products.find((x) => x.id === a.productId);
					const loud = a.severity === "critical" || a.severity === "out_of_stock";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: cn("p-4 sm:p-5", loud && a.status === "open" && "ring-1 ring-critical/30"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/inventory/$productId",
											params: { productId: a.productId },
											className: "font-semibold hover:underline",
											children: p?.name ?? a.productId
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { risk: a.severity })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
										className: "mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-xs text-muted-foreground",
												children: "Current stock"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "font-medium tabular-nums",
												children: p ? `${p.currentStock} ${p.unit}` : "—"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-xs text-muted-foreground",
												children: "Predicted shortage"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "font-medium",
												children: formatDate(a.predictedShortageDate)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-xs text-muted-foreground",
												children: "Reorder quantity"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "font-medium tabular-nums",
												children: a.recommendedReorderQty
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-xs text-muted-foreground",
												children: "Raised"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "font-medium",
												children: formatDateTime(a.createdAt)
											})] })
										]
									}),
									p ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 flex items-center gap-2 text-sm text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }),
											p.supplierName,
											" · ",
											p.supplierContact
										]
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex shrink-0 gap-2",
								children: a.status === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => {
										resolve(a.id);
										toast.success("Marked as resolved.");
									},
									children: "Mark resolved"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => reopen(a.id),
									children: "Reopen"
								})
							})]
						})
					}, a.id);
				})
			})
		]
	});
}
//#endregion
export { AlertsPage as component };

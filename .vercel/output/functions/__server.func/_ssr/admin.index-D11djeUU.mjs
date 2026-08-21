import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { P as Activity, k as BrainCircuit, l as Shield, n as Users, r as Upload } from "../_libs/lucide-react.mjs";
import { a as formatDateTime, f as useStockStore } from "./store-CI4xhis3.mjs";
import { t as Button } from "./button-B0j3GnJP.mjs";
import { a as PageHeader, i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-vxmViGqq.mjs";
import { t as Badge } from "./badge-DLcatF6i.mjs";
import { t as KpiCard } from "./kpi-card-DJscfmpH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-D11djeUU.js
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const users = useStockStore((s) => s.teamUsers);
	const uploads = useStockStore((s) => s.uploads);
	const alerts = useStockStore((s) => s.alerts);
	const products = useStockStore((s) => s.products);
	const model = useStockStore((s) => s.model);
	const storeName = useStockStore((s) => s.storeName);
	const active = users.filter((u) => u.status === "active").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Administrator",
				description: "Accounts, training runs, and system health — not shop-floor inventory."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Total users",
						value: users.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Active users",
						value: active,
						tone: "safe",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Business profiles",
						value: 1,
						hint: storeName,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Open alerts",
						value: alerts.filter((a) => a.status === "open").length,
						tone: "watch",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex-row items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Model status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/model",
							children: "Manage"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Current model",
							value: model.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Type",
							value: `${model.type} · fallback ${model.fallback}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Last trained",
							value: formatDateTime(model.lastTrained)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Training data",
							value: `${model.trainingProducts} products · ${model.trainingDays} days`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Status",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: model.status === "ready" ? "safe" : model.status === "training" ? "watch" : "muted",
								children: model.status === "ready" ? "Ready" : model.status === "training" ? "Training" : "Needs retraining"
							})
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex-row items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent uploads" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4 text-muted-foreground" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "px-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y",
						children: uploads.slice(0, 5).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between px-5 py-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: u.fileName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									u.rows,
									" rows · ",
									formatDateTime(u.uploadedAt)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: u.status === "processed" ? "safe" : "critical",
								children: u.status
							})]
						}, u.id))
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkCard, {
						to: "/admin/users",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }),
						title: "User accounts",
						body: "Add, disable, or change roles."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkCard, {
						to: "/admin/model",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrainCircuit, { className: "size-4" }),
						title: "Retrain the model",
						body: "Run Prophet on the latest sales history."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkCard, {
						to: "/admin/activity",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4" }),
						title: "Activity",
						body: `${products.length} products tracked · ${alerts.length} alerts logged.`
					})
				]
			})
		]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shrink-0 text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-0 text-right font-medium",
			children: value
		})]
	});
}
function LinkCard({ to, icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "block rounded-xl bg-card p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-raised)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-9 place-items-center rounded-lg bg-secondary text-primary",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: body
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };

import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { k as BrainCircuit, y as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as formatDateTime, f as useStockStore } from "./store-CI4xhis3.mjs";
import { t as Button } from "./button-B0j3GnJP.mjs";
import { a as PageHeader, i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-vxmViGqq.mjs";
import { t as Badge } from "./badge-DLcatF6i.mjs";
import { t as Progress } from "./progress-bEEC0Cc3.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DyU6mY7o.mjs";
import { t as predictionService } from "./services-CeeWW8I6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.model-CZSJFmRn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ModelPage() {
	const model = useStockStore((s) => s.model);
	const products = useStockStore((s) => s.products);
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	async function run() {
		setConfirm(false);
		setProgress(8);
		const tick = window.setInterval(() => {
			setProgress((p) => Math.min(90, p + 10));
		}, 220);
		try {
			await predictionService.retrain();
			setProgress(100);
			toast.success("Model retrained on the latest sales history.");
		} catch {
			toast.error("Retraining failed. Try again.");
		} finally {
			window.clearInterval(tick);
			window.setTimeout(() => setProgress(0), 800);
		}
	}
	const training = model.status === "training";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Model management",
				description: "StockSense uses a lightweight Prophet model, with ARIMA as fallback when a product has thin history."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Current model" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Name",
							value: model.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Type",
							value: model.type
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Fallback",
							value: model.fallback
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Last trained",
							value: formatDateTime(model.lastTrained)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Status",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: model.status === "ready" ? "safe" : model.status === "training" ? "watch" : "muted",
								children: model.status === "ready" ? "Ready" : model.status === "training" ? "Training" : "Stale — new data uploaded"
							})
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Training data" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Products in catalog",
							value: String(products.length)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Days of history used",
							value: String(model.trainingDays)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Last training set",
							value: `${model.trainingProducts} products`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pt-2 text-muted-foreground",
							children: "Retraining rebuilds demand forecasts and shortage dates from the latest uploaded sales. It does not change reorder thresholds you set."
						})
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-10 place-items-center rounded-lg bg-secondary text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrainCircuit, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Trigger model retraining"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Run this after a large CSV upload, or if predictions look stale."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: training,
						onClick: () => setConfirm(true),
						children: training ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Training…"] }) : "Trigger model retraining"
					})]
				}), training || progress > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: training ? Math.max(progress, 15) : progress,
					className: "mt-4"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: confirm,
				onOpenChange: setConfirm,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Retrain the prediction model?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This uses the current catalog and sales history. Forecasts on the dashboard will refresh when the run finishes — usually a few seconds for a small-business catalog." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => void run(),
					children: "Start training"
				})] })] })
			})
		]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-right font-medium",
			children: value
		})]
	});
}
//#endregion
export { ModelPage as component };

import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as formatDateTime, f as useStockStore } from "./store-CI4xhis3.mjs";
import { a as PageHeader, i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-vxmViGqq.mjs";
import { t as Badge } from "./badge-DLcatF6i.mjs";
import { i as useCatalog, n as countByRisk } from "./selectors-DyjYHDXe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.activity-BPg7afQQ.js
var import_jsx_runtime = require_jsx_runtime();
function ActivityPage() {
	const uploads = useStockStore((s) => s.uploads);
	const alerts = useStockStore((s) => s.alerts);
	const products = useStockStore((s) => s.products);
	const model = useStockStore((s) => s.model);
	const catalog = useCatalog();
	const counts = countByRisk(catalog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "System activity",
				description: "A quiet log of uploads, predictions, and alerts — enough to see that the pipeline is alive."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Prediction activity" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Last model run ",
							formatDateTime(model.lastTrained),
							" · status",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: model.status
							}),
							"."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: [
								products.length,
								" products scored. ",
								counts.critical,
								" critical, ",
								counts.watch,
								" on watch, ",
								counts.out_of_stock,
								" out of stock."
							]
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Alert activity" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							alerts.filter((a) => a.status === "open").length,
							" open ·",
							" ",
							alerts.filter((a) => a.status === "resolved").length,
							" resolved."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: [
								"Newest: ",
								alerts[0] ? formatDateTime(alerts[0].createdAt) : "none yet",
								"."
							]
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Upload activity" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [uploads.length, " files processed."] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: [
								"Latest ",
								uploads[0] ? `${uploads[0].fileName} · ${uploads[0].rows} rows` : "—",
								"."
							]
						})]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Upload history" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "px-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: uploads.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
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
			})] })
		]
	});
}
//#endregion
export { ActivityPage as component };

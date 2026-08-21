import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as cn } from "./router-BRoFgmkY.mjs";
import { t as Card } from "./card-vxmViGqq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kpi-card-DJscfmpH.js
var import_jsx_runtime = require_jsx_runtime();
function KpiCard({ label, value, hint, icon, tone = "default" }) {
	const toneCls = {
		default: "text-primary bg-secondary",
		watch: "text-watch bg-watch-bg",
		critical: "text-critical bg-critical-bg",
		oos: "text-oos bg-oos-bg",
		safe: "text-safe bg-safe-bg"
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-4 sm:p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 font-display text-3xl font-semibold tabular-nums tracking-tight text-navy",
					children: value
				}),
				hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: hint
				}) : null
			] }), icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("grid size-10 place-items-center rounded-lg", toneCls),
				children: icon
			}) : null]
		})
	});
}
//#endregion
export { KpiCard as t };

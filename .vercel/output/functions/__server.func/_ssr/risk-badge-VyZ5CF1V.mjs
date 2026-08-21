import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as cn } from "./router-BRoFgmkY.mjs";
import { d as riskLabel } from "./store-CI4xhis3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/risk-badge-VyZ5CF1V.js
var import_jsx_runtime = require_jsx_runtime();
var styles = {
	safe: "bg-safe-bg text-safe",
	watch: "bg-watch-bg text-watch",
	critical: "bg-critical-bg text-critical",
	out_of_stock: "bg-oos-bg text-oos"
};
var dots = {
	safe: "bg-safe",
	watch: "bg-watch",
	critical: "bg-critical",
	out_of_stock: "bg-oos"
};
function RiskBadge({ risk, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", styles[risk], className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", dots[risk]) }), riskLabel(risk)]
	});
}
//#endregion
export { RiskBadge as t };

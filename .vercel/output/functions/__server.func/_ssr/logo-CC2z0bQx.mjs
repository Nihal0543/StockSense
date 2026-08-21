import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as cn } from "./router-BRoFgmkY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-CC2z0bQx.js
var import_jsx_runtime = require_jsx_runtime();
function LogoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("h-8 w-8", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				fill: "#0B1F3A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "7",
				y: "18",
				width: "4.5",
				height: "7",
				rx: "1.2",
				fill: "#E8EEF6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "13.75",
				y: "13",
				width: "4.5",
				height: "12",
				rx: "1.2",
				fill: "#E8EEF6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "20.5",
				y: "8",
				width: "4.5",
				height: "17",
				rx: "1.2",
				fill: "#1B5FBF"
			})
		]
	});
}
function Logo({ inverted = false, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("font-display text-lg font-semibold tracking-tight", inverted ? "text-navy-fg" : "text-navy"),
				children: "StockSense"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em]", inverted ? "text-navy-muted" : "text-muted-foreground"),
				children: "Inventory foresight"
			})]
		})]
	});
}
//#endregion
export { LogoMark as n, Logo as t };

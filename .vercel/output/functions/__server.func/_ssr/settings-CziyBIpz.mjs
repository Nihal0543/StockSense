import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as useStockStore } from "./store-CI4xhis3.mjs";
import { t as Button } from "./button-B0j3GnJP.mjs";
import { a as PageHeader, t as Card } from "./card-vxmViGqq.mjs";
import { t as Input } from "./input-CcXGHOzL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CziyBIpz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const products = useStockStore((s) => s.products);
	const updateThreshold = useStockStore((s) => s.updateThreshold);
	const [draft, setDraft] = (0, import_react.useState)({});
	function valueFor(id, current) {
		return draft[id] ?? String(current);
	}
	function save(id, current) {
		const n = Number(valueFor(id, current));
		if (!Number.isFinite(n) || n < 0) {
			toast.error("Enter a number of 0 or more.");
			return;
		}
		updateThreshold(id, Math.round(n));
		setDraft((d) => {
			const { [id]: _, ...rest } = d;
			return rest;
		});
		toast.success("Reorder level saved.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reorder thresholds",
			description: "StockSense uses this threshold to determine when an item needs your attention."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden grid-cols-[minmax(0,1fr)_7rem_9rem_5.5rem] gap-3 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground md:grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Product" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Current" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "New" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y",
				children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid gap-2 px-4 py-3 md:grid-cols-[minmax(0,1fr)_7rem_9rem_5.5rem] md:items-center md:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"On hand: ",
								p.currentStock,
								" ",
								p.unit
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground md:hidden",
							children: "Current threshold"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm tabular-nums text-muted-foreground",
							children: p.reorderThreshold
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground md:hidden",
							children: "New threshold"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: valueFor(p.id, p.reorderThreshold),
							onChange: (e) => setDraft((d) => ({
								...d,
								[p.id]: e.target.value
							}))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							disabled: valueFor(p.id, p.reorderThreshold) === String(p.reorderThreshold),
							onClick: () => save(p.id, p.reorderThreshold),
							children: "Save"
						})
					]
				}, p.id))
			})]
		})]
	});
}
//#endregion
export { SettingsPage as component };

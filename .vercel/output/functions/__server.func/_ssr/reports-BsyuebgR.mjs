import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as Download } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as useStockStore, t as CATEGORIES } from "./store-CI4xhis3.mjs";
import { t as Button } from "./button-B0j3GnJP.mjs";
import { a as PageHeader, i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-vxmViGqq.mjs";
import { n as downloadCsv } from "./csv-BHoLM4It.mjs";
import { n as reportService } from "./services-CeeWW8I6.mjs";
import { t as Input } from "./input-CcXGHOzL.mjs";
import { t as Label } from "./label-BquP_9g0.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Cx8cnEVm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-BsyuebgR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KINDS = [
	{
		id: "inventory",
		label: "Inventory report",
		blurb: "Stock on hand, reorder levels, and risk."
	},
	{
		id: "shortage",
		label: "Shortage prediction report",
		blurb: "Run-out dates and recommended order quantities."
	},
	{
		id: "alerts",
		label: "Alert report",
		blurb: "Every shortage alert raised, open or resolved."
	},
	{
		id: "sales",
		label: "Sales trend report",
		blurb: "Daily quantities sold for the date range you pick."
	}
];
function ReportsPage() {
	const products = useStockStore((s) => s.products);
	const [kind, setKind] = (0, import_react.useState)("inventory");
	const [from, setFrom] = (0, import_react.useState)("2026-08-01");
	const [to, setTo] = (0, import_react.useState)("2026-08-21");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [productId, setProductId] = (0, import_react.useState)("all");
	const [built, setBuilt] = (0, import_react.useState)(null);
	const filteredProducts = (0, import_react.useMemo)(() => {
		return category === "all" ? products : products.filter((p) => p.category === category);
	}, [products, category]);
	function generate() {
		const report = reportService.build(kind, {
			from,
			to,
			category,
			productId
		});
		setBuilt(report);
		toast.success(`${report.title} ready.`);
	}
	function exportReport() {
		const report = built ?? reportService.build(kind, {
			from,
			to,
			category,
			productId
		});
		downloadCsv(`${report.title.toLowerCase().replace(/\s+/g, "-")}.csv`, reportService.toCsv(report.headers, report.rows));
		toast.success("Download started.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reports",
			description: "Export a simple snapshot you can share with a supplier or keep in the shop folder."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Build a report" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setKind(k.id),
							className: `w-full rounded-lg border px-3 py-2 text-left ${kind === k.id ? "border-primary bg-secondary" : "border-transparent hover:bg-muted"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: k.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: k.blurb
							})]
						}, k.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1.5 block",
							children: "From"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: from,
							onChange: (e) => setFrom(e.target.value)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1.5 block",
							children: "To"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: to,
							onChange: (e) => setTo(e.target.value)
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1.5 block",
						children: "Category"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: category,
						onValueChange: setCategory,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All categories"
						}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c,
							children: c
						}, c))] })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1.5 block",
						children: "Product"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: productId,
						onValueChange: setProductId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All products"
						}), filteredProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: p.id,
							children: p.name
						}, p.id))] })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: generate,
							children: "Generate report"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: exportReport,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Export CSV"]
						})]
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: built?.title ?? "Preview" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: !built ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Choose a report type and generate a preview. Export downloads a CSV you can open in Excel."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-auto rounded-lg border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[40rem] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-b bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground",
						children: built.headers.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: h
						}, h))
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: built.rows.slice(0, 40).map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-b last:border-0",
						children: row.map((cell, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: cell
						}, j))
					}, i)) })]
				}), built.rows.length > 40 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "px-3 py-2 text-xs text-muted-foreground",
					children: [
						"Showing 40 of ",
						built.rows.length,
						" rows. Export to see the full file."
					]
				}) : null]
			}) })] })]
		})]
	});
}
//#endregion
export { ReportsPage as component };

import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as Upload, w as CircleCheck, x as FileSpreadsheet, y as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as cn } from "./router-BRoFgmkY.mjs";
import { f as useStockStore, n as SAMPLE_CSV } from "./store-CI4xhis3.mjs";
import { t as Button } from "./button-B0j3GnJP.mjs";
import { a as PageHeader, i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-vxmViGqq.mjs";
import { t as Progress } from "./progress-bEEC0Cc3.mjs";
import { i as parseCsv, r as mapAndValidate, t as autoMapColumns } from "./csv-BHoLM4It.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Cx8cnEVm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/upload-DiwxlGQb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIELDS = [
	{
		key: "product",
		label: "Product",
		required: true
	},
	{
		key: "date",
		label: "Transaction Date",
		required: true
	},
	{
		key: "quantitySold",
		label: "Sales Quantity",
		required: true
	},
	{
		key: "currentStock",
		label: "Stock Level",
		required: true
	},
	{
		key: "sku",
		label: "SKU"
	},
	{
		key: "category",
		label: "Category"
	}
];
function UploadPage() {
	const ingest = useStockStore((s) => s.ingestRows);
	const inputRef = (0, import_react.useRef)(null);
	const [drag, setDrag] = (0, import_react.useState)(false);
	const [fileName, setFileName] = (0, import_react.useState)("");
	const [table, setTable] = (0, import_react.useState)(null);
	const [mapping, setMapping] = (0, import_react.useState)({});
	const [issues, setIssues] = (0, import_react.useState)([]);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [step, setStep] = (0, import_react.useState)("drop");
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [result, setResult] = (0, import_react.useState)(null);
	function loadText(name, text) {
		const parsed = parseCsv(text);
		if (!parsed.headers.length) {
			toast.error("That file does not look like a CSV.");
			return;
		}
		setFileName(name);
		setTable(parsed);
		setMapping(autoMapColumns(parsed.headers));
		setStep("map");
		setIssues([]);
		setRows([]);
		setResult(null);
	}
	function onFile(file) {
		file.text().then((t) => loadText(file.name, t)).catch(() => toast.error("Could not read file."));
	}
	function useSample() {
		loadText("sample-sales-stock.csv", SAMPLE_CSV);
	}
	function validate() {
		if (!table) return;
		const { rows: mapped, issues: next } = mapAndValidate(table, mapping);
		setRows(mapped);
		setIssues(next);
		if (mapped.length && next.filter((i) => i.row === 0).length === 0) setStep("preview");
	}
	async function process() {
		setProgress(12);
		const tick = window.setInterval(() => {
			setProgress((p) => Math.min(92, p + 14));
		}, 180);
		await new Promise((r) => setTimeout(r, 1100));
		window.clearInterval(tick);
		const res = ingest(rows, fileName);
		setProgress(100);
		setResult(res);
		setStep("done");
		toast.success("Data processed. Predictions will refresh on the dashboard.");
	}
	const preview = (0, import_react.useMemo)(() => rows.slice(0, 8), [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Upload sales & stock",
				description: "Drop a CSV. StockSense will detect columns, check the rows, then update predictions.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: useSample,
					children: "Try a sample file"
				})
			}),
			step === "drop" || step === "map" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onDragOver: (e) => {
					e.preventDefault();
					setDrag(true);
				},
				onDragLeave: () => setDrag(false),
				onDrop: (e) => {
					e.preventDefault();
					setDrag(false);
					const f = e.dataTransfer.files[0];
					if (f) onFile(f);
				},
				className: cn("flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card px-6 py-10 text-center transition-colors", drag ? "border-primary bg-secondary" : "border-border"),
				onClick: () => inputRef.current?.click(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-12 place-items-center rounded-full bg-secondary text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-semibold text-navy",
						children: "Drop your sales & stock CSV here"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "or browse from your computer. Columns can be in any order."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						className: "mt-4 pointer-events-none",
						children: "Browse files"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: inputRef,
						type: "file",
						accept: ".csv,text/csv",
						className: "hidden",
						onChange: (e) => {
							const f = e.target.files?.[0];
							if (f) onFile(f);
						}
					})
				]
			}) : null,
			table && step === "map" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4" }),
					"Match columns — ",
					fileName
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "CSV Column → StockSense field. We guessed a few; fix anything that looks off."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [
					FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid items-center gap-2 sm:grid-cols-[10rem_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium",
							children: [f.label, f.required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-critical",
								children: " *"
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: mapping[f.key] ?? "none",
							onValueChange: (v) => setMapping((m) => ({
								...m,
								[f.key]: v === "none" ? "" : v
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Not mapped" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "none",
								children: "Not mapped"
							}), table.headers.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: h,
								children: h
							}, h))] })]
						})]
					}, f.key)),
					issues.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "rounded-lg bg-critical-bg p-3 text-sm text-critical",
						children: issues.slice(0, 8).map((i, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [i.row ? `Row ${i.row}: ` : "", i.message] }, idx))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: validate,
							children: "Validate & preview"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setStep("drop"),
							children: "Choose another file"
						})]
					})
				]
			})] }) : null,
			step === "preview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
				"Preview — ",
				rows.length,
				" valid rows"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: issues.length ? `${issues.length} row${issues.length === 1 ? "" : "s"} skipped due to errors.` : "No blocking errors."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					issues.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "max-h-32 overflow-auto rounded-lg bg-watch-bg p-3 text-xs text-watch",
						children: issues.slice(0, 12).map((i, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Row ",
							i.row,
							": ",
							i.message
						] }, idx))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-auto rounded-lg border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Product"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Qty sold"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Stock"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: preview.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: r.product
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: r.date
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 tabular-nums",
										children: r.quantitySold
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 tabular-nums",
										children: r.currentStock
									})
								]
							}, i)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => void process(),
							children: [
								"Process ",
								rows.length,
								" rows"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setStep("map"),
							children: "Back to mapping"
						})]
					})
				]
			})] }) : null,
			step === "done" && result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col items-center py-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-12 place-items-center rounded-full bg-safe-bg text-safe",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-semibold text-navy",
						children: "Upload processed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 max-w-md text-sm text-muted-foreground",
						children: [
							result.updated,
							" existing product",
							result.updated === 1 ? "" : "s",
							" updated",
							result.added ? ` · ${result.added} new product${result.added === 1 ? "" : "s"} added` : "",
							". Shortage predictions are ready on the dashboard."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: progress,
						className: "mt-5 max-w-xs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap justify-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard",
									children: "Go to dashboard"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/predictions",
									children: "View predictions"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => {
									setStep("drop");
									setTable(null);
									setProgress(0);
								},
								children: "Upload another file"
							})
						]
					})
				]
			}) }) : null,
			progress > 0 && step !== "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Validating and running the forecast pipeline…"]
			}) : null
		]
	});
}
//#endregion
export { UploadPage as component };

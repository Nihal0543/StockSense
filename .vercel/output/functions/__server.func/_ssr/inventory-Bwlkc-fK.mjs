import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Search } from "../_libs/lucide-react.mjs";
import { s as Route$11 } from "./router-BRoFgmkY.mjs";
import { i as formatDate, o as formatNumber, r as daysLabel, t as CATEGORIES } from "./store-CI4xhis3.mjs";
import { t as Button } from "./button-B0j3GnJP.mjs";
import { a as PageHeader, t as Card } from "./card-vxmViGqq.mjs";
import { i as useCatalog, r as matchesRisk } from "./selectors-DyjYHDXe.mjs";
import { t as Input } from "./input-CcXGHOzL.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Cx8cnEVm.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CvedoCk7.mjs";
import { t as RiskBadge } from "./risk-badge-VyZ5CF1V.mjs";
import { t as EmptyState } from "./empty-state--AZKMyur.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-Bwlkc-fK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE_SIZE = 8;
function InventoryPage() {
	const search = Route$11.useSearch();
	const navigate = useNavigate({ from: "/inventory" });
	const catalog = useCatalog();
	const [sort, setSort] = (0, import_react.useState)("risk");
	const [page, setPage] = (0, import_react.useState)(0);
	const q = search.q ?? "";
	const risk = search.risk ?? "all";
	const category = search.category ?? "all";
	const filtered = (0, import_react.useMemo)(() => {
		const order = {
			out_of_stock: 0,
			critical: 1,
			watch: 2,
			safe: 3
		};
		let rows = catalog.filter((c) => {
			if (q && !`${c.product.name} ${c.product.sku}`.toLowerCase().includes(q.toLowerCase())) return false;
			if (!matchesRisk(c.insight.risk, risk)) return false;
			if (category !== "all" && c.product.category !== category) return false;
			return true;
		});
		rows = [...rows].sort((a, b) => {
			if (sort === "name") return a.product.name.localeCompare(b.product.name);
			if (sort === "stock") return a.product.currentStock - b.product.currentStock;
			return order[a.insight.risk] - order[b.insight.risk];
		});
		return rows;
	}, [
		catalog,
		q,
		risk,
		category,
		sort
	]);
	const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const pageSafe = Math.min(page, pages - 1);
	const slice = filtered.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE);
	function patchSearch(next) {
		setPage(0);
		navigate({ search: (prev) => ({
			...prev,
			...next
		}) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Inventory",
				description: "Every product on the shelf, with how soon it may run out.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/upload",
						children: "Upload a new count"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1 sm:max-w-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "pl-9",
							placeholder: "Search name or SKU",
							value: q,
							onChange: (e) => patchSearch({ q: e.target.value || void 0 })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: risk,
						onValueChange: (v) => patchSearch({ risk: v === "all" ? void 0 : v }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "sm:w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Risk" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All risk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "out_of_stock",
								children: "Out of Stock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "critical",
								children: "Critical"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "watch",
								children: "Watch"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "safe",
								children: "Safe"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: category,
						onValueChange: (v) => patchSearch({ category: v === "all" ? void 0 : v }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "sm:w-44",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Category" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All categories"
						}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c,
							children: c
						}, c))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: sort,
						onValueChange: (v) => setSort(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "sm:w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "risk",
								children: "Sort: risk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "stock",
								children: "Sort: stock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "name",
								children: "Sort: name"
							})
						] })]
					})
				]
			}),
			!filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No products match these filters.",
				description: "Try a different search, or upload a CSV if this store is empty."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "hidden overflow-hidden md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Category" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Reorder at"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Risk" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Predicted stockout" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Updated" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: slice.map(({ product, insight }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "cursor-pointer",
						onClick: () => void navigate({
							to: "/inventory/$productId",
							params: { productId: product.id }
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: product.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: product.sku
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: product.category }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: "text-right tabular-nums",
								children: [
									formatNumber(product.currentStock),
									" ",
									product.unit
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right tabular-nums",
								children: formatNumber(product.reorderThreshold)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { risk: insight.risk }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: formatDate(insight.predictedStockoutDate) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: daysLabel(insight.daysUntilStockout)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-muted-foreground",
								children: formatDate(product.lastUpdated)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/inventory/$productId",
									params: { productId: product.id },
									onClick: (e) => e.stopPropagation(),
									children: "View"
								})
							}) })
						]
					}, product.id)) })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 md:hidden",
					children: slice.map(({ product, insight }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/inventory/$productId",
						params: { productId: product.id },
						className: "block rounded-xl bg-card p-4 shadow-[var(--shadow-card)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: product.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										product.category,
										" · ",
										product.sku
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { risk: insight.risk })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-3 grid grid-cols-2 gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Stock"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-medium tabular-nums",
								children: [
									product.currentStock,
									" ",
									product.unit
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Run-out"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium",
								children: formatDate(insight.predictedStockoutDate)
							})] })]
						})]
					}, product.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						filtered.length,
						" product",
						filtered.length === 1 ? "" : "s"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: pageSafe === 0,
							onClick: () => setPage((p) => Math.max(0, p - 1)),
							children: "Previous"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: pageSafe >= pages - 1,
							onClick: () => setPage((p) => p + 1),
							children: "Next"
						})]
					})]
				})
			] })
		]
	});
}
//#endregion
export { InventoryPage as component };

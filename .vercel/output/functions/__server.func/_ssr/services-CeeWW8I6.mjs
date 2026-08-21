import { d as riskLabel, f as useStockStore, i as formatDate, l as insightFor } from "./store-CI4xhis3.mjs";
import { a as toCsv } from "./csv-BHoLM4It.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-CeeWW8I6.js
/**
* API-ready service layer. Today these wrap the client store so the UI
* can later swap in FastAPI REST calls without rewriting pages.
*/
var predictionService = {
	forProduct: (id, _horizon) => {
		const s = useStockStore.getState();
		const product = s.products.find((p) => p.id === id);
		if (!product) return null;
		return insightFor(product, s.history[id] ?? []);
	},
	retrain: async () => {
		useStockStore.getState().startRetrain();
		await new Promise((r) => setTimeout(r, 2400));
		useStockStore.getState().finishRetrain();
	}
};
var reportService = {
	build: (kind, opts) => {
		const s = useStockStore.getState();
		let products = s.products;
		if (opts.category && opts.category !== "all") products = products.filter((p) => p.category === opts.category);
		if (opts.productId && opts.productId !== "all") products = products.filter((p) => p.id === opts.productId);
		if (kind === "inventory") return {
			title: "Inventory Report",
			headers: [
				"Product",
				"SKU",
				"Category",
				"Current Stock",
				"Reorder Threshold",
				"Risk",
				"Predicted Stockout"
			],
			rows: products.map((p) => {
				const ins = insightFor(p, s.history[p.id] ?? []);
				return [
					p.name,
					p.sku,
					p.category,
					p.currentStock,
					p.reorderThreshold,
					riskLabel(ins.risk),
					formatDate(ins.predictedStockoutDate)
				];
			})
		};
		if (kind === "shortage") return {
			title: "Shortage Prediction Report",
			headers: [
				"Product",
				"Stock",
				"Predicted Demand (14d)",
				"Stockout",
				"Risk",
				"Reorder Qty",
				"Confidence"
			],
			rows: products.map((p) => {
				const ins = insightFor(p, s.history[p.id] ?? []);
				return [
					p.name,
					p.currentStock,
					Math.round(ins.avgDailySales * 14),
					formatDate(ins.predictedStockoutDate),
					riskLabel(ins.risk),
					ins.recommendedReorderQty,
					`${Math.round(ins.confidence * 100)}%`
				];
			})
		};
		if (kind === "alerts") return {
			title: "Alert Report",
			headers: [
				"Product",
				"Severity",
				"Shortage Date",
				"Reorder Qty",
				"Status",
				"Raised"
			],
			rows: s.alerts.filter((a) => products.some((p) => p.id === a.productId)).map((a) => {
				return [
					products.find((x) => x.id === a.productId)?.name ?? a.productId,
					a.severity,
					formatDate(a.predictedShortageDate),
					a.recommendedReorderQty,
					a.status,
					formatDate(a.createdAt)
				];
			})
		};
		const headers = [
			"Product",
			"Date",
			"Quantity Sold",
			"Stock"
		];
		const rows = [];
		for (const p of products) for (const pt of s.history[p.id] ?? []) {
			if (opts.from && pt.date < opts.from) continue;
			if (opts.to && pt.date > opts.to) continue;
			rows.push([
				p.name,
				pt.date,
				pt.sales,
				pt.stock
			]);
		}
		return {
			title: "Sales Trend Report",
			headers,
			rows
		};
	},
	toCsv
};
//#endregion
export { reportService as n, predictionService as t };

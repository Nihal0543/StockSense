import { f as useStockStore, l as insightFor } from "./store-CI4xhis3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/selectors-DyjYHDXe.js
function useCatalog() {
	const products = useStockStore((s) => s.products);
	const history = useStockStore((s) => s.history);
	return products.map((product) => ({
		product,
		insight: insightFor(product, history[product.id] ?? [])
	}));
}
function countByRisk(items) {
	const counts = {
		safe: 0,
		watch: 0,
		critical: 0,
		out_of_stock: 0
	};
	for (const i of items) counts[i.insight.risk] += 1;
	return counts;
}
function atRisk(items) {
	return items.filter((i) => i.insight.risk !== "safe");
}
function matchesRisk(risk, filter) {
	if (filter === "all") return true;
	return risk === filter;
}
//#endregion
export { useCatalog as i, countByRisk as n, matchesRisk as r, atRisk as t };

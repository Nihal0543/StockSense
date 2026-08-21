import { insightFor, useStockStore } from "./store";
import type { ProductInsight, RiskStatus } from "./types";

export type ProductWithInsight = {
  product: ReturnType<typeof useStockStore.getState>["products"][number];
  insight: ProductInsight;
};

export function useCatalog(): ProductWithInsight[] {
  const products = useStockStore((s) => s.products);
  const history = useStockStore((s) => s.history);
  return products.map((product) => ({
    product,
    insight: insightFor(product, history[product.id] ?? []),
  }));
}

export function countByRisk(items: ProductWithInsight[]) {
  const counts = { safe: 0, watch: 0, critical: 0, out_of_stock: 0 };
  for (const i of items) counts[i.insight.risk] += 1;
  return counts;
}

export function atRisk(items: ProductWithInsight[]) {
  return items.filter((i) => i.insight.risk !== "safe");
}

export function matchesRisk(risk: RiskStatus, filter: string) {
  if (filter === "all") return true;
  return risk === filter;
}

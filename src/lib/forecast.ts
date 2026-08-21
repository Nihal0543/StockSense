import { addDays, formatISO, parseISO } from "date-fns";
import type { DailyPoint, Product, ProductInsight, RiskStatus } from "./types";
import { formatDate } from "./format";

export const TODAY = "2026-08-21";

export function riskFromStock(
  stock: number,
  daysUntilStockout: number | null,
  threshold: number,
): RiskStatus {
  if (stock <= 0) return "out_of_stock";
  if (daysUntilStockout !== null && daysUntilStockout <= 7) return "critical";
  if (stock <= threshold * 0.5) return "critical";
  if (daysUntilStockout !== null && daysUntilStockout <= 14) return "watch";
  if (stock <= threshold) return "watch";
  return "safe";
}

export function recommendedReorder(
  stock: number,
  velocity: number,
  threshold: number,
) {
  const cover = Math.max(threshold * 2, Math.ceil(velocity * 14));
  return Math.max(0, cover - stock);
}

export function avgDailySales(history: DailyPoint[], lookback = 14) {
  if (!history.length) return 0;
  const slice = history.slice(-lookback);
  const total = slice.reduce((s, p) => s + p.sales, 0);
  return total / slice.length;
}

export function buildInsight(
  product: Product,
  history: DailyPoint[],
  today = TODAY,
): ProductInsight {
  const velocity = avgDailySales(history);
  const days =
    product.currentStock <= 0
      ? 0
      : velocity <= 0
        ? null
        : product.currentStock / velocity;
  const stockoutDate =
    days === null
      ? null
      : formatISO(addDays(parseISO(today), Math.max(0, Math.round(days))), {
          representation: "date",
        });
  const risk = riskFromStock(product.currentStock, days, product.reorderThreshold);
  const qty = recommendedReorder(
    product.currentStock,
    velocity,
    product.reorderThreshold,
  );
  const confidence = confidenceFor(product, history, velocity);
  return {
    productId: product.id,
    avgDailySales: Math.round(velocity * 10) / 10,
    daysUntilStockout: days,
    predictedStockoutDate: stockoutDate,
    risk,
    confidence,
    recommendedReorderQty: qty,
    explanation: explain(product, velocity, days, stockoutDate, risk),
  };
}

function confidenceFor(product: Product, history: DailyPoint[], velocity: number) {
  const depth = Math.min(1, history.length / 90);
  const stability = velocity > 0 ? 0.12 : -0.08;
  const perishable = ["Produce", "Bakery", "Dairy"].includes(product.category) ? -0.06 : 0;
  const score = 0.72 + depth * 0.18 + stability + perishable;
  return Math.round(Math.min(0.96, Math.max(0.58, score)) * 100) / 100;
}

function explain(
  product: Product,
  velocity: number,
  days: number | null,
  stockoutDate: string | null,
  risk: RiskStatus,
) {
  const pace = velocity < 1 ? "slowly" : `about ${Math.round(velocity * 10) / 10} ${product.unit} a day`;
  if (risk === "out_of_stock") {
    return `${product.name} is already at zero. Customers asking for it will walk out empty-handed until you restock.`;
  }
  if (risk === "critical") {
    return `${product.name} is selling ${pace}. With ${product.currentStock} ${product.unit} left, it is likely to run out around ${formatDate(stockoutDate)} — below your reorder level of ${product.reorderThreshold}.`;
  }
  if (risk === "watch") {
    return `${product.name} still has ${product.currentStock} ${product.unit} on the shelf, but at the current pace it will dip below your reorder level soon. Plan a restock before ${formatDate(stockoutDate)}.`;
  }
  if (days === null) {
    return `${product.name} has healthy stock and little recent movement. No shortage is expected in the next month.`;
  }
  return `${product.name} is in good shape. At the current pace, stock should last well past the next two weeks.`;
}

export function predictedDemand(velocity: number, horizon: 7 | 14 | 30) {
  return Math.round(velocity * horizon);
}

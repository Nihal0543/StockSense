/**
 * API-ready service layer. Today these wrap the client store so the UI
 * can later swap in FastAPI REST calls without rewriting pages.
 */
import { useStockStore } from "./store";
import type {
  ForecastHorizon,
  MappedCsvRow,
  Product,
  ReportKind,
  RiskStatus,
  TeamUser,
  UserRole,
} from "./types";
import { insightFor } from "./store";
import { toCsv } from "./csv";
import { formatDate, riskLabel } from "./format";

export const authService = {
  /* Wired to Better Auth from the login route. */
};

export const inventoryService = {
  list: () => useStockStore.getState().products,
  get: (id: string) => useStockStore.getState().products.find((p) => p.id === id),
};

export const productService = {
  create: (input: Omit<Product, "id" | "createdAt" | "lastUpdated">) =>
    useStockStore.getState().addProduct(input),
  update: (id: string, patch: Partial<Product>) =>
    useStockStore.getState().updateProduct(id, patch),
  remove: (id: string) => useStockStore.getState().deleteProduct(id),
};

export const thresholdService = {
  update: (id: string, threshold: number) =>
    useStockStore.getState().updateThreshold(id, threshold),
};

export const predictionService = {
  forProduct: (id: string, _horizon: ForecastHorizon) => {
    const s = useStockStore.getState();
    const product = s.products.find((p) => p.id === id);
    if (!product) return null;
    return insightFor(product, s.history[id] ?? []);
  },
  retrain: async () => {
    useStockStore.getState().startRetrain();
    await new Promise((r) => setTimeout(r, 2400));
    useStockStore.getState().finishRetrain();
  },
};

export const alertService = {
  list: () => useStockStore.getState().alerts,
  resolve: (id: string) => useStockStore.getState().resolveAlert(id),
};

export const uploadService = {
  ingest: (rows: MappedCsvRow[], fileName: string) =>
    useStockStore.getState().ingestRows(rows, fileName),
};

export const userService = {
  list: () => useStockStore.getState().teamUsers,
  add: (input: Omit<TeamUser, "id" | "lastLogin">) =>
    useStockStore.getState().addUser(input),
  update: (id: string, patch: Partial<TeamUser>) =>
    useStockStore.getState().updateUser(id, patch),
};

export const reportService = {
  build: (kind: ReportKind, opts: { from?: string; to?: string; category?: string; productId?: string }) => {
    const s = useStockStore.getState();
    let products = s.products;
    if (opts.category && opts.category !== "all") {
      products = products.filter((p) => p.category === opts.category);
    }
    if (opts.productId && opts.productId !== "all") {
      products = products.filter((p) => p.id === opts.productId);
    }
    if (kind === "inventory") {
      const headers = ["Product", "SKU", "Category", "Current Stock", "Reorder Threshold", "Risk", "Predicted Stockout"];
      const rows = products.map((p) => {
        const ins = insightFor(p, s.history[p.id] ?? []);
        return [p.name, p.sku, p.category, p.currentStock, p.reorderThreshold, riskLabel(ins.risk), formatDate(ins.predictedStockoutDate)];
      });
      return { title: "Inventory Report", headers, rows };
    }
    if (kind === "shortage") {
      const headers = ["Product", "Stock", "Predicted Demand (14d)", "Stockout", "Risk", "Reorder Qty", "Confidence"];
      const rows = products.map((p) => {
        const ins = insightFor(p, s.history[p.id] ?? []);
        return [p.name, p.currentStock, Math.round(ins.avgDailySales * 14), formatDate(ins.predictedStockoutDate), riskLabel(ins.risk), ins.recommendedReorderQty, `${Math.round(ins.confidence * 100)}%`];
      });
      return { title: "Shortage Prediction Report", headers, rows };
    }
    if (kind === "alerts") {
      const headers = ["Product", "Severity", "Shortage Date", "Reorder Qty", "Status", "Raised"];
      const rows = s.alerts
        .filter((a) => products.some((p) => p.id === a.productId))
        .map((a) => {
          const p = products.find((x) => x.id === a.productId);
          return [p?.name ?? a.productId, a.severity, formatDate(a.predictedShortageDate), a.recommendedReorderQty, a.status, formatDate(a.createdAt)];
        });
      return { title: "Alert Report", headers, rows };
    }
    const headers = ["Product", "Date", "Quantity Sold", "Stock"];
    const rows: (string | number)[][] = [];
    for (const p of products) {
      for (const pt of s.history[p.id] ?? []) {
        if (opts.from && pt.date < opts.from) continue;
        if (opts.to && pt.date > opts.to) continue;
        rows.push([p.name, pt.date, pt.sales, pt.stock]);
      }
    }
    return { title: "Sales Trend Report", headers, rows };
  },
  toCsv,
};

export type { RiskStatus, UserRole };

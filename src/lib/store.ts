import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Alert,
  DailyPoint,
  MappedCsvRow,
  ModelInfo,
  Product,
  TeamUser,
  UploadRecord,
  UserRole,
} from "./types";
import {
  CATEGORIES,
  STORE_NAME,
  seedAlerts,
  seedForecasts,
  seedHistory,
  seedModel,
  seedProducts,
  seedUploads,
  seedUsers,
} from "./data/seed";
import { TODAY, buildInsight, recommendedReorder } from "./forecast";
import { addDays, formatISO, parseISO } from "date-fns";

const products0 = seedProducts();
const history0 = seedHistory();
const forecasts0 = seedForecasts();

export type StockState = {
  storeName: string;
  role: UserRole;
  products: Product[];
  history: Record<string, DailyPoint[]>;
  forecasts: Record<string, DailyPoint[]>;
  alerts: Alert[];
  teamUsers: TeamUser[];
  model: ModelInfo;
  uploads: UploadRecord[];
  setRole: (role: UserRole) => void;
  addProduct: (input: Omit<Product, "id" | "createdAt" | "lastUpdated">) => string;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateThreshold: (id: string, threshold: number) => void;
  resolveAlert: (id: string) => void;
  reopenAlert: (id: string) => void;
  ingestRows: (rows: MappedCsvRow[], fileName: string) => { added: number; updated: number };
  startRetrain: () => void;
  finishRetrain: () => void;
  addUser: (input: Omit<TeamUser, "id" | "lastLogin">) => void;
  updateUser: (id: string, patch: Partial<TeamUser>) => void;
  resetDemo: () => void;
};

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function bumpAlertsFor(product: Product, history: DailyPoint[], alerts: Alert[]): Alert[] {
  const insight = buildInsight(product, history);
  if (insight.risk === "safe") return alerts;
  const severity = insight.risk;
  const existing = alerts.find((a) => a.productId === product.id && a.status === "open");
  if (existing) {
    return alerts.map((a) =>
      a.id === existing.id
        ? {
            ...a,
            severity,
            predictedShortageDate: insight.predictedStockoutDate,
            recommendedReorderQty: insight.recommendedReorderQty,
          }
        : a,
    );
  }
  return [
    {
      id: newId("al"),
      productId: product.id,
      severity,
      predictedShortageDate: insight.predictedStockoutDate,
      recommendedReorderQty: insight.recommendedReorderQty,
      createdAt: new Date().toISOString(),
      status: "open",
    },
    ...alerts,
  ];
}

export const useStockStore = create<StockState>()(
  persist(
    (set, get) => ({
      storeName: STORE_NAME,
      role: "owner",
      products: products0,
      history: history0,
      forecasts: forecasts0,
      alerts: seedAlerts(products0),
      teamUsers: seedUsers(),
      model: seedModel(products0.length),
      uploads: seedUploads(),
      setRole: (role) => set({ role }),
      addProduct: (input) => {
        const id = newId("p");
        const product: Product = {
          ...input,
          id,
          createdAt: TODAY,
          lastUpdated: TODAY,
        };
        set((s) => ({ products: [product, ...s.products] }));
        return id;
      },
      updateProduct: (id, patch) => {
        set((s) => {
          const products = s.products.map((p) =>
            p.id === id ? { ...p, ...patch, lastUpdated: TODAY } : p,
          );
          const product = products.find((p) => p.id === id);
          const alerts = product
            ? bumpAlertsFor(product, s.history[id] ?? [], s.alerts)
            : s.alerts;
          return { products, alerts };
        });
      },
      deleteProduct: (id) => {
        set((s) => {
          const { [id]: _h, ...history } = s.history;
          const { [id]: _f, ...forecasts } = s.forecasts;
          return {
            products: s.products.filter((p) => p.id !== id),
            history,
            forecasts,
            alerts: s.alerts.filter((a) => a.productId !== id),
          };
        });
      },
      updateThreshold: (id, threshold) => {
        get().updateProduct(id, { reorderThreshold: threshold });
      },
      resolveAlert: (id) => {
        set((s) => ({
          alerts: s.alerts.map((a) => (a.id === id ? { ...a, status: "resolved" } : a)),
        }));
      },
      reopenAlert: (id) => {
        set((s) => ({
          alerts: s.alerts.map((a) => (a.id === id ? { ...a, status: "open" } : a)),
        }));
      },
      ingestRows: (rows, fileName) => {
        let added = 0;
        let updated = 0;
        set((s) => {
          const products = [...s.products];
          const history = { ...s.history };
          const forecasts = { ...s.forecasts };
          let alerts = s.alerts;
          const byName = new Map(products.map((p) => [p.name.toLowerCase(), p]));
          for (const row of rows) {
            let product = byName.get(row.product.toLowerCase());
            if (!product) {
              product = {
                id: newId("p"),
                name: row.product,
                sku: row.sku || `SKU-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
                category: row.category || "Staples",
                currentStock: row.currentStock,
                reorderThreshold: Math.max(8, Math.round(row.currentStock * 0.4)),
                unit: "units",
                supplierName: "Unassigned supplier",
                supplierContact: "—",
                lastUpdated: row.date,
                createdAt: row.date,
              };
              products.unshift(product);
              byName.set(product.name.toLowerCase(), product);
              added += 1;
            } else {
              product = {
                ...product,
                currentStock: row.currentStock,
                lastUpdated: row.date,
                sku: row.sku || product.sku,
                category: row.category || product.category,
              };
              const idx = products.findIndex((p) => p.id === product!.id);
              products[idx] = product;
              byName.set(product.name.toLowerCase(), product);
              updated += 1;
            }
            const points = [...(history[product.id] ?? [])];
            const existing = points.findIndex((pt) => pt.date === row.date);
            const point: DailyPoint = {
              date: row.date,
              sales: row.quantitySold,
              stock: row.currentStock,
            };
            if (existing >= 0) points[existing] = point;
            else points.push(point);
            points.sort((a, b) => a.date.localeCompare(b.date));
            history[product.id] = points;
            alerts = bumpAlertsFor(product, points, alerts);
          }
          return {
            products,
            history,
            forecasts,
            alerts,
            uploads: [
              {
                id: newId("up"),
                fileName,
                uploadedAt: new Date().toISOString(),
                rows: rows.length,
                status: "processed",
              },
              ...s.uploads,
            ],
            model: { ...s.model, status: "stale" as const },
          };
        });
        return { added, updated };
      },
      startRetrain: () => set((s) => ({ model: { ...s.model, status: "training" } })),
      finishRetrain: () =>
        set((s) => ({
          model: {
            ...s.model,
            status: "ready",
            lastTrained: new Date().toISOString(),
            trainingProducts: s.products.length,
          },
        })),
      addUser: (input) => {
        set((s) => ({
          teamUsers: [
            {
              ...input,
              id: newId("u"),
              lastLogin: "—",
            },
            ...s.teamUsers,
          ],
        }));
      },
      updateUser: (id, patch) => {
        set((s) => ({
          teamUsers: s.teamUsers.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        }));
      },
      resetDemo: () => {
        const products = seedProducts();
        set({
          products,
          history: seedHistory(),
          forecasts: seedForecasts(),
          alerts: seedAlerts(products),
          teamUsers: seedUsers(),
          model: seedModel(products.length),
          uploads: seedUploads(),
          role: get().role,
        });
      },
    }),
    {
      name: "stocksense-v2",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      skipHydration: true,
      partialize: (s) => ({
        role: s.role,
        products: s.products,
        history: s.history,
        forecasts: s.forecasts,
        alerts: s.alerts,
        teamUsers: s.teamUsers,
        model: s.model,
        uploads: s.uploads,
        storeName: s.storeName,
      }),
    },
  ),
);

export function useHydrateStore() {
  return useStockStore.persist;
}

export { CATEGORIES };

export function insightFor(product: Product, history: DailyPoint[]) {
  return buildInsight(product, history);
}

export function reorderQty(product: Product, history: DailyPoint[]) {
  const v = buildInsight(product, history).avgDailySales;
  return recommendedReorder(product.currentStock, v, product.reorderThreshold);
}

export function forecastDemand(history: DailyPoint[], horizon: 7 | 14 | 30) {
  const insightLookback = history.slice(-14);
  const v =
    insightLookback.reduce((s, p) => s + p.sales, 0) /
    Math.max(1, insightLookback.length);
  return Math.round(v * horizon);
}

export function stockoutIso(days: number | null) {
  if (days === null) return null;
  return formatISO(addDays(parseISO(TODAY), Math.max(0, Math.round(days))), {
    representation: "date",
  });
}

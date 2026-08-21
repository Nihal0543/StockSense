export type RiskStatus = "safe" | "watch" | "critical" | "out_of_stock";
export type ForecastHorizon = 7 | 14 | 30;
export type UserRole = "owner" | "admin";
export type AlertStatus = "open" | "resolved";
export type UserAccountStatus = "active" | "disabled";
export type ModelRunStatus = "ready" | "training" | "stale";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderThreshold: number;
  unit: string;
  supplierName: string;
  supplierContact: string;
  lastUpdated: string;
  createdAt: string;
};

export type DailyPoint = {
  date: string;
  sales: number;
  stock: number;
  predictedSales?: number;
};

export type ProductInsight = {
  productId: string;
  avgDailySales: number;
  daysUntilStockout: number | null;
  predictedStockoutDate: string | null;
  risk: RiskStatus;
  confidence: number;
  recommendedReorderQty: number;
  explanation: string;
};

export type Alert = {
  id: string;
  productId: string;
  severity: Exclude<RiskStatus, "safe">;
  predictedShortageDate: string | null;
  recommendedReorderQty: number;
  createdAt: string;
  status: AlertStatus;
};

export type TeamUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserAccountStatus;
  lastLogin: string;
};

export type ModelInfo = {
  name: string;
  type: string;
  fallback: string;
  lastTrained: string;
  trainingProducts: number;
  trainingDays: number;
  status: ModelRunStatus;
};

export type UploadRecord = {
  id: string;
  fileName: string;
  uploadedAt: string;
  rows: number;
  status: "processed" | "failed";
};

export type MappedCsvRow = {
  product: string;
  date: string;
  quantitySold: number;
  currentStock: number;
  sku?: string;
  category?: string;
};

export type ReportKind =
  | "inventory"
  | "shortage"
  | "alerts"
  | "sales";

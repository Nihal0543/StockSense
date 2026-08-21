import { addDays, formatISO, parseISO, subDays } from "date-fns";
import type {
  Alert,
  DailyPoint,
  ModelInfo,
  Product,
  TeamUser,
  UploadRecord,
} from "../types";
import { TODAY } from "../forecast";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function iso(d: Date) {
  return formatISO(d, { representation: "date" });
}

type SeedProduct = Omit<Product, "lastUpdated" | "createdAt"> & {
  velocity: number;
  confidenceHint?: number;
};

const RAW: SeedProduct[] = [
  { id: "p-atta", name: "Aashirvaad Atta 10 kg", sku: "ST-ATTA-10", category: "Staples", currentStock: 8, reorderThreshold: 20, unit: "packs", supplierName: "ITC Foods Dist.", supplierContact: "98240 11021", velocity: 4.1 },
  { id: "p-oil", name: "Fortune Sunflower Oil 1 L", sku: "CK-OIL-1", category: "Cooking", currentStock: 24, reorderThreshold: 18, unit: "bottles", supplierName: "Adani Wilmar", supplierContact: "079 2550 4400", velocity: 3.0 },
  { id: "p-salt", name: "Tata Salt 1 kg", sku: "ST-SALT-1", category: "Staples", currentStock: 86, reorderThreshold: 15, unit: "packs", supplierName: "Tata Consumer", supplierContact: "1800 266 0808", velocity: 2.0 },
  { id: "p-butter", name: "Amul Butter 500 g", sku: "DY-BUT-500", category: "Dairy", currentStock: 6, reorderThreshold: 12, unit: "packs", supplierName: "GCMMF / Amul", supplierContact: "98790 22110", velocity: 2.2 },
  { id: "p-maggi", name: "Maggi Noodles 70 g (carton)", sku: "PK-MAG-CTN", category: "Packaged", currentStock: 0, reorderThreshold: 10, unit: "cartons", supplierName: "Nestlé India", supplierContact: "1800 103 1947", velocity: 3.4 },
  { id: "p-parle", name: "Parle-G 800 g", sku: "SN-PG-800", category: "Snacks", currentStock: 18, reorderThreshold: 16, unit: "packs", supplierName: "Parle Products", supplierContact: "022 2493 0470", velocity: 2.1 },
  { id: "p-tea", name: "Brooke Bond Red Label 500 g", sku: "BV-TEA-500", category: "Beverages", currentStock: 42, reorderThreshold: 12, unit: "packs", supplierName: "HUL Distributor", supplierContact: "1800 102 2221", velocity: 1.1 },
  { id: "p-rice", name: "India Gate Basmati 5 kg", sku: "ST-RICE-5", category: "Staples", currentStock: 5, reorderThreshold: 10, unit: "bags", supplierName: "KRBL Ltd.", supplierContact: "0120 394 8585", velocity: 2.0 },
  { id: "p-surf", name: "Surf Excel 1 kg", sku: "HH-SXF-1", category: "Household", currentStock: 14, reorderThreshold: 10, unit: "packs", supplierName: "HUL Distributor", supplierContact: "1800 102 2221", velocity: 1.6 },
  { id: "p-colgate", name: "Colgate Strong Teeth 200 g", sku: "PC-COL-200", category: "Personal Care", currentStock: 38, reorderThreshold: 12, unit: "tubes", supplierName: "Colgate Palmolive", supplierContact: "1800 180 1234", velocity: 1.0 },
  { id: "p-milkmaid", name: "Nestlé Milkmaid 400 g", sku: "DY-MM-400", category: "Dairy", currentStock: 11, reorderThreshold: 10, unit: "tins", supplierName: "Nestlé India", supplierContact: "1800 103 1947", velocity: 1.3 },
  { id: "p-bread", name: "Britannia Bread 400 g", sku: "BK-BRD-400", category: "Bakery", currentStock: 0, reorderThreshold: 8, unit: "loaves", supplierName: "Local bakery route", supplierContact: "98765 44321", velocity: 6.2 },
  { id: "p-onion", name: "Onions (loose)", sku: "PR-ONI-KG", category: "Produce", currentStock: 12, reorderThreshold: 25, unit: "kg", supplierName: "Naroda APMC", supplierContact: "98250 66770", velocity: 8.0 },
  { id: "p-potato", name: "Potatoes (loose)", sku: "PR-POT-KG", category: "Produce", currentStock: 92, reorderThreshold: 20, unit: "kg", supplierName: "Naroda APMC", supplierContact: "98250 66770", velocity: 6.0 },
  { id: "p-coke", name: "Coca-Cola 750 ml", sku: "BV-COKE-750", category: "Beverages", currentStock: 16, reorderThreshold: 14, unit: "bottles", supplierName: "HCCB Bottling", supplierContact: "1800 102 5333", velocity: 2.0 },
  { id: "p-namkeen", name: "Haldiram's Namkeen 200 g", sku: "SN-HAL-200", category: "Snacks", currentStock: 28, reorderThreshold: 10, unit: "packs", supplierName: "Haldiram Foods", supplierContact: "011 4724 2222", velocity: 1.0 },
  { id: "p-dal", name: "Toor Dal 1 kg", sku: "ST-DAL-1", category: "Staples", currentStock: 7, reorderThreshold: 15, unit: "packs", supplierName: "Local miller — Patel Bros", supplierContact: "98241 90880", velocity: 3.1 },
  { id: "p-dettol", name: "Dettol Soap 125 g", sku: "PC-DET-125", category: "Personal Care", currentStock: 44, reorderThreshold: 12, unit: "bars", supplierName: "Reckitt Distributor", supplierContact: "1800 258 8080", velocity: 1.0 },
  { id: "p-milk", name: "Amul Taaza 500 ml", sku: "DY-MLK-500", category: "Dairy", currentStock: 22, reorderThreshold: 16, unit: "packs", supplierName: "GCMMF / Amul", supplierContact: "98790 22110", velocity: 2.6 },
  { id: "p-sugar", name: "Madhur Sugar 1 kg", sku: "ST-SUG-1", category: "Staples", currentStock: 55, reorderThreshold: 20, unit: "packs", supplierName: "Shree Renuka Sugars", supplierContact: "1800 266 0800", velocity: 2.0 },
  { id: "p-mustard", name: "Dhara Mustard Oil 1 L", sku: "CK-MUS-1", category: "Cooking", currentStock: 9, reorderThreshold: 12, unit: "bottles", supplierName: "Mother Dairy Oils", supplierContact: "1800 180 1020", velocity: 1.5 },
  { id: "p-vim", name: "Vim Dishwash 500 ml", sku: "HH-VIM-500", category: "Household", currentStock: 21, reorderThreshold: 8, unit: "bottles", supplierName: "HUL Distributor", supplierContact: "1800 102 2221", velocity: 0.9 },
  { id: "p-kurkure", name: "Kurkure Masala Munch", sku: "SN-KUR-70", category: "Snacks", currentStock: 4, reorderThreshold: 15, unit: "packs", supplierName: "PepsiCo / Frito-Lay", supplierContact: "1800 102 4455", velocity: 3.2 },
  { id: "p-lifebuoy", name: "Lifebuoy Soap 125 g", sku: "PC-LIF-125", category: "Personal Care", currentStock: 0, reorderThreshold: 10, unit: "bars", supplierName: "HUL Distributor", supplierContact: "1800 102 2221", velocity: 2.0 },
];

export const STORE_NAME = "Sharma General Store";
export const STORE_CITY = "Ahmedabad";
export const CATEGORIES = [
  "Staples",
  "Cooking",
  "Dairy",
  "Packaged",
  "Snacks",
  "Beverages",
  "Household",
  "Personal Care",
  "Bakery",
  "Produce",
];

export function seedProducts(): Product[] {
  const today = parseISO(TODAY);
  return RAW.map((p, i) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    category: p.category,
    currentStock: p.currentStock,
    reorderThreshold: p.reorderThreshold,
    unit: p.unit,
    supplierName: p.supplierName,
    supplierContact: p.supplierContact,
    lastUpdated: iso(subDays(today, i % 3)),
    createdAt: iso(subDays(today, 80 - (i % 20))),
  }));
}

export function seedHistory(): Record<string, DailyPoint[]> {
  const today = parseISO(TODAY);
  const out: Record<string, DailyPoint[]> = {};
  for (const p of RAW) {
    const rng = mulberry32(hash(p.id));
    const dates: Date[] = [];
    const sales: number[] = [];
    for (let i = 89; i >= 0; i--) {
      const d = subDays(today, i);
      const dow = d.getDay();
      const weekend = dow === 0 || dow === 6 ? 1.25 : 1;
      const festive = d.getMonth() === 9 || d.getMonth() === 10 ? 1.15 : 1;
      const noise = 0.65 + rng() * 0.7;
      dates.push(d);
      sales.push(Math.max(0, Math.round(p.velocity * weekend * festive * noise)));
    }
    const stocks = new Array<number>(90);
    stocks[89] = p.currentStock;
    for (let i = 88; i >= 0; i--) {
      const restock = rng() < 0.05 ? Math.round(p.reorderThreshold * (1.1 + rng())) : 0;
      stocks[i] = Math.max(0, stocks[i + 1] + sales[i + 1] - restock);
    }
    out[p.id] = dates.map((d, i) => ({
      date: iso(d),
      sales: sales[i],
      stock: stocks[i],
    }));
  }
  return out;
}

export function seedForecasts(): Record<string, DailyPoint[]> {
  const today = parseISO(TODAY);
  const out: Record<string, DailyPoint[]> = {};
  for (const p of RAW) {
    const rng = mulberry32(hash(p.id) ^ 0xabc);
    const points: DailyPoint[] = [];
    let stock = p.currentStock;
    for (let i = 1; i <= 30; i++) {
      const d = addDays(today, i);
      const dow = d.getDay();
      const weekend = dow === 0 || dow === 6 ? 1.2 : 1;
      const sales = Math.max(0, Math.round(p.velocity * weekend * (0.9 + rng() * 0.2)));
      stock = Math.max(0, stock - sales);
      points.push({ date: iso(d), sales: 0, stock, predictedSales: sales });
    }
    out[p.id] = points;
  }
  return out;
}

export function seedAlerts(products: Product[]): Alert[] {
  const today = parseISO(TODAY);
  const criticalish = products.filter((p) => p.currentStock <= p.reorderThreshold);
  return criticalish.map((p, i) => {
    const oos = p.currentStock <= 0;
    const critical = !oos && p.currentStock <= Math.max(8, p.reorderThreshold * 0.5);
    const severity = oos ? "out_of_stock" : critical ? "critical" : "watch";
    const days = oos ? 0 : Math.max(1, Math.round(p.currentStock / Math.max(1, RAW.find((r) => r.id === p.id)?.velocity ?? 2)));
    return {
      id: `al-${p.id}`,
      productId: p.id,
      severity,
      predictedShortageDate: iso(addDays(today, days)),
      recommendedReorderQty: Math.max(
        p.reorderThreshold * 2 - p.currentStock,
        Math.ceil((RAW.find((r) => r.id === p.id)?.velocity ?? 2) * 14) - p.currentStock,
      ),
      createdAt: subDays(today, i % 5).toISOString(),
      status: i === 3 || i === 7 ? "resolved" : "open",
    } satisfies Alert;
  });
}

export function seedUsers(): TeamUser[] {
  return [
    {
      id: "u-priya",
      name: "Priya Sharma",
      email: "priya@sharmastore.in",
      role: "owner",
      status: "active",
      lastLogin: "2026-08-21T09:14:00+05:30",
    },
    {
      id: "u-rajesh",
      name: "Rajesh Patel",
      email: "rajesh@sharmastore.in",
      role: "owner",
      status: "active",
      lastLogin: "2026-08-20T18:02:00+05:30",
    },
    {
      id: "u-ankit",
      name: "Ankit Mehta",
      email: "ankit.admin@sharmastore.in",
      role: "admin",
      status: "active",
      lastLogin: "2026-08-21T08:40:00+05:30",
    },
    {
      id: "u-kavita",
      name: "Kavita Shah",
      email: "kavita@sharmastore.in",
      role: "owner",
      status: "disabled",
      lastLogin: "2026-07-12T11:20:00+05:30",
    },
  ];
}

export function seedModel(productCount: number): ModelInfo {
  return {
    name: "StockSense Forecaster",
    type: "Prophet",
    fallback: "ARIMA",
    lastTrained: "2026-08-18T21:10:00+05:30",
    trainingProducts: productCount,
    trainingDays: 90,
    status: "ready",
  };
}

export function seedUploads(): UploadRecord[] {
  return [
    { id: "up-1", fileName: "weekly_sales_17aug.csv", uploadedAt: "2026-08-17T19:22:00+05:30", rows: 168, status: "processed" },
    { id: "up-2", fileName: "stock_count_18aug.csv", uploadedAt: "2026-08-18T08:05:00+05:30", rows: 24, status: "processed" },
    { id: "up-3", fileName: "weekly_sales_21aug.csv", uploadedAt: "2026-08-21T07:48:00+05:30", rows: 152, status: "processed" },
  ];
}

export const SAMPLE_CSV = `Product,Date,Quantity Sold,Current Stock,SKU,Category
Aashirvaad Atta 10 kg,2026-08-20,5,8,ST-ATTA-10,Staples
Fortune Sunflower Oil 1 L,2026-08-20,3,24,CK-OIL-1,Cooking
Maggi Noodles 70 g (carton),2026-08-20,4,0,PK-MAG-CTN,Packaged
Onions (loose),2026-08-20,9,12,PR-ONI-KG,Produce
Toor Dal 1 kg,2026-08-20,3,7,ST-DAL-1,Staples
`;

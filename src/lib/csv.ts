import type { MappedCsvRow } from "./types";

export type CsvTable = {
  headers: string[];
  rows: string[][];
};

const FIELD_ALIASES: Record<keyof MappedCsvRow, string[]> = {
  product: ["product", "product name", "item", "item name", "name"],
  date: ["date", "transaction date", "sale date", "day"],
  quantitySold: ["quantity sold", "qty sold", "sales quantity", "qty", "quantity", "sold"],
  currentStock: ["current stock", "stock", "stock level", "qty on hand", "on hand"],
  sku: ["sku", "code", "product code", "item code"],
  category: ["category", "dept", "department", "type"],
};

export function parseCsv(text: string): CsvTable {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const parsed: string[][] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    parsed.push(splitCsvLine(line));
  }
  if (!parsed.length) return { headers: [], rows: [] };
  const headers = parsed[0].map((h) => h.trim());
  const rows = parsed.slice(1).filter((r) => r.some((c) => c.trim()));
  return { headers, rows };
}

function splitCsvLine(line: string) {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

export function autoMapColumns(headers: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  const normalized = headers.map((h) => ({ raw: h, key: h.toLowerCase().trim() }));
  (Object.keys(FIELD_ALIASES) as (keyof MappedCsvRow)[]).forEach((field) => {
    const aliases = FIELD_ALIASES[field];
    const hit = normalized.find((h) => aliases.includes(h.key));
    if (hit) map[field] = hit.raw;
  });
  return map;
}

export type ValidationIssue = {
  row: number;
  message: string;
};

export function mapAndValidate(
  table: CsvTable,
  mapping: Record<string, string>,
): { rows: MappedCsvRow[]; issues: ValidationIssue[] } {
  const idx = (field: string) => table.headers.indexOf(mapping[field] ?? "");
  const productI = idx("product");
  const dateI = idx("date");
  const qtyI = idx("quantitySold");
  const stockI = idx("currentStock");
  const skuI = idx("sku");
  const catI = idx("category");

  const issues: ValidationIssue[] = [];
  if (productI < 0) issues.push({ row: 0, message: "Map a column to Product — it is required." });
  if (dateI < 0) issues.push({ row: 0, message: "Map a column to Transaction Date — it is required." });
  if (qtyI < 0) issues.push({ row: 0, message: "Map a column to Sales Quantity — it is required." });
  if (stockI < 0) issues.push({ row: 0, message: "Map a column to Stock Level — it is required." });
  if (issues.length) return { rows: [], issues };

  const rows: MappedCsvRow[] = [];
  const seen = new Set<string>();

  table.rows.forEach((cols, i) => {
    const rowNum = i + 2;
    const product = (cols[productI] ?? "").trim();
    const date = (cols[dateI] ?? "").trim();
    const qtyRaw = (cols[qtyI] ?? "").trim();
    const stockRaw = (cols[stockI] ?? "").trim();
    if (!product) {
      issues.push({ row: rowNum, message: "Missing product name." });
      return;
    }
    if (!date || Number.isNaN(Date.parse(date))) {
      issues.push({ row: rowNum, message: `Missing or invalid date (${date || "empty"}).` });
      return;
    }
    const quantitySold = Number(qtyRaw);
    const currentStock = Number(stockRaw);
    if (!Number.isFinite(quantitySold) || quantitySold < 0) {
      issues.push({ row: rowNum, message: `Invalid sales quantity (${qtyRaw || "empty"}).` });
      return;
    }
    if (!Number.isFinite(currentStock) || currentStock < 0) {
      issues.push({ row: rowNum, message: `Invalid stock level (${stockRaw || "empty"}).` });
      return;
    }
    const key = `${product.toLowerCase()}|${date}`;
    if (seen.has(key)) {
      issues.push({ row: rowNum, message: `Duplicate record for ${product} on ${date}.` });
      return;
    }
    seen.add(key);
    rows.push({
      product,
      date: new Date(date).toISOString().slice(0, 10),
      quantitySold,
      currentStock,
      sku: skuI >= 0 ? cols[skuI] : undefined,
      category: catI >= 0 ? cols[catI] : undefined,
    });
  });

  return { rows, issues };
}

export function toCsv(headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

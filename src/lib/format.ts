import { format, parseISO, isValid } from "date-fns";
import type { RiskStatus } from "./types";

export function formatDate(iso: string | null | undefined, pattern = "d MMM yyyy") {
  if (!iso) return "—";
  const d = parseISO(iso);
  if (!isValid(d)) return "—";
  return format(d, pattern);
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = parseISO(iso);
  if (!isValid(d)) return "—";
  return format(d, "d MMM yyyy, h:mm a");
}

export function formatNumber(n: number, digits = 0) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}

export function formatPercent(n: number) {
  return `${Math.round(n * 100)}%`;
}

export function riskLabel(risk: RiskStatus) {
  switch (risk) {
    case "safe":
      return "Safe";
    case "watch":
      return "Watch";
    case "critical":
      return "Critical";
    case "out_of_stock":
      return "Out of Stock";
  }
}

export function daysLabel(days: number | null) {
  if (days === null) return "No run-out in sight";
  if (days <= 0) return "Already out";
  if (days < 1) return "Today";
  if (days === 1) return "Tomorrow";
  return `${Math.round(days)} days`;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

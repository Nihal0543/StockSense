import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyPoint } from "@/lib/types";
import { format, parseISO } from "date-fns";

export function StockTrendChart({
  history,
  threshold,
}: {
  history: DailyPoint[];
  threshold: number;
}) {
  const data = history.slice(-30).map((p) => ({
    date: p.date,
    stock: p.stock,
    threshold,
  }));
  const peak = Math.max(threshold, ...data.map((d) => d.stock), 1);

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="stockFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B5FBF" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#1B5FBF" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => format(parseISO(v), "d MMM")}
            tick={{ fill: "#5B6B7F", fontSize: 11 }}
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
            minTickGap={28}
          />
          <YAxis
            domain={[0, Math.ceil(peak * 1.1)]}
            tick={{ fill: "#5B6B7F", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            labelFormatter={(v) => format(parseISO(String(v)), "d MMM yyyy")}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="stock"
            name="Stock on hand"
            stroke="#1B5FBF"
            fill="url(#stockFill)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="threshold"
            name="Reorder level"
            stroke="#D97706"
            dot={false}
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
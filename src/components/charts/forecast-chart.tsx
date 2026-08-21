import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyPoint } from "@/lib/types";
import { format, parseISO } from "date-fns";

export function ForecastChart({
  history,
  forecast,
  horizon,
}: {
  history: DailyPoint[];
  forecast: DailyPoint[];
  horizon: 7 | 14 | 30;
}) {
  const hist = history.slice(-horizon).map((p) => ({
    date: p.date,
    historical: p.sales,
    predicted: undefined as number | undefined,
  }));
  const fut = forecast.slice(0, horizon).map((p) => ({
    date: p.date,
    historical: undefined as number | undefined,
    predicted: p.predictedSales ?? 0,
  }));
  const data = [...hist, ...fut];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => format(parseISO(v), "d MMM")}
            tick={{ fill: "#5B6B7F", fontSize: 11 }}
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
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
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="historical"
            name="Historical sales"
            stroke="#0B1F3A"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            name="Predicted demand"
            stroke="#1B5FBF"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

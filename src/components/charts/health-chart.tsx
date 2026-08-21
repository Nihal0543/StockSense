import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS: Record<string, string> = {
  Safe: "#15803D",
  Watch: "#C2410C",
  Critical: "#DC2626",
  "Out of Stock": "#7F1D1D",
};

export function HealthChart({
  counts,
}: {
  counts: { safe: number; watch: number; critical: number; out_of_stock: number };
}) {
  const data = [
    { name: "Safe", value: counts.safe },
    { name: "Watch", value: counts.watch },
    { name: "Critical", value: counts.critical },
    { name: "Out of Stock", value: counts.out_of_stock },
  ].filter((d) => d.value > 0);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center gap-4">
      <div className="h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={48}
              outerRadius={70}
              paddingAngle={2}
              stroke="transparent"
            >
              {data.map((d) => (
                <Cell key={d.name} fill={COLORS[d.name]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="size-2 rounded-full"
                style={{ background: COLORS[d.name] }}
              />
              {d.name}
            </span>
            <span className="tabular-nums font-medium text-foreground">
              {d.value}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                ({total ? Math.round((d.value / total) * 100) : 0}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

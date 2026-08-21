import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "watch" | "critical" | "oos" | "safe";
}) {
  const toneCls = {
    default: "text-primary bg-secondary",
    watch: "text-watch bg-watch-bg",
    critical: "text-critical bg-critical-bg",
    oos: "text-oos bg-oos-bg",
    safe: "text-safe bg-safe-bg",
  }[tone];

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1.5 font-display text-3xl font-semibold tabular-nums tracking-tight text-navy">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        {icon ? (
          <div className={cn("grid size-10 place-items-center rounded-lg", toneCls)}>
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

import type { RiskStatus } from "@/lib/types";
import { riskLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const styles: Record<RiskStatus, string> = {
  safe: "bg-safe-bg text-safe",
  watch: "bg-watch-bg text-watch",
  critical: "bg-critical-bg text-critical",
  out_of_stock: "bg-oos-bg text-oos",
};

const dots: Record<RiskStatus, string> = {
  safe: "bg-safe",
  watch: "bg-watch",
  critical: "bg-critical",
  out_of_stock: "bg-oos",
};

export function RiskBadge({
  risk,
  className,
}: {
  risk: RiskStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        styles[risk],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dots[risk])} />
      {riskLabel(risk)}
    </span>
  );
}

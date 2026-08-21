import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { RiskBadge } from "@/components/risk-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStockStore } from "@/lib/store";
import { formatDate, formatDateTime } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/alerts")({
  component: AlertsPage,
});

function AlertsPage() {
  const alerts = useStockStore((s) => s.alerts);
  const products = useStockStore((s) => s.products);
  const resolve = useStockStore((s) => s.resolveAlert);
  const reopen = useStockStore((s) => s.reopenAlert);
  const [filter, setFilter] = useState<"all" | "critical" | "watch" | "resolved">("all");

  const rows = useMemo(() => {
    return alerts
      .filter((a) => {
        if (filter === "resolved") return a.status === "resolved";
        if (filter === "all") return a.status === "open";
        if (filter === "critical")
          return a.status === "open" && (a.severity === "critical" || a.severity === "out_of_stock");
        return a.status === "open" && a.severity === "watch";
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [alerts, filter]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Alerts"
        description="When a product is heading for a shortage, it shows up here with what to order and who to call."
      />

      <div className="inline-flex flex-wrap rounded-lg bg-muted p-1">
        {(
          [
            ["all", "Open"],
            ["critical", "Critical"],
            ["watch", "Watch"],
            ["resolved", "Resolved"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "h-8 rounded-md px-3 text-xs font-medium",
              filter === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {!rows.length ? (
        <EmptyState
          title="Nothing in this inbox."
          description="When stock nears a shortage, StockSense will raise an alert here."
        />
      ) : (
        <div className="space-y-3">
          {rows.map((a) => {
            const p = products.find((x) => x.id === a.productId);
            const loud = a.severity === "critical" || a.severity === "out_of_stock";
            return (
              <Card
                key={a.id}
                className={cn(
                  "p-4 sm:p-5",
                  loud && a.status === "open" && "ring-1 ring-critical/30",
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to="/inventory/$productId"
                        params={{ productId: a.productId }}
                        className="font-semibold hover:underline"
                      >
                        {p?.name ?? a.productId}
                      </Link>
                      <RiskBadge risk={a.severity} />
                    </div>
                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <dt className="text-xs text-muted-foreground">Current stock</dt>
                        <dd className="font-medium tabular-nums">
                          {p ? `${p.currentStock} ${p.unit}` : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Predicted shortage</dt>
                        <dd className="font-medium">{formatDate(a.predictedShortageDate)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Reorder quantity</dt>
                        <dd className="font-medium tabular-nums">{a.recommendedReorderQty}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Raised</dt>
                        <dd className="font-medium">{formatDateTime(a.createdAt)}</dd>
                      </div>
                    </dl>
                    {p ? (
                      <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="size-3.5" />
                        {p.supplierName} · {p.supplierContact}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {a.status === "open" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          resolve(a.id);
                          toast.success("Marked as resolved.");
                        }}
                      >
                        Mark resolved
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => reopen(a.id)}>
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

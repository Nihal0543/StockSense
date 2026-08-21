import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Boxes,
  FileBarChart,
  Package,
  PackageX,
  Plus,
  ShieldAlert,
  TrendingUp,
  Upload,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { RiskBadge } from "@/components/risk-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ForecastChart } from "@/components/charts/forecast-chart";
import { HealthChart } from "@/components/charts/health-chart";
import { useStockStore } from "@/lib/store";
import { atRisk, countByRisk, useCatalog } from "@/lib/selectors";
import { daysLabel, formatDate, formatDateTime } from "@/lib/format";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import type { ForecastHorizon } from "@/lib/types";

export const Route = createFileRoute("/_app/dashboard")({
  component: OwnerDashboard,
});

function OwnerDashboard() {
  const user = useCurrentUser();
  const catalog = useCatalog();
  const alerts = useStockStore((s) => s.alerts);
  const history = useStockStore((s) => s.history);
  const forecasts = useStockStore((s) => s.forecasts);
  const counts = countByRisk(catalog);
  const attention = atRisk(catalog).sort((a, b) => {
    const order = { out_of_stock: 0, critical: 1, watch: 2, safe: 3 };
    const byRisk = order[a.insight.risk] - order[b.insight.risk];
    if (byRisk !== 0) return byRisk;
    return (a.insight.daysUntilStockout ?? 999) - (b.insight.daysUntilStockout ?? 999);
  });
  const headline = attention[0];
  const urgentCount = counts.out_of_stock + counts.critical;
  const openAlerts = alerts
    .filter((a) => a.status === "open")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const defaultId = attention[0]?.product.id ?? catalog[0]?.product.id ?? "";
  const [productId, setProductId] = useState(defaultId);
  const [horizon, setHorizon] = useState<ForecastHorizon>(14);
  const selected = catalog.find((c) => c.product.id === productId) ?? catalog[0];

  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  const chartKey = useMemo(
    () => `${selected?.product.id}-${horizon}`,
    [selected?.product.id, horizon],
  );

  if (!catalog.length) {
    return (
      <div className="space-y-6">
        <PageHeader title={`Good to see you, ${firstName}`} />
        <EmptyState
          icon={<Package className="size-5" />}
          title="No inventory data yet."
          description="Upload your sales and stock CSV to generate your first prediction."
          action={
            <Button asChild>
              <Link to="/upload">Upload data</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good to see you, ${firstName}`}
        description="Here is what needs attention in the shop today — not a spreadsheet dump."
        actions={
          <Button asChild>
            <Link to="/upload">
              <Upload className="size-4" />
              Upload data
            </Link>
          </Button>
        }
      />

      {headline ? (
        <div className="flex flex-col gap-2 rounded-xl bg-navy px-4 py-3 text-navy-fg sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber" />
            <p className="text-sm">
              <span className="font-semibold">
                {urgentCount} product{urgentCount === 1 ? "" : "s"} need action today.
              </span>{" "}
              <span className="text-navy-muted">
                {headline.insight.risk === "out_of_stock"
                  ? `${headline.product.name} is already out of stock.`
                  : `${headline.product.name} is the most urgent — expected to run out ${daysLabel(headline.insight.daysUntilStockout).toLowerCase()}.`}
              </span>
            </p>
          </div>
          <Button size="sm" variant="secondary" asChild className="shrink-0">
            <Link to="/inventory">
              Review now
            </Link>
          </Button>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total products"
          value={catalog.length}
          icon={<Package className="size-4" />}
        />
        <KpiCard
          label="Products at risk"
          value={counts.watch + counts.critical + counts.out_of_stock}
          hint="Watch, critical, or out"
          tone="watch"
          icon={<ShieldAlert className="size-4" />}
        />
        <KpiCard
          label="Critical"
          value={counts.critical}
          hint="Likely to run out within 7 days"
          tone="critical"
          icon={<AlertTriangle className="size-4" />}
        />
        <KpiCard
          label="Out of stock"
          value={counts.out_of_stock}
          hint="Customers cannot buy these today"
          tone="oos"
          icon={<PackageX className="size-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,4fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Inventory health</CardTitle>
          </CardHeader>
          <CardContent>
            <HealthChart counts={counts} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Needs a reorder</CardTitle>
            <Link
              to="/inventory"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            <ul className="divide-y">
              {attention.slice(0, 5).map(({ product, insight }) => (
                <li key={product.id}>
                  <Link
                    to="/inventory/$productId"
                    params={{ productId: product.id }}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-muted/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.currentStock} {product.unit} left · run-out{" "}
                        {formatDate(insight.predictedStockoutDate)} · reorder{" "}
                        {insight.recommendedReorderQty}
                      </p>
                    </div>
                    <RiskBadge risk={insight.risk} />
                  </Link>
                </li>
              ))}
              {!attention.length ? (
                <li className="px-5 py-6 text-sm text-muted-foreground">
                  Everything is comfortably above reorder levels.
                </li>
              ) : null}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Demand forecast</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Historical sales against what StockSense expects next.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {catalog.map((c) => (
                  <SelectItem key={c.product.id} value={c.product.id}>
                    {c.product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="inline-flex rounded-lg bg-muted p-1">
              {([7, 14, 30] as ForecastHorizon[]).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h)}
                  className={`h-8 rounded-md px-3 text-xs font-medium ${
                    horizon === h
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  {h} days
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selected ? (
            <div key={chartKey}>
              <ForecastChart
                history={history[selected.product.id] ?? []}
                forecast={forecasts[selected.product.id] ?? []}
                horizon={horizon}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent alerts</CardTitle>
            <Link to="/alerts" className="text-xs font-medium text-primary hover:underline">
              Open inbox
            </Link>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            {openAlerts.length ? (
              <ul className="divide-y">
                {openAlerts.map((a) => {
                  const p = catalog.find((c) => c.product.id === a.productId)?.product;
                  return (
                    <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p?.name ?? a.productId}</p>
                        <p className="text-xs text-muted-foreground">
                          Shortage {formatDate(a.predictedShortageDate)} ·{" "}
                          {formatDateTime(a.createdAt)}
                        </p>
                      </div>
                      <RiskBadge risk={a.severity} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-5 py-6 text-sm text-muted-foreground">No open alerts.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <QuickAction to="/upload" icon={<Upload className="size-4" />} label="Upload sales & stock" />
            <QuickAction to="/products" icon={<Plus className="size-4" />} label="Add a product" />
            <QuickAction to="/predictions" icon={<TrendingUp className="size-4" />} label="View predictions" />
            <QuickAction to="/alerts" icon={<Bell className="size-4" />} label="View alerts" />
            <QuickAction to="/reports" icon={<FileBarChart className="size-4" />} label="Generate a report" />
            <QuickAction to="/inventory" icon={<Boxes className="size-4" />} label="Browse inventory" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({
  to,
  icon,
  label,
}: {
  to: "/upload" | "/products" | "/predictions" | "/alerts" | "/reports" | "/inventory";
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex h-11 items-center gap-3 rounded-lg border border-transparent px-3 text-sm font-medium hover:border-border hover:bg-muted/70"
    >
      <span className="grid size-8 place-items-center rounded-md bg-secondary text-primary">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      <ArrowRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

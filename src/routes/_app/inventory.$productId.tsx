import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Phone, Pencil } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { RiskBadge } from "@/components/risk-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForecastChart } from "@/components/charts/forecast-chart";
import { StockTrendChart } from "@/components/charts/stock-trend-chart";
import { useStockStore } from "@/lib/store";
import { insightFor } from "@/lib/store";
import { daysLabel, formatDate, formatNumber, formatPercent } from "@/lib/format";
import type { ForecastHorizon } from "@/lib/types";

export const Route = createFileRoute("/_app/inventory/$productId")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const product = useStockStore((s) => s.products.find((p) => p.id === productId));
  const history = useStockStore((s) => s.history[productId] ?? []);
  const forecast = useStockStore((s) => s.forecasts[productId] ?? []);
  const [horizon, setHorizon] = useState<ForecastHorizon>(14);

  if (!product) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">This product is no longer in the catalog.</p>
        <Button variant="outline" asChild>
          <Link to="/inventory">Back to inventory</Link>
        </Button>
      </div>
    );
  }

  const insight = insightFor(product, history);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => void navigate({ to: "/inventory" })}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Inventory
      </button>

      <PageHeader
        title={product.name}
        description={`${product.category} · SKU ${product.sku}`}
        actions={
          <>
            <RiskBadge risk={insight.risk} className="h-8 px-3" />
            <Button variant="outline" asChild>
              <Link to="/products">
                <Pencil className="size-4" />
                Edit in catalog
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Current stock" value={`${formatNumber(product.currentStock)} ${product.unit}`} />
        <Stat label="Reorder threshold" value={formatNumber(product.reorderThreshold)} />
        <Stat
          label="Predicted run-out"
          value={formatDate(insight.predictedStockoutDate)}
          hint={daysLabel(insight.daysUntilStockout)}
        />
        <Stat
          label="Recommended reorder"
          value={formatNumber(insight.recommendedReorderQty)}
          hint={`${product.unit} · ${formatPercent(insight.confidence)} confidence`}
        />
      </div>

      {insight.risk !== "safe" ? (
        <div className="rounded-xl border border-watch/20 bg-amber-bg p-4 sm:p-5">
          <p className="text-sm font-semibold text-navy">Why this needs attention</p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{insight.explanation}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <Phone className="size-4 text-muted-foreground" />
            <span>
              Call {product.supplierName} at{" "}
              <span className="font-medium">{product.supplierContact}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-safe-bg p-4 text-sm text-safe">
          {insight.explanation}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Sales vs predicted demand</CardTitle>
            <div className="inline-flex rounded-lg bg-muted p-1">
              {([7, 14, 30] as ForecastHorizon[]).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h)}
                  className={`h-8 rounded-md px-2.5 text-xs font-medium ${
                    horizon === h ? "bg-card shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {h}d
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ForecastChart history={history} forecast={forecast} horizon={horizon} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stock-level trend</CardTitle>
          </CardHeader>
          <CardContent>
            <StockTrendChart history={history} threshold={product.reorderThreshold} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{product.supplierName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Contact</p>
            <p className="font-medium">{product.supplierContact}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold tabular-nums text-navy">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}

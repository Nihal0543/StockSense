import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { RiskBadge } from "@/components/risk-badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCatalog, matchesRisk } from "@/lib/selectors";
import { formatDate, formatNumber, formatPercent } from "@/lib/format";
import { predictedDemand } from "@/lib/forecast";
import type { ForecastHorizon } from "@/lib/types";

export const Route = createFileRoute("/_app/predictions")({
  component: PredictionsPage,
});

function PredictionsPage() {
  const catalog = useCatalog();
  const [horizon, setHorizon] = useState<ForecastHorizon>(14);
  const [risk, setRisk] = useState("all");

  const rows = useMemo(() => {
    const order = { out_of_stock: 0, critical: 1, watch: 2, safe: 3 } as const;
    return catalog
      .filter((c) => matchesRisk(c.insight.risk, risk))
      .sort((a, b) => order[a.insight.risk] - order[b.insight.risk]);
  }, [catalog, risk]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Shortage predictions"
        description="For each product: how much you will sell, when stock hits zero, and how much to order."
      />

      <div className="flex flex-wrap gap-2">
        <div className="inline-flex rounded-lg bg-muted p-1">
          {([7, 14, 30] as ForecastHorizon[]).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHorizon(h)}
              className={`h-8 rounded-md px-3 text-xs font-medium ${
                horizon === h ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Next {h} days
            </button>
          ))}
        </div>
        <Select value={risk} onValueChange={setRisk}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All risk</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="watch">Watch</SelectItem>
            <SelectItem value="safe">Safe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <div className="hidden overflow-x-auto md:block">
          <Table className="min-w-[56rem]">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Demand</TableHead>
                <TableHead>Stockout</TableHead>
                <TableHead>Horizon</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right">Conf.</TableHead>
                <TableHead className="text-right">Reorder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ product, insight }) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link
                      to="/inventory/$productId"
                      params={{ productId: product.id }}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(product.currentStock)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(predictedDemand(insight.avgDailySales, horizon))}
                  </TableCell>
                  <TableCell>{formatDate(insight.predictedStockoutDate)}</TableCell>
                  <TableCell className="text-muted-foreground">{horizon} days</TableCell>
                  <TableCell>
                    <RiskBadge risk={insight.risk} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatPercent(insight.confidence)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatNumber(insight.recommendedReorderQty)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="divide-y md:hidden">
          {rows.map(({ product, insight }) => (
            <Link
              key={product.id}
              to="/inventory/$productId"
              params={{ productId: product.id }}
              className="block p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{product.name}</p>
                <RiskBadge risk={insight.risk} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Demand {formatNumber(predictedDemand(insight.avgDailySales, horizon))} · run-out{" "}
                {formatDate(insight.predictedStockoutDate)} · order {insight.recommendedReorderQty}
              </p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

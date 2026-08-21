import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { RiskBadge } from "@/components/risk-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CATEGORIES } from "@/lib/data/seed";
import { daysLabel, formatDate, formatNumber } from "@/lib/format";
import { matchesRisk, useCatalog } from "@/lib/selectors";
import type { RiskStatus } from "@/lib/types";

type Search = { risk?: string; q?: string; category?: string };

export const Route = createFileRoute("/_app/inventory")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    risk: typeof s.risk === "string" ? s.risk : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
  }),
  component: InventoryPage,
});

const PAGE_SIZE = 8;

function InventoryPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/inventory" });
  const catalog = useCatalog();
  const [sort, setSort] = useState<"risk" | "stock" | "name">("risk");
  const [page, setPage] = useState(0);

  const q = search.q ?? "";
  const risk = search.risk ?? "all";
  const category = search.category ?? "all";

  const filtered = useMemo(() => {
    const order: Record<RiskStatus, number> = {
      out_of_stock: 0,
      critical: 1,
      watch: 2,
      safe: 3,
    };
    let rows = catalog.filter((c) => {
      if (q && !`${c.product.name} ${c.product.sku}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      if (!matchesRisk(c.insight.risk, risk)) return false;
      if (category !== "all" && c.product.category !== category) return false;
      return true;
    });
    rows = [...rows].sort((a, b) => {
      if (sort === "name") return a.product.name.localeCompare(b.product.name);
      if (sort === "stock") return a.product.currentStock - b.product.currentStock;
      return order[a.insight.risk] - order[b.insight.risk];
    });
    return rows;
  }, [catalog, q, risk, category, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pages - 1);
  const slice = filtered.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE);

  function patchSearch(next: Partial<Search>) {
    setPage(0);
    void navigate({
      search: (prev) => ({ ...prev, ...next }),
    });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventory"
        description="Every product on the shelf, with how soon it may run out."
        actions={
          <Button asChild variant="outline">
            <Link to="/upload">Upload a new count</Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name or SKU"
            value={q}
            onChange={(e) => patchSearch({ q: e.target.value || undefined })}
          />
        </div>
        <Select value={risk} onValueChange={(v) => patchSearch({ risk: v === "all" ? undefined : v })}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All risk</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="watch">Watch</SelectItem>
            <SelectItem value="safe">Safe</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={category}
          onValueChange={(v) => patchSearch({ category: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="risk">Sort: risk</SelectItem>
            <SelectItem value="stock">Sort: stock</SelectItem>
            <SelectItem value="name">Sort: name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!filtered.length ? (
        <EmptyState
          title="No products match these filters."
          description="Try a different search, or upload a CSV if this store is empty."
        />
      ) : (
        <>
          <Card className="hidden overflow-hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Reorder at</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Predicted stockout</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {slice.map(({ product, insight }) => (
                  <TableRow
                    key={product.id}
                    className="cursor-pointer"
                    onClick={() =>
                      void navigate({
                        to: "/inventory/$productId",
                        params: { productId: product.id },
                      })
                    }
                  >
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.sku}</div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(product.currentStock)} {product.unit}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(product.reorderThreshold)}
                    </TableCell>
                    <TableCell>
                      <RiskBadge risk={insight.risk} />
                    </TableCell>
                    <TableCell>
                      <div>{formatDate(insight.predictedStockoutDate)}</div>
                      <div className="text-xs text-muted-foreground">
                        {daysLabel(insight.daysUntilStockout)}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(product.lastUpdated)}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" asChild>
                        <Link
                          to="/inventory/$productId"
                          params={{ productId: product.id }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="grid gap-3 md:hidden">
            {slice.map(({ product, insight }) => (
              <Link
                key={product.id}
                to="/inventory/$productId"
                params={{ productId: product.id }}
                className="block rounded-xl bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.category} · {product.sku}
                    </p>
                  </div>
                  <RiskBadge risk={insight.risk} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Stock</dt>
                    <dd className="font-medium tabular-nums">
                      {product.currentStock} {product.unit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Run-out</dt>
                    <dd className="font-medium">{formatDate(insight.predictedStockoutDate)}</dd>
                  </div>
                </dl>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              {filtered.length} product{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pageSafe === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={pageSafe >= pages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

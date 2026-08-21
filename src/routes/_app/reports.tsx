import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/data/seed";
import { reportService } from "@/lib/services";
import { downloadCsv } from "@/lib/csv";
import { useStockStore } from "@/lib/store";
import type { ReportKind } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

const KINDS: { id: ReportKind; label: string; blurb: string }[] = [
  { id: "inventory", label: "Inventory report", blurb: "Stock on hand, reorder levels, and risk." },
  { id: "shortage", label: "Shortage prediction report", blurb: "Run-out dates and recommended order quantities." },
  { id: "alerts", label: "Alert report", blurb: "Every shortage alert raised, open or resolved." },
  { id: "sales", label: "Sales trend report", blurb: "Daily quantities sold for the date range you pick." },
];

function ReportsPage() {
  const products = useStockStore((s) => s.products);
  const [kind, setKind] = useState<ReportKind>("inventory");
  const [from, setFrom] = useState("2026-08-01");
  const [to, setTo] = useState("2026-08-21");
  const [category, setCategory] = useState("all");
  const [productId, setProductId] = useState("all");
  const [built, setBuilt] = useState<ReturnType<typeof reportService.build> | null>(null);

  const filteredProducts = useMemo(() => {
    return category === "all" ? products : products.filter((p) => p.category === category);
  }, [products, category]);

  function generate() {
    const report = reportService.build(kind, { from, to, category, productId });
    setBuilt(report);
    toast.success(`${report.title} ready.`);
  }

  function exportReport() {
    const report = built ?? reportService.build(kind, { from, to, category, productId });
    downloadCsv(
      `${report.title.toLowerCase().replace(/\s+/g, "-")}.csv`,
      reportService.toCsv(report.headers, report.rows),
    );
    toast.success("Download started.");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports"
        description="Export a simple snapshot you can share with a supplier or keep in the shop folder."
      />

      <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Build a report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {KINDS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(k.id)}
                  className={`w-full rounded-lg border px-3 py-2 text-left ${
                    kind === k.id ? "border-primary bg-secondary" : "border-transparent hover:bg-muted"
                  }`}
                >
                  <p className="text-sm font-medium">{k.label}</p>
                  <p className="text-xs text-muted-foreground">{k.blurb}</p>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="mb-1.5 block">From</Label>
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div>
                <Label className="mb-1.5 block">To</Label>
                <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
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
            </div>
            <div>
              <Label className="mb-1.5 block">Product</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All products</SelectItem>
                  {filteredProducts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={generate}>Generate report</Button>
              <Button variant="outline" onClick={exportReport}>
                <Download className="size-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{built?.title ?? "Preview"}</CardTitle>
          </CardHeader>
          <CardContent>
            {!built ? (
              <p className="text-sm text-muted-foreground">
                Choose a report type and generate a preview. Export downloads a CSV you can open in Excel.
              </p>
            ) : (
              <div className="overflow-auto rounded-lg border">
                <table className="w-full min-w-[40rem] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      {built.headers.map((h) => (
                        <th key={h} className="px-3 py-2 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {built.rows.slice(0, 40).map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {built.rows.length > 40 ? (
                  <p className="px-3 py-2 text-xs text-muted-foreground">
                    Showing 40 of {built.rows.length} rows. Export to see the full file.
                  </p>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  autoMapColumns,
  mapAndValidate,
  parseCsv,
  type CsvTable,
  type ValidationIssue,
} from "@/lib/csv";
import { SAMPLE_CSV } from "@/lib/data/seed";
import { useStockStore } from "@/lib/store";
import { toast } from "sonner";
import type { MappedCsvRow } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/upload")({
  component: UploadPage,
});

const FIELDS: { key: string; label: string; required?: boolean }[] = [
  { key: "product", label: "Product", required: true },
  { key: "date", label: "Transaction Date", required: true },
  { key: "quantitySold", label: "Sales Quantity", required: true },
  { key: "currentStock", label: "Stock Level", required: true },
  { key: "sku", label: "SKU" },
  { key: "category", label: "Category" },
];

type Step = "drop" | "map" | "preview" | "done";

function UploadPage() {
  const ingest = useStockStore((s) => s.ingestRows);
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [fileName, setFileName] = useState("");
  const [table, setTable] = useState<CsvTable | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [rows, setRows] = useState<MappedCsvRow[]>([]);
  const [step, setStep] = useState<Step>("drop");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ added: number; updated: number } | null>(null);

  function loadText(name: string, text: string) {
    const parsed = parseCsv(text);
    if (!parsed.headers.length) {
      toast.error("That file does not look like a CSV.");
      return;
    }
    setFileName(name);
    setTable(parsed);
    setMapping(autoMapColumns(parsed.headers));
    setStep("map");
    setIssues([]);
    setRows([]);
    setResult(null);
  }

  function onFile(file: File) {
    file.text().then((t) => loadText(file.name, t)).catch(() => toast.error("Could not read file."));
  }

  function useSample() {
    loadText("sample-sales-stock.csv", SAMPLE_CSV);
  }

  function validate() {
    if (!table) return;
    const { rows: mapped, issues: next } = mapAndValidate(table, mapping);
    setRows(mapped);
    setIssues(next);
    if (mapped.length && next.filter((i) => i.row === 0).length === 0) {
      setStep("preview");
    }
  }

  async function process() {
    setProgress(12);
    const tick = window.setInterval(() => {
      setProgress((p) => Math.min(92, p + 14));
    }, 180);
    await new Promise((r) => setTimeout(r, 1100));
    window.clearInterval(tick);
    const res = ingest(rows, fileName);
    setProgress(100);
    setResult(res);
    setStep("done");
    toast.success("Data processed. Predictions will refresh on the dashboard.");
  }

  const preview = useMemo(() => rows.slice(0, 8), [rows]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Upload sales & stock"
        description="Drop a CSV. StockSense will detect columns, check the rows, then update predictions."
        actions={
          <Button variant="outline" onClick={useSample}>
            Try a sample file
          </Button>
        }
      />

      {step === "drop" || step === "map" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files[0];
            if (f) onFile(f);
          }}
          className={cn(
            "flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card px-6 py-10 text-center transition-colors",
            drag ? "border-primary bg-secondary" : "border-border",
          )}
          onClick={() => inputRef.current?.click()}
        >
          <div className="grid size-12 place-items-center rounded-full bg-secondary text-primary">
            <Upload className="size-5" />
          </div>
          <p className="mt-3 font-semibold text-navy">Drop your sales & stock CSV here</p>
          <p className="mt-1 text-sm text-muted-foreground">
            or browse from your computer. Columns can be in any order.
          </p>
          <Button type="button" className="mt-4 pointer-events-none">
            Browse files
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </div>
      ) : null}

      {table && step === "map" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="size-4" />
              Match columns — {fileName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              CSV Column → StockSense field. We guessed a few; fix anything that looks off.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {FIELDS.map((f) => (
              <div key={f.key} className="grid items-center gap-2 sm:grid-cols-[10rem_1fr]">
                <p className="text-sm font-medium">
                  {f.label}
                  {f.required ? <span className="text-critical"> *</span> : null}
                </p>
                <Select
                  value={mapping[f.key] ?? "none"}
                  onValueChange={(v) =>
                    setMapping((m) => ({ ...m, [f.key]: v === "none" ? "" : v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Not mapped" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not mapped</SelectItem>
                    {table.headers.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            {issues.length ? (
              <ul className="rounded-lg bg-critical-bg p-3 text-sm text-critical">
                {issues.slice(0, 8).map((i, idx) => (
                  <li key={idx}>
                    {i.row ? `Row ${i.row}: ` : ""}
                    {i.message}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="flex gap-2 pt-2">
              <Button onClick={validate}>Validate & preview</Button>
              <Button variant="outline" onClick={() => setStep("drop")}>
                Choose another file
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === "preview" ? (
        <Card>
          <CardHeader>
            <CardTitle>Preview — {rows.length} valid rows</CardTitle>
            <p className="text-sm text-muted-foreground">
              {issues.length
                ? `${issues.length} row${issues.length === 1 ? "" : "s"} skipped due to errors.`
                : "No blocking errors."}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {issues.length ? (
              <ul className="max-h-32 overflow-auto rounded-lg bg-watch-bg p-3 text-xs text-watch">
                {issues.slice(0, 12).map((i, idx) => (
                  <li key={idx}>
                    Row {i.row}: {i.message}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Qty sold</th>
                    <th className="px-3 py-2">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((r, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-3 py-2">{r.product}</td>
                      <td className="px-3 py-2">{r.date}</td>
                      <td className="px-3 py-2 tabular-nums">{r.quantitySold}</td>
                      <td className="px-3 py-2 tabular-nums">{r.currentStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => void process()}>Process {rows.length} rows</Button>
              <Button variant="outline" onClick={() => setStep("map")}>
                Back to mapping
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === "done" && result ? (
        <Card>
          <CardContent className="flex flex-col items-center py-10 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-safe-bg text-safe">
              <CheckCircle2 className="size-6" />
            </div>
            <p className="mt-3 font-semibold text-navy">Upload processed</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {result.updated} existing product{result.updated === 1 ? "" : "s"} updated
              {result.added ? ` · ${result.added} new product${result.added === 1 ? "" : "s"} added` : ""}.
              Shortage predictions are ready on the dashboard.
            </p>
            <Progress value={progress} className="mt-5 max-w-xs" />
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link to="/dashboard">Go to dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/predictions">View predictions</Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setStep("drop");
                  setTable(null);
                  setProgress(0);
                }}
              >
                Upload another file
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {progress > 0 && step !== "done" ? (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Validating and running the forecast pipeline…
        </div>
      ) : null}
    </div>
  );
}

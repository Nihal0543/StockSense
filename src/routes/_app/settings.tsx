import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useStockStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const products = useStockStore((s) => s.products);
  const updateThreshold = useStockStore((s) => s.updateThreshold);
  const [draft, setDraft] = useState<Record<string, string>>({});

  function valueFor(id: string, current: number) {
    return draft[id] ?? String(current);
  }

  function save(id: string, current: number) {
    const n = Number(valueFor(id, current));
    if (!Number.isFinite(n) || n < 0) {
      toast.error("Enter a number of 0 or more.");
      return;
    }
    updateThreshold(id, Math.round(n));
    setDraft((d) => {
      const { [id]: _, ...rest } = d;
      return rest;
    });
    toast.success("Reorder level saved.");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reorder thresholds"
        description="StockSense uses this threshold to determine when an item needs your attention."
      />
      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[minmax(0,1fr)_7rem_9rem_5.5rem] gap-3 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground md:grid">
          <div>Product</div>
          <div>Current</div>
          <div>New</div>
          <div />
        </div>
        <ul className="divide-y">
          {products.map((p) => (
            <li
              key={p.id}
              className="grid gap-2 px-4 py-3 md:grid-cols-[minmax(0,1fr)_7rem_9rem_5.5rem] md:items-center md:gap-3"
            >
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  On hand: {p.currentStock} {p.unit}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground md:hidden">Current threshold</p>
                <p className="text-sm tabular-nums text-muted-foreground">{p.reorderThreshold}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground md:hidden">New threshold</p>
                <Input
                  type="number"
                  min={0}
                  value={valueFor(p.id, p.reorderThreshold)}
                  onChange={(e) => setDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                />
              </div>
              <Button
                size="sm"
                disabled={valueFor(p.id, p.reorderThreshold) === String(p.reorderThreshold)}
                onClick={() => save(p.id, p.reorderThreshold)}
              >
                Save
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

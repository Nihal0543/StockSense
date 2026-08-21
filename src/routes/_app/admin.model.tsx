import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { predictionService } from "@/lib/services";
import { useStockStore } from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/model")({
  component: ModelPage,
});

function ModelPage() {
  const model = useStockStore((s) => s.model);
  const products = useStockStore((s) => s.products);
  const [confirm, setConfirm] = useState(false);
  const [progress, setProgress] = useState(0);

  async function run() {
    setConfirm(false);
    setProgress(8);
    const tick = window.setInterval(() => {
      setProgress((p) => Math.min(90, p + 10));
    }, 220);
    try {
      await predictionService.retrain();
      setProgress(100);
      toast.success("Model retrained on the latest sales history.");
    } catch {
      toast.error("Retraining failed. Try again.");
    } finally {
      window.clearInterval(tick);
      window.setTimeout(() => setProgress(0), 800);
    }
  }

  const training = model.status === "training";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Model management"
        description="StockSense uses a lightweight Prophet model, with ARIMA as fallback when a product has thin history."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Name" value={model.name} />
            <Row label="Type" value={model.type} />
            <Row label="Fallback" value={model.fallback} />
            <Row label="Last trained" value={formatDateTime(model.lastTrained)} />
            <Row
              label="Status"
              value={
                <Badge variant={model.status === "ready" ? "safe" : model.status === "training" ? "watch" : "muted"}>
                  {model.status === "ready"
                    ? "Ready"
                    : model.status === "training"
                      ? "Training"
                      : "Stale — new data uploaded"}
                </Badge>
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Training data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Products in catalog" value={String(products.length)} />
            <Row label="Days of history used" value={String(model.trainingDays)} />
            <Row label="Last training set" value={`${model.trainingProducts} products`} />
            <p className="pt-2 text-muted-foreground">
              Retraining rebuilds demand forecasts and shortage dates from the latest
              uploaded sales. It does not change reorder thresholds you set.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
              <BrainCircuit className="size-5" />
            </div>
            <div>
              <p className="font-semibold">Trigger model retraining</p>
              <p className="text-sm text-muted-foreground">
                Run this after a large CSV upload, or if predictions look stale.
              </p>
            </div>
          </div>
          <Button disabled={training} onClick={() => setConfirm(true)}>
            {training ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Training…
              </>
            ) : (
              "Trigger model retraining"
            )}
          </Button>
        </div>
        {training || progress > 0 ? (
          <Progress value={training ? Math.max(progress, 15) : progress} className="mt-4" />
        ) : null}
      </Card>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retrain the prediction model?</AlertDialogTitle>
            <AlertDialogDescription>
              This uses the current catalog and sales history. Forecasts on the
              dashboard will refresh when the run finishes — usually a few seconds
              for a small-business catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void run()}>Start training</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

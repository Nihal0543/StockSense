import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStockStore } from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import { countByRisk, useCatalog } from "@/lib/selectors";

export const Route = createFileRoute("/_app/admin/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  const uploads = useStockStore((s) => s.uploads);
  const alerts = useStockStore((s) => s.alerts);
  const products = useStockStore((s) => s.products);
  const model = useStockStore((s) => s.model);
  const catalog = useCatalog();
  const counts = countByRisk(catalog);

  return (
    <div className="space-y-5">
      <PageHeader
        title="System activity"
        description="A quiet log of uploads, predictions, and alerts — enough to see that the pipeline is alive."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Prediction activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Last model run {formatDateTime(model.lastTrained)} · status{" "}
              <span className="font-medium">{model.status}</span>.
            </p>
            <p className="text-muted-foreground">
              {products.length} products scored. {counts.critical} critical, {counts.watch} on
              watch, {counts.out_of_stock} out of stock.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alert activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              {alerts.filter((a) => a.status === "open").length} open ·{" "}
              {alerts.filter((a) => a.status === "resolved").length} resolved.
            </p>
            <p className="text-muted-foreground">
              Newest: {alerts[0] ? formatDateTime(alerts[0].createdAt) : "none yet"}.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upload activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{uploads.length} files processed.</p>
            <p className="text-muted-foreground">
              Latest {uploads[0] ? `${uploads[0].fileName} · ${uploads[0].rows} rows` : "—"}.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload history</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <ul className="divide-y">
            {uploads.map((u) => (
              <li key={u.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <p className="font-medium">{u.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.rows} rows · {formatDateTime(u.uploadedAt)}
                  </p>
                </div>
                <Badge variant={u.status === "processed" ? "safe" : "critical"}>{u.status}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

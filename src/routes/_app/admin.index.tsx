import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Activity,
  BrainCircuit,
  Shield,
  Upload,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStockStore } from "@/lib/store";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_app/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const users = useStockStore((s) => s.teamUsers);
  const uploads = useStockStore((s) => s.uploads);
  const alerts = useStockStore((s) => s.alerts);
  const products = useStockStore((s) => s.products);
  const model = useStockStore((s) => s.model);
  const storeName = useStockStore((s) => s.storeName);

  const active = users.filter((u) => u.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrator"
        description="Accounts, training runs, and system health — not shop-floor inventory."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total users" value={users.length} icon={<Users className="size-4" />} />
        <KpiCard label="Active users" value={active} tone="safe" icon={<Shield className="size-4" />} />
        <KpiCard label="Business profiles" value={1} hint={storeName} icon={<Activity className="size-4" />} />
        <KpiCard
          label="Open alerts"
          value={alerts.filter((a) => a.status === "open").length}
          tone="watch"
          icon={<Activity className="size-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Model status</CardTitle>
            <Button size="sm" variant="outline" asChild>
              <Link to="/admin/model">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Current model" value={model.name} />
            <Row label="Type" value={`${model.type} · fallback ${model.fallback}`} />
            <Row label="Last trained" value={formatDateTime(model.lastTrained)} />
            <Row
              label="Training data"
              value={`${model.trainingProducts} products · ${model.trainingDays} days`}
            />
            <Row
              label="Status"
              value={
                <Badge variant={model.status === "ready" ? "safe" : model.status === "training" ? "watch" : "muted"}>
                  {model.status === "ready"
                    ? "Ready"
                    : model.status === "training"
                      ? "Training"
                      : "Needs retraining"}
                </Badge>
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent uploads</CardTitle>
            <Upload className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-0">
            <ul className="divide-y">
              {uploads.slice(0, 5).map((u) => (
                <li key={u.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div>
                    <p className="font-medium">{u.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.rows} rows · {formatDateTime(u.uploadedAt)}
                    </p>
                  </div>
                  <Badge variant={u.status === "processed" ? "safe" : "critical"}>
                    {u.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <LinkCard
          to="/admin/users"
          icon={<Users className="size-4" />}
          title="User accounts"
          body="Add, disable, or change roles."
        />
        <LinkCard
          to="/admin/model"
          icon={<BrainCircuit className="size-4" />}
          title="Retrain the model"
          body="Run Prophet on the latest sales history."
        />
        <LinkCard
          to="/admin/activity"
          icon={<Activity className="size-4" />}
          title="Activity"
          body={`${products.length} products tracked · ${alerts.length} alerts logged.`}
        />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-medium">{value}</span>
    </div>
  );
}

function LinkCard({
  to,
  icon,
  title,
  body,
}: {
  to: "/admin/users" | "/admin/model" | "/admin/activity";
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="block rounded-xl bg-card p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-raised)]"
    >
      <div className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">{icon}</div>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </Link>
  );
}

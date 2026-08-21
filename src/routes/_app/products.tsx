import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/data/seed";
import { useStockStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/products")({
  component: ProductsPage,
});

type FormState = {
  name: string;
  sku: string;
  category: string;
  currentStock: string;
  reorderThreshold: string;
  unit: string;
  supplierName: string;
  supplierContact: string;
};

const emptyForm = (): FormState => ({
  name: "",
  sku: "",
  category: "Staples",
  currentStock: "0",
  reorderThreshold: "10",
  unit: "units",
  supplierName: "",
  supplierContact: "",
});

function fromProduct(p: Product): FormState {
  return {
    name: p.name,
    sku: p.sku,
    category: p.category,
    currentStock: String(p.currentStock),
    reorderThreshold: String(p.reorderThreshold),
    unit: p.unit,
    supplierName: p.supplierName,
    supplierContact: p.supplierContact,
  };
}

function ProductsPage() {
  const products = useStockStore((s) => s.products);
  const addProduct = useStockStore((s) => s.addProduct);
  const updateProduct = useStockStore((s) => s.updateProduct);
  const deleteProduct = useStockStore((s) => s.deleteProduct);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [removeId, setRemoveId] = useState<string | null>(null);

  const rows = useMemo(() => {
    return products.filter((p) => {
      if (q && !`${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (category !== "all" && p.category !== category) return false;
      return true;
    });
  }, [products, q, category]);

  function openNew() {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  }
  function openEdit(p: Product) {
    setEditing(p);
    setForm(fromProduct(p));
    setOpen(true);
  }

  function save() {
    if (form.name.trim().length < 2) {
      toast.error("Product name is required.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim() || `SKU-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      category: form.category,
      currentStock: Math.max(0, Number(form.currentStock) || 0),
      reorderThreshold: Math.max(0, Number(form.reorderThreshold) || 0),
      unit: form.unit.trim() || "units",
      supplierName: form.supplierName.trim() || "Unassigned supplier",
      supplierContact: form.supplierContact.trim() || "—",
    };
    if (editing) {
      updateProduct(editing.id, payload);
      toast.success("Product updated.");
    } else {
      addProduct(payload);
      toast.success("Product added.");
    }
    setOpen(false);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Product catalog"
        description="Add, edit, or remove the items StockSense tracks."
        actions={
          <Button onClick={openNew}>
            <Plus className="size-4" />
            Add product
          </Button>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-44">
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

      {!rows.length ? (
        <EmptyState
          title="No products in the catalog."
          description="Add items manually, or upload a sales CSV and we will create them for you."
          action={
            <Button onClick={openNew}>
              <Plus className="size-4" />
              Add product
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.category} · {p.sku}
                  </p>
                </div>
                <div className="flex">
                  <Button size="icon-sm" variant="ghost" onClick={() => openEdit(p)} aria-label="Edit">
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setRemoveId(p.id)}
                    aria-label="Delete"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-muted-foreground">Stock</dt>
                  <dd className="font-medium tabular-nums">
                    {p.currentStock} {p.unit}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Reorder at</dt>
                  <dd className="font-medium tabular-nums">{p.reorderThreshold}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Supplier</dt>
                  <dd className="truncate font-medium">{p.supplierName}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "Add product"}</DialogTitle>
            <DialogDescription>
              These details appear on the inventory dashboard and in alerts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Product name" className="sm:col-span-2">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="SKU">
              <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </Field>
            <Field label="Category">
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Current stock">
              <Input
                type="number"
                min={0}
                value={form.currentStock}
                onChange={(e) => setForm({ ...form, currentStock: e.target.value })}
              />
            </Field>
            <Field label="Reorder threshold">
              <Input
                type="number"
                min={0}
                value={form.reorderThreshold}
                onChange={(e) => setForm({ ...form, reorderThreshold: e.target.value })}
              />
            </Field>
            <Field label="Unit">
              <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            </Field>
            <Field label="Supplier name">
              <Input
                value={form.supplierName}
                onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
              />
            </Field>
            <Field label="Supplier contact" className="sm:col-span-2">
              <Input
                value={form.supplierContact}
                onChange={(e) => setForm({ ...form, supplierContact: e.target.value })}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Save changes" : "Add product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(removeId)} onOpenChange={() => setRemoveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this product?</AlertDialogTitle>
            <AlertDialogDescription>
              It will leave the catalog, inventory, and prediction lists. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (removeId) deleteProduct(removeId);
                toast.success("Product removed.");
                setRemoveId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

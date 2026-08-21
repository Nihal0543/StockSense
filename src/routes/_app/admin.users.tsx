import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useStockStore } from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import type { UserRole, TeamUser } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const users = useStockStore((s) => s.teamUsers);
  const addUser = useStockStore((s) => s.addUser);
  const updateUser = useStockStore((s) => s.updateUser);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("owner");

  function startNew() {
    setEditing(null);
    setName("");
    setEmail("");
    setRole("owner");
    setOpen(true);
  }
  function startEdit(u: TeamUser) {
    setEditing(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setOpen(true);
  }
  function save() {
    if (name.trim().length < 2 || !email.includes("@")) {
      toast.error("Name and a valid email are required.");
      return;
    }
    if (editing) {
      updateUser(editing.id, { name: name.trim(), email: email.trim(), role });
      toast.success("User updated.");
    } else {
      addUser({ name: name.trim(), email: email.trim(), role, status: "active" });
      toast.success("User added.");
    }
    setOpen(false);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="User accounts"
        description="Create accounts and assign Business Owner or Administrator roles."
        actions={
          <Button onClick={startNew}>
            <Plus className="size-4" />
            Add user
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last login</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {u.role === "admin" ? "Administrator" : "Business Owner"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={u.status === "active" ? "safe" : "muted"}>
                    {u.status === "active" ? "Active" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.lastLogin === "—" ? "—" : formatDateTime(u.lastLogin)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(u)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        updateUser(u.id, {
                          status: u.status === "active" ? "disabled" : "active",
                        });
                        toast.success(
                          u.status === "active" ? "User disabled." : "User re-enabled.",
                        );
                      }}
                    >
                      {u.status === "active" ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit user" : "Add user"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="mb-1.5 block">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Business Owner</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

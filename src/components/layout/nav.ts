import {
  Activity,
  Bell,
  Boxes,
  BrainCircuit,
  FileBarChart,
  LayoutDashboard,
  Package,
  SlidersHorizontal,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import type { UserRole } from "@/lib/types";

export type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: "alerts";
};

export const ownerNav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/predictions", label: "Predictions", icon: TrendingUp },
  { to: "/upload", label: "Upload Data", icon: Upload },
  { to: "/products", label: "Products", icon: Boxes },
  { to: "/alerts", label: "Alerts", icon: Bell, badge: "alerts" },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: SlidersHorizontal },
];

export const adminNav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/model", label: "Model", icon: BrainCircuit },
  { to: "/admin/activity", label: "Activity", icon: Activity },
];

export function navFor(role: UserRole) {
  return role === "admin" ? adminNav : ownerNav;
}

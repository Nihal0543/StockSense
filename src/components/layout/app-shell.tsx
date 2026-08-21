import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronsUpDown,
  LogOut,
  Menu,
  Shield,
  Store,
} from "lucide-react";
import { useCurrentUser, useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useStockStore } from "@/lib/store";
import { initials } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarNav } from "./sidebar-nav";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inventory": "Inventory",
  "/predictions": "Predictions",
  "/upload": "Upload data",
  "/products": "Product catalog",
  "/alerts": "Alerts",
  "/reports": "Reports",
  "/settings": "Reorder thresholds",
  "/admin": "Administrator",
  "/admin/users": "User accounts",
  "/admin/model": "Model management",
  "/admin/activity": "System activity",
};

function titleFor(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/inventory/")) return "Product details";
  return "StockSense";
}

export function AppShell() {
  const { user, isPending } = useCurrentUserState();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const finish = () => {
      if (!cancelled) setHydrated(true);
    };
    const unsub = useStockStore.persist.onFinishHydration(finish);
    void Promise.resolve(useStockStore.persist.rehydrate()).then(finish, finish);
    if (useStockStore.persist.hasHydrated()) finish();
    const t = window.setTimeout(finish, 300);
    return () => {
      cancelled = true;
      unsub?.();
      window.clearTimeout(t);
    };
  }, []);

  if (isPending) return <LoadingScreen />;
  if (!user) return <RedirectToSignIn />;
  if (!hydrated) return <LoadingScreen />;

  return <ShellFrame />;
}

function LoadingScreen() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-6">
      <div className="text-center">
        <Logo />
        <p className="mt-6 text-sm font-medium text-navy">Loading StockSense…</p>
        <p className="mt-1 text-xs text-muted-foreground">Checking your session</p>
      </div>
    </div>
  );
}

function ShellFrame() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = useStockStore((s) => s.role);
  const storeName = useStockStore((s) => s.storeName);
  const alerts = useStockStore((s) => s.alerts);
  const openAlerts = alerts.filter((a) => a.status === "open").length;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "admin" && !pathname.startsWith("/admin")) {
      void navigate({ to: "/admin" });
    }
    if (role === "owner" && pathname.startsWith("/admin")) {
      void navigate({ to: "/dashboard" });
    }
  }, [role, pathname, navigate]);

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col bg-navy lg:flex">
        <SidebarNav role={role} alertCount={openAlerts} />
        <StoreCard />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0">
          <SidebarNav
            role={role}
            alertCount={openAlerts}
            onNavigate={() => setMobileOpen(false)}
          />
          <StoreCard />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur-sm sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="truncate text-sm font-semibold text-navy">{titleFor(pathname)}</p>
            <p className="truncate text-xs text-muted-foreground">{storeName}</p>
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {role === "owner" ? (
              <Link
                to="/alerts"
                className="relative grid size-10 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Alerts"
              >
                <Bell className="size-4" />
                {openAlerts > 0 ? (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-critical" />
                ) : null}
              </Link>
            ) : null}
            <AccountMenu />
          </div>
        </header>
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function StoreCard() {
  const storeName = useStockStore((s) => s.storeName);
  const role = useStockStore((s) => s.role);
  const setRole = useStockStore((s) => s.setRole);

  return (
    <div className="mt-auto border-t border-white/10 p-3">
      <p className="px-2 text-[10px] font-medium uppercase tracking-wider text-navy-muted">
        Viewing as
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg bg-navy-800 p-1">
        <button
          type="button"
          onClick={() => setRole("owner")}
          className={cn(
            "flex h-8 items-center justify-center gap-1.5 rounded-md text-xs font-medium",
            role === "owner" ? "bg-navy-600 text-white" : "text-navy-muted hover:text-navy-fg",
          )}
        >
          <Store className="size-3.5" />
          Owner
        </button>
        <button
          type="button"
          onClick={() => setRole("admin")}
          className={cn(
            "flex h-8 items-center justify-center gap-1.5 rounded-md text-xs font-medium",
            role === "admin" ? "bg-navy-600 text-white" : "text-navy-muted hover:text-navy-fg",
          )}
        >
          <Shield className="size-3.5" />
          Admin
        </button>
      </div>
      <p className="mt-3 truncate px-2 text-xs text-navy-muted">{storeName}</p>
    </div>
  );
}

function AccountMenu() {
  const user = useCurrentUser();
  const [signingOut, setSigningOut] = useState(false);
  if (!user) return null;
  const label = user.displayName ?? user.primaryEmail ?? "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-md px-1.5 hover:bg-muted"
        >
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt=""
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold text-navy">
              {initials(label)}
            </span>
          )}
          <span className="hidden max-w-32 truncate text-left text-sm font-medium sm:block">
            {label}
          </span>
          <ChevronsUpDown className="hidden size-3.5 text-muted-foreground sm:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="truncate font-medium text-foreground">{label}</div>
          {user.primaryEmail ? (
            <div className="truncate text-xs font-normal text-muted-foreground">
              {user.primaryEmail}
            </div>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {authEnabled ? (
          <DropdownMenuItem
            disabled={signingOut}
            onSelect={() => {
              setSigningOut(true);
              void signOut("/login").catch(() => setSigningOut(false));
            }}
          >
            <LogOut className="size-4" />
            {signingOut ? "Signing out…" : "Sign out"}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


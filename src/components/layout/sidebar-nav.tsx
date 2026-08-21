import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { navFor } from "./nav";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SidebarNav({
  role,
  alertCount,
  onNavigate,
}: {
  role: UserRole;
  alertCount: number;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = navFor(role);

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Logo inverted />
      </div>
      <nav className="flex-1 space-y-0.5 px-3">
        {items.map((item) => {
          const active =
            item.to === "/dashboard"
              ? pathname === "/dashboard"
              : item.to === "/admin"
                ? pathname === "/admin"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-navy-700 text-white"
                  : "text-navy-muted hover:bg-navy-800 hover:text-navy-fg",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge === "alerts" && alertCount > 0 ? (
                <span className="grid min-w-5 place-items-center rounded-full bg-critical px-1.5 text-[10px] font-semibold text-white">
                  {alertCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#0B1F3A" />
      <rect x="7" y="18" width="4.5" height="7" rx="1.2" fill="#E8EEF6" />
      <rect x="13.75" y="13" width="4.5" height="12" rx="1.2" fill="#E8EEF6" />
      <rect x="20.5" y="8" width="4.5" height="17" rx="1.2" fill="#1B5FBF" />
    </svg>
  );
}

export function Logo({
  inverted = false,
  className,
}: {
  inverted?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <div className="leading-none">
        <div
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            inverted ? "text-navy-fg" : "text-navy",
          )}
        >
          StockSense
        </div>
        <div
          className={cn(
            "mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
            inverted ? "text-navy-muted" : "text-muted-foreground",
          )}
        >
          Inventory foresight
        </div>
      </div>
    </div>
  );
}

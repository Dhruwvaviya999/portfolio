import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The "window" chrome around a terminal screen: title bar with traffic-light
 * dots (drawn from the terminal palette, not stock macOS colors), a centered
 * mono title, and an optional right-hand slot for actions (e.g. a close
 * button in the overlay). Purely presentational — no client code.
 */
export function TerminalWindow({
  title,
  actions,
  glow = true,
  className,
  bodyClassName,
  children,
}: {
  title: string;
  actions?: ReactNode;
  /** Soft brand glow behind the window (matches the hero blur accents). */
  glow?: boolean;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative", className)}>
      {glow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-brand/15 blur-3xl sm:-inset-8"
        />
      ) : null}

      <div className="term-screen overflow-hidden rounded-xl bg-card text-card-foreground shadow-xl shadow-black/5 ring-1 ring-foreground/10 dark:shadow-black/40">
        {/* Title bar */}
        <div className="flex h-10 items-center gap-3 border-b border-border/70 bg-muted/40 px-3.5">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="size-3 rounded-full bg-term-red/80" />
            <span className="size-3 rounded-full bg-term-yellow/80" />
            <span className="size-3 rounded-full bg-term-green/80" />
          </div>
          <span className="min-w-0 flex-1 truncate text-center font-mono text-xs text-muted-foreground">
            {title}
          </span>
          {/* Right slot keeps the title optically centered when empty. */}
          <div className="flex min-w-[3.25rem] items-center justify-end gap-1">
            {actions}
          </div>
        </div>

        {/* Screen. Inner top highlight gives a hint of glass depth in dark mode. */}
        <div
          className={cn(
            "bg-term-bg font-mono text-[13px] leading-relaxed dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04)] sm:text-sm",
            bodyClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";

import { cn } from "@/lib/utils";

/** Handlers that turn the traffic lights into real window buttons. */
export interface WindowControls {
  onClose: () => void;
  /** Toggles between minimized and restored. */
  onMinimize: () => void;
  /** Toggles between maximized and restored. */
  onMaximize: () => void;
  maximized: boolean;
}

/**
 * The "window" chrome around a terminal screen: title bar with traffic-light
 * dots (drawn from the terminal palette, not stock macOS colors), a centered
 * mono title, and an optional right-hand slot for actions. The dots are
 * decorative unless `controls` is passed (the overlay), in which case they
 * close / minimize / maximize. `collapsed` hides everything below the title
 * bar without unmounting it, so the scrollback survives.
 */
export function TerminalWindow({
  title,
  actions,
  controls,
  collapsed = false,
  glow = true,
  className,
  bodyClassName,
  children,
}: {
  title: string;
  actions?: ReactNode;
  controls?: WindowControls;
  collapsed?: boolean;
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
        <div
          className={cn(
            "flex h-10 items-center gap-3 border-b bg-muted/40 px-3.5 transition-colors duration-200",
            collapsed ? "border-transparent" : "border-border/70",
          )}
        >
          {controls ? (
            <div className="group/lights flex items-center gap-2">
              <TrafficLight label="Close terminal" className="bg-term-red/80" onClick={controls.onClose}>
                <X />
              </TrafficLight>
              <TrafficLight
                label={collapsed ? "Restore terminal" : "Minimize terminal"}
                className="bg-term-yellow/80"
                onClick={controls.onMinimize}
              >
                <Minus />
              </TrafficLight>
              <TrafficLight
                label={controls.maximized ? "Restore terminal size" : "Maximize terminal"}
                className="bg-term-green/80"
                onClick={controls.onMaximize}
              >
                {controls.maximized ? <Minimize2 /> : <Maximize2 />}
              </TrafficLight>
            </div>
          ) : (
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="size-3 rounded-full bg-term-red/80" />
              <span className="size-3 rounded-full bg-term-yellow/80" />
              <span className="size-3 rounded-full bg-term-green/80" />
            </div>
          )}
          {/* While collapsed, the whole title is a click target to restore. */}
          {collapsed && controls ? (
            <button
              type="button"
              onClick={controls.onMinimize}
              title="Restore terminal"
              className="min-w-0 flex-1 cursor-pointer truncate text-center font-mono text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
            >
              {title}
            </button>
          ) : (
            <span className="min-w-0 flex-1 truncate text-center font-mono text-xs text-muted-foreground">
              {title}
            </span>
          )}
          {/* Right slot keeps the title optically centered when empty. */}
          <div className="flex min-w-[3.25rem] items-center justify-end gap-1">
            {actions}
          </div>
        </div>

        {/* Collapsing animates the row from 1fr to 0fr; `inert` keeps the
            hidden prompt from taking focus or keystrokes meanwhile. */}
        <div
          inert={collapsed}
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
            collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
          )}
        >
          {/* Screen. Inner top highlight gives a hint of glass depth in dark mode. */}
          <div
            className={cn(
              "min-h-0 overflow-hidden bg-term-bg font-mono text-[13px] leading-relaxed dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04)] sm:text-sm",
              bodyClassName,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** macOS-style dot; its glyph shows when any of the three is hovered or focused. */
function TrafficLight({
  label,
  className,
  onClick,
  children,
}: {
  label: string;
  className: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        // `after` widens the hit area beyond the 12px dot.
        "relative grid size-3 cursor-pointer place-items-center rounded-full text-black/60 outline-none after:absolute after:-inset-1 focus-visible:ring-3 focus-visible:ring-ring/50",
        "[&_svg]:size-2 [&_svg]:stroke-3 [&_svg]:opacity-0 group-hover/lights:[&_svg]:opacity-100 group-focus-within/lights:[&_svg]:opacity-100",
        className,
      )}
    >
      {children}
    </button>
  );
}

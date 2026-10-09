"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { SquareTerminal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TerminalData } from "@/lib/terminal/types";
import { Terminal } from "./terminal";

/** Matches the `duration-200` transitions on the window. */
const RESIZE_MS = 200;
/** Gap between a maximized window and the viewport edge (same as the overlay's `top-3`). */
const EDGE = 12;

type View = "closed" | "open" | "minimized";

/**
 * The section's terminal, with the same traffic lights as the overlay: close
 * (then reopen for a fresh session), minimize (collapse to the title bar) and
 * maximize. Maximizing lifts the window out of the flow with `position: fixed`
 * and animates top/left/width from its spot on the page to the viewport edges;
 * the empty slot keeps its height so the page doesn't jump. Escape or a click
 * on the backdrop brings it back.
 */
export function TerminalPanel({
  data,
  className,
}: {
  data: TerminalData;
  className?: string;
}) {
  const [view, setView] = useState<View>("open");
  const [maximized, setMaximized] = useState(false);
  /** Fixed-position box while maximized or animating back; null = in the flow. */
  const [frame, setFrame] = useState<CSSProperties | null>(null);
  const [slotHeight, setSlotHeight] = useState<number | null>(null);
  /** Bumped on reopen so the terminal remounts with a fresh session. */
  const [session, setSession] = useState(0);
  const slotRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const minimized = view === "minimized";
  // Like the overlay: backdrop and scroll lock only while maximized and expanded.
  const modal = maximized && !minimized;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /** Drop back into the flow immediately (close, `goto`). */
  const settle = useCallback(() => {
    window.clearTimeout(timer.current);
    setMaximized(false);
    setFrame(null);
    setSlotHeight(null);
  }, []);

  const maximize = useCallback(() => {
    const slot = slotRef.current;
    if (!slot) return;
    window.clearTimeout(timer.current);
    const r = slot.getBoundingClientRect();
    // Pin it where it is first, then animate out to the edges next frame.
    setSlotHeight(r.height);
    setFrame({ top: r.top, left: r.left, width: r.width });
    setView("open");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setFrame({ top: EDGE, left: EDGE, width: `calc(100% - ${2 * EDGE}px)` });
        setMaximized(true);
      }),
    );
  }, []);

  const restore = useCallback(() => {
    setMaximized(false);
    setView("open");
    // The scroll lock is released by now (layout effect), so the slot is
    // where it will stay. Animate back to it, then rejoin the flow.
    requestAnimationFrame(() => {
      const slot = slotRef.current;
      if (!slot) return;
      const r = slot.getBoundingClientRect();
      setFrame({ top: r.top, left: r.left, width: r.width });
      timer.current = window.setTimeout(() => {
        setFrame(null);
        setSlotHeight(null);
      }, RESIZE_MS);
    });
  }, []);

  const close = useCallback(() => {
    settle();
    setView("closed");
  }, [settle]);

  const reopen = () => {
    setSession((s) => s + 1);
    setView("open");
  };

  const toggleMinimized = useCallback(
    () => setView((v) => (v === "minimized" ? "open" : "minimized")),
    [],
  );

  // Lock page scroll while maximized, keeping the scrollbar's space so the
  // page doesn't shift underneath.
  useLayoutEffect(() => {
    if (!modal) return;
    const { style } = document.documentElement;
    const prev = { overflow: style.overflow, gutter: style.scrollbarGutter };
    style.overflow = "hidden";
    style.scrollbarGutter = "stable";
    return () => {
      style.overflow = prev.overflow;
      style.scrollbarGutter = prev.gutter;
    };
  }, [modal]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") restore();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, restore]);

  if (view === "closed") {
    return (
      <div className={className}>
        <div className="flex h-48 animate-in flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/40 duration-200 fade-in-0">
          <p className="font-mono text-xs text-muted-foreground">[Process completed]</p>
          <Button variant="outline" size="sm" onClick={reopen}>
            <SquareTerminal />
            Reopen terminal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={slotRef}
      className={className}
      style={slotHeight == null ? undefined : { height: slotHeight }}
    >
      {frame ? (
        <div
          aria-hidden="true"
          onClick={restore}
          className={cn(
            "fixed inset-0 z-50 animate-in bg-black/10 transition-opacity duration-200 fade-in-0 supports-backdrop-filter:backdrop-blur-xs",
            !modal && "pointer-events-none opacity-0",
          )}
        />
      ) : null}

      <div
        style={frame ?? undefined}
        className={cn(
          "transition-[top,left,width] duration-200 ease-out motion-reduce:transition-none",
          frame && "fixed z-50",
          session > 0 && "animate-in fade-in-0 zoom-in-95",
        )}
      >
        <Terminal
          key={session}
          data={data}
          boot={session === 0}
          autoFocus={session > 0}
          onClose={close}
          onScrollTo={settle}
          collapsed={minimized}
          maximized={maximized}
          controls={{
            onClose: close,
            onMinimize: toggleMinimized,
            onMaximize: maximized ? restore : maximize,
            maximized,
          }}
        />
      </div>
    </div>
  );
}

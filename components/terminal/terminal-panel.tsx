"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";
import type { TerminalData } from "@/lib/terminal/types";
import { Terminal } from "./terminal";

/** Matches the `duration-200` transitions on the window. */
const RESIZE_MS = 200;
/** Gap between a maximized window and the viewport edge (same as the overlay's `top-3`). */
const EDGE = 12;
/** Height of the area holding the Dock icon while closed. */
const DOCK_H = 160;

type View = "closed" | "open" | "minimized";

const SLOT_TRANSITION = "transition-[height] duration-200 ease-out motion-reduce:transition-none";

/**
 * The section's terminal, with the same traffic lights as the overlay: close
 * (then reopen for a fresh session), minimize (collapse to the title bar) and
 * maximize. Maximizing lifts the window out of the flow with `position: fixed`
 * and animates top/left/width from its spot on the page to the viewport edges;
 * the empty slot keeps its height so the page doesn't jump. Escape or a click
 * on the backdrop brings it back.
 *
 * Closing folds the body up like minimize, fades the title bar out, then
 * shrinks the space down to a Dock-style app icon. Clicking the icon plays it
 * backwards with a fresh session: the title bar pops out of the icon, then the
 * body unfolds.
 */
export function TerminalPanel({
  data,
  className,
}: {
  data: TerminalData;
  className?: string;
}) {
  const [view, setView] = useState<View>("open");
  /** Close in two steps: fold the body up, then fade the title bar. */
  const [closing, setClosing] = useState<"fold" | "fade" | null>(null);
  const [maximized, setMaximized] = useState(false);
  /** Fixed-position box while maximized or animating back; null = in the flow. */
  const [frame, setFrame] = useState<CSSProperties | null>(null);
  const [slotHeight, setSlotHeight] = useState<number | null>(null);
  /** Height the window had when closed; held while it folds and fades. */
  const [closedHeight, setClosedHeight] = useState<number | null>(null);
  /** Reopen in two steps: title bar appears, then the body unfolds. */
  const [opening, setOpening] = useState<"appear" | "unfold" | null>(null);
  const openTimer = useRef<number | undefined>(undefined);
  /** Bumped on reopen so the terminal remounts with a fresh session. */
  const [session, setSession] = useState(0);
  const slotRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const minimized = view === "minimized";
  // Like the overlay: backdrop and scroll lock only while maximized and expanded.
  const modal = maximized && !minimized && !closing;

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      window.clearTimeout(openTimer.current);
    },
    [],
  );

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

  // Fold up and fade out where it is (even maximized), then swap in the
  // placeholder. The slot holds its height meanwhile so the page stays put.
  const close = useCallback(() => {
    if (closing) return;
    window.clearTimeout(timer.current);
    window.clearTimeout(openTimer.current);
    setOpening(null);
    setClosedHeight(slotRef.current?.getBoundingClientRect().height ?? null);
    setClosing("fold");
    timer.current = window.setTimeout(
      () => {
        setClosing("fade");
        timer.current = window.setTimeout(() => {
          setClosing(null);
          settle();
          setView("closed");
        }, RESIZE_MS);
      },
      // Already folded when minimized: straight to the fade.
      minimized ? 0 : RESIZE_MS,
    );
  }, [closing, minimized, settle]);

  const reopen = () => {
    setSession((s) => s + 1);
    setView("open");
    setOpening("appear");
    openTimer.current = window.setTimeout(() => {
      setOpening("unfold");
      openTimer.current = window.setTimeout(() => setOpening(null), RESIZE_MS);
    }, RESIZE_MS);
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

  // The slot's height is pinned (and animated) whenever the window isn't
  // simply sitting in the flow: maximized, closing, closed, reopening.
  const slotStyle: CSSProperties = {
    height:
      slotHeight ?? (closing ? closedHeight : view === "closed" ? DOCK_H : null) ?? undefined,
    // Reopening: hold the Dock's space until the unfolding window outgrows it.
    minHeight: opening ? DOCK_H : undefined,
  };

  if (view === "closed") {
    return (
      <div
        ref={slotRef}
        className={cn("flex items-center justify-center", SLOT_TRANSITION, className)}
        style={slotStyle}
      >
        <DockIcon onOpen={reopen} />
      </div>
    );
  }

  return (
    <div ref={slotRef} className={cn(SLOT_TRANSITION, className)} style={slotStyle}>
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

      {/* Keyed so each reopen remounts and replays the enter animation. */}
      <div
        key={session}
        style={frame ?? undefined}
        className={cn(
          "transition-[top,left,width,opacity,scale] duration-200 ease-out motion-reduce:transition-none",
          frame && "fixed z-50",
          // Reopened: grow out of the Dock icon, centered DOCK_H / 2 down.
          session > 0 && "origin-[50%_5rem] animate-in fade-in-0 zoom-in-75",
          closing === "fade" && "scale-95 opacity-0",
        )}
      >
        <Terminal
          data={data}
          boot={session === 0}
          autoFocus={session > 0}
          onClose={close}
          onScrollTo={settle}
          collapsed={minimized || closing !== null || opening === "appear"}
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

/** Mac Dock-style app icon: a tiny copy of the window, lifting on hover. */
function DockIcon({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open terminal"
      title="Open terminal"
      className="group flex animate-in cursor-pointer flex-col items-center gap-2 outline-none duration-200 fade-in-0 zoom-in-75"
    >
      <span
        aria-hidden="true"
        className="flex size-16 flex-col overflow-hidden rounded-2xl bg-card shadow-lg shadow-black/10 ring-1 ring-foreground/10 transition-[translate,scale] duration-200 ease-out group-hover:-translate-y-1.5 group-hover:scale-110 group-focus-visible:ring-3 group-focus-visible:ring-ring/50 group-active:scale-95 dark:shadow-black/40"
      >
        <span className="flex h-3.5 shrink-0 items-center gap-[3px] bg-muted/60 px-2">
          <span className="size-1.5 rounded-full bg-term-red/80" />
          <span className="size-1.5 rounded-full bg-term-yellow/80" />
          <span className="size-1.5 rounded-full bg-term-green/80" />
        </span>
        <span className="flex-1 bg-term-bg px-2 pt-1.5 text-left font-mono text-xs leading-none font-bold text-term-prompt">
          &gt;_
        </span>
      </span>
      <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
        Terminal
      </span>
    </button>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TerminalData } from "@/lib/terminal/types";
import { Terminal } from "./terminal";
import { useDragOffset } from "./use-drag-offset";

/** Window event that opens the overlay from anywhere (navbar button, etc.). */
export const TERMINAL_OPEN_EVENT = "portfolio:terminal:open";

export function openTerminal() {
  window.dispatchEvent(new Event(TERMINAL_OPEN_EVENT));
}

function isTypingTarget(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    (el as HTMLElement).isContentEditable
  );
}

/**
 * "minimized" keeps the dialog open but collapses it to its title bar, in
 * place and non-modal, so the page is usable and the session survives.
 */
type View = "closed" | "open" | "minimized";

/** Matches the window's `duration-200` fold (see `TerminalWindow`). */
const FOLD_MS = 200;

/**
 * Global terminal overlay. Opens on the backtick key (or Ctrl+`) from anywhere
 * that isn't a text field, or via `openTerminal()`. Mounted once in the root
 * layout by `TerminalLauncher`; shares command history with the section
 * terminal through sessionStorage. The traffic lights close, minimize
 * (collapse to the title bar) and maximize it; the title bar drags it around.
 * Every way of closing folds the body up first, like minimize, then lets the
 * dialog fade the title bar out.
 */
export function TerminalDialog({ data }: { data: TerminalData }) {
  const [view, setView] = useState<View>("closed");
  const [maximized, setMaximized] = useState(false);
  /** Folding up before the dialog actually closes. */
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const open = view !== "closed";
  const minimized = view === "minimized";
  const drag = useDragOffset();

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const close = useCallback(() => {
    if (view === "closed" || closing) return;
    setClosing(true);
    // Already folded when minimized: straight to the fade.
    closeTimer.current = window.setTimeout(
      () => {
        setClosing(false);
        setView("closed");
      },
      view === "minimized" ? 0 : FOLD_MS,
    );
  }, [view, closing]);

  /** Open, restore from minimized, or cancel a close that's folding. */
  const show = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setClosing(false);
    setView("open");
  }, []);
  const toggleMinimized = useCallback(
    () => setView((v) => (v === "minimized" ? "open" : "minimized")),
    [],
  );
  const toggleMaximized = useCallback(() => {
    setMaximized((m) => !m);
    setView("open");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "`" || e.metaKey || e.altKey) return;
      if (isTypingTarget(document.activeElement) && !e.ctrlKey) return;
      e.preventDefault();
      // Open -> close; closed, minimized or mid-close -> bring it up.
      if (view === "open" && !closing) close();
      else show();
    };
    window.addEventListener(TERMINAL_OPEN_EVENT, show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(TERMINAL_OPEN_EVENT, show);
      window.removeEventListener("keydown", onKey);
    };
  }, [view, closing, close, show]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next, details) => {
        if (next) return show();
        // While minimized, Escape belongs to the page, not the terminal.
        if (minimized && details.reason === "escape-key") return;
        close();
      }}
      // Minimized: no focus trap or scroll lock, and outside clicks don't
      // dismiss it. The backdrop fades out and lets clicks through.
      modal={!minimized}
      disablePointerDismissal={minimized}
      // Reopen at the normal size and place, but don't move while fading out.
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) {
          setMaximized(false);
          drag.reset();
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName={cn(
          "transition-opacity duration-200",
          minimized && "pointer-events-none opacity-0",
        )}
        className={cn(
          "translate-y-0 gap-0 bg-transparent p-0 shadow-none ring-0 data-open:slide-in-from-top-2",
          // Grows from the same spot as the screen height (see `Terminal`).
          // max-w-[100vw] rather than none so the width can animate.
          "transition-[top,width,max-width] duration-200 ease-out motion-reduce:transition-none",
          // Normal size matches the section terminal (`max-w-4xl` inside the
          // page's px-4 / sm:px-6 gutters).
          maximized
            ? "top-3 w-[calc(100%-1.5rem)] max-w-[100vw] sm:max-w-[100vw]"
            : "top-[6svh] w-[calc(100%-2rem)] max-w-4xl sm:top-[10svh] sm:w-[calc(100%-3rem)] sm:max-w-4xl",
        )}
      >
        <DialogTitle className="sr-only">Terminal</DialogTitle>
        <DialogDescription className="sr-only">
          Explore the portfolio with commands. Type help for a list. Press Escape to close.
        </DialogDescription>

        {/* Not gated on `open`: the popup stays mounted through its exit
            animation, and unmounts (ending the session) once it's done.
            The drag offset lives on this wrapper, not the popup, so it
            doesn't fight the open/close animation's transform. */}
        <div
          ref={drag.targetRef}
          // Maximized fills the viewport, so the dragged position is parked
          // until restore (kept, not cleared). The transition is for that
          // move only; the hook switches it off while dragging.
          style={maximized ? { transform: "translate(0px, 0px)" } : drag.targetStyle}
          className="transition-transform duration-200 ease-out motion-reduce:transition-none"
        >
          <Terminal
            data={data}
            autoFocus
            onClose={close}
            collapsed={minimized || closing}
            maximized={maximized}
            titleBarProps={maximized ? undefined : drag.handleProps}
            controls={{
              onClose: close,
              onMinimize: toggleMinimized,
              onMaximize: toggleMaximized,
              maximized,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TerminalData } from "@/lib/terminal/types";
import { Terminal } from "./terminal";

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
 * "minimized" keeps the dialog open but docks it to the bottom-right corner as
 * a non-modal title bar, so the page is usable and the session survives.
 */
type View = "closed" | "open" | "minimized";

/**
 * Global terminal overlay. Opens on the backtick key (or Ctrl+`) from anywhere
 * that isn't a text field, or via `openTerminal()`. Mounted once in the root
 * layout by `TerminalLauncher`; shares command history with the section
 * terminal through sessionStorage. The traffic lights close, minimize (dock)
 * and maximize it.
 */
export function TerminalDialog({ data }: { data: TerminalData }) {
  const [view, setView] = useState<View>("closed");
  const [maximized, setMaximized] = useState(false);
  const open = view !== "closed";
  const minimized = view === "minimized";

  const close = useCallback(() => setView("closed"), []);
  const toggleMinimized = useCallback(
    () => setView((v) => (v === "minimized" ? "open" : "minimized")),
    [],
  );
  const toggleMaximized = useCallback(() => {
    setMaximized((m) => !m);
    setView("open");
  }, []);

  useEffect(() => {
    const onOpen = () => setView("open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "`" || e.metaKey || e.altKey) return;
      if (isTypingTarget(document.activeElement) && !e.ctrlKey) return;
      e.preventDefault();
      // Closed or docked -> bring it up; open -> close.
      setView((v) => (v === "open" ? "closed" : "open"));
    };
    window.addEventListener(TERMINAL_OPEN_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(TERMINAL_OPEN_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(next, details) => {
        if (next) return setView("open");
        // While docked, Escape belongs to the page, not the terminal.
        if (minimized && details.reason === "escape-key") return;
        setView("closed");
      }}
      // Docked: no backdrop, focus trap, or scroll lock, and outside clicks
      // don't dismiss it.
      modal={!minimized}
      disablePointerDismissal={minimized}
    >
      <DialogContent
        showCloseButton={false}
        showOverlay={!minimized}
        className={cn(
          "gap-0 bg-transparent p-0 shadow-none ring-0",
          minimized
            ? "top-auto right-4 bottom-4 left-auto w-72 max-w-[calc(100%-2rem)] translate-x-0 translate-y-0 sm:max-w-[calc(100%-2rem)]"
            : maximized
              ? "top-3 w-[calc(100%-1.5rem)] max-w-none translate-y-0 sm:max-w-none data-open:slide-in-from-top-2"
              : "top-[6svh] w-[calc(100%-1.5rem)] max-w-3xl translate-y-0 sm:top-[10svh] sm:max-w-3xl data-open:slide-in-from-top-2",
        )}
      >
        <DialogTitle className="sr-only">Terminal</DialogTitle>
        <DialogDescription className="sr-only">
          Explore the portfolio with commands. Type help for a list. Press Escape to close.
        </DialogDescription>

        {open ? (
          <Terminal
            data={data}
            autoFocus
            onClose={close}
            collapsed={minimized}
            controls={{
              onClose: close,
              onMinimize: toggleMinimized,
              onMaximize: toggleMaximized,
              maximized,
            }}
            // Maximized: fill the viewport minus the 0.75rem margins, title bar
            // and quick-command row (which can wrap on phones).
            screenClassName={
              maximized
                ? "h-[calc(100svh-8rem)] sm:h-[calc(100svh-6.5rem)]"
                : "h-[52svh] sm:h-[56svh]"
            }
            actions={
              minimized ? null : (
                <kbd className="hidden rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                  esc
                </kbd>
              )
            }
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

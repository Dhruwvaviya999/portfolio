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
 * "minimized" keeps the dialog open but collapses it to its title bar, in
 * place and non-modal, so the page is usable and the session survives.
 */
type View = "closed" | "open" | "minimized";

/**
 * Global terminal overlay. Opens on the backtick key (or Ctrl+`) from anywhere
 * that isn't a text field, or via `openTerminal()`. Mounted once in the root
 * layout by `TerminalLauncher`; shares command history with the section
 * terminal through sessionStorage. The traffic lights close, minimize
 * (collapse to the title bar) and maximize it.
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
      // Closed or minimized -> bring it up; open -> close.
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
        // While minimized, Escape belongs to the page, not the terminal.
        if (minimized && details.reason === "escape-key") return;
        setView("closed");
      }}
      // Minimized: no focus trap or scroll lock, and outside clicks don't
      // dismiss it. The backdrop fades out and lets clicks through.
      modal={!minimized}
      disablePointerDismissal={minimized}
      // Reopen at the normal size, but don't shrink while fading out.
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) setMaximized(false);
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName={cn(
          "transition-opacity duration-200",
          minimized && "pointer-events-none opacity-0",
        )}
        className={cn(
          "w-[calc(100%-1.5rem)] translate-y-0 gap-0 bg-transparent p-0 shadow-none ring-0 data-open:slide-in-from-top-2",
          // Grows from the same spot as the screen height (see `Terminal`).
          // max-w-[100vw] rather than none so the width can animate.
          "transition-[top,max-width] duration-200 ease-out motion-reduce:transition-none",
          maximized
            ? "top-3 max-w-[100vw] sm:max-w-[100vw]"
            : "top-[6svh] max-w-3xl sm:top-[10svh] sm:max-w-3xl",
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
            maximized={maximized}
            controls={{
              onClose: close,
              onMinimize: toggleMinimized,
              onMaximize: toggleMaximized,
              maximized,
            }}
            screenClassName="h-[52svh] sm:h-[56svh]"
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

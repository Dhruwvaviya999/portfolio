"use client";

import { useCallback, useEffect, useState } from "react";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
 * Global terminal overlay. Opens on the backtick key (or Ctrl+`) from anywhere
 * that isn't a text field, or via `openTerminal()`. Mounted once in the root
 * layout by `TerminalLauncher`; shares command history with the section
 * terminal through sessionStorage.
 */
export function TerminalDialog({ data }: { data: TerminalData }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "`" || e.metaKey || e.altKey) return;
      if (isTypingTarget(document.activeElement) && !e.ctrlKey) return;
      e.preventDefault();
      setOpen((o) => !o);
    };
    window.addEventListener(TERMINAL_OPEN_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(TERMINAL_OPEN_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="top-[6svh] w-[calc(100%-1.5rem)] max-w-3xl translate-y-0 gap-0 bg-transparent p-0 shadow-none ring-0 sm:top-[10svh] sm:max-w-3xl data-open:slide-in-from-top-2"
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
            screenClassName="h-[52svh] sm:h-[56svh]"
            actions={
              <>
                <kbd className="hidden rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                  esc
                </kbd>
                <DialogClose
                  render={
                    <Button variant="ghost" size="icon-xs" aria-label="Close terminal" />
                  }
                >
                  <XIcon />
                </DialogClose>
              </>
            }
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useTerminal } from "@/hooks/use-terminal";
import type { TerminalData } from "@/lib/terminal/types";
import { TerminalWindow, type WindowControls } from "./terminal-window";
import { TerminalOutput } from "./terminal-output";
import { TerminalInput } from "./terminal-input";

/** One-tap commands under the prompt — discoverability for touch users. */
const QUICK_COMMANDS = ["help", "projects", "skills", "contact", "neofetch"];

interface TerminalProps {
  data: TerminalData;
  /** Print the banner, then auto-type `whoami` the first time the screen scrolls into view. */
  boot?: boolean;
  /** Focus the prompt on mount (overlay). */
  autoFocus?: boolean;
  /** Wired to the `exit` command and to `goto` (overlay closes after scrolling). */
  onClose?: () => void;
  /** Extra controls for the title bar's right slot. */
  actions?: ReactNode;
  /** Makes the traffic lights live (overlay only). */
  controls?: WindowControls;
  /** Show only the title bar; the session stays mounted. */
  collapsed?: boolean;
  className?: string;
  /** Height of the scrollable screen. */
  screenClassName?: string;
}

/**
 * A complete terminal: window chrome, scrollback, prompt, and quick-command
 * chips. Renders on the client; receives all content as serializable props.
 */
export function Terminal({
  data,
  boot = false,
  autoFocus = false,
  onClose,
  actions,
  controls,
  collapsed = false,
  className,
  screenClassName,
}: TerminalProps) {
  const term = useTerminal({ data, onClose });
  const inputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

  const { run, typeCommand } = term;
  const first = data.profile.name.split(" ")[0].toLowerCase();

  // Banner on mount (silent — no echoed input line).
  useEffect(() => {
    void run("banner", { echo: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus the prompt on mount and again whenever the window is restored.
  useEffect(() => {
    if (autoFocus && !collapsed) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus, collapsed]);

  // Boot demo: once the screen is mostly in view, type `whoami` for the visitor.
  useEffect(() => {
    if (!boot) return;
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || booted.current) return;
        booted.current = true;
        observer.disconnect();
        window.setTimeout(() => void typeCommand("whoami"), 500);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [boot, typeCommand]);

  // Keep the latest output in view (also after restoring from collapsed).
  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [term.lines, term.input, collapsed]);

  const focusInput = () => {
    // Don't steal focus while the user is selecting text to copy.
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div ref={rootRef} className={className}>
      <TerminalWindow
        title={`${first}@portfolio: ~`}
        actions={actions}
        controls={controls}
        collapsed={collapsed}
      >
        <div
          ref={screenRef}
          onClick={focusInput}
          className={cn(
            "cursor-text overflow-y-auto overscroll-contain p-4 sm:p-5",
            "[scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]",
            screenClassName ?? "h-[22rem] sm:h-[26rem]",
          )}
        >
          <TerminalOutput lines={term.lines} />
          <TerminalInput
            ref={inputRef}
            value={term.input}
            onChange={term.setInput}
            onKeyDown={term.onKeyDown}
            onFocus={term.interrupt}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-border/70 bg-muted/30 px-3 py-2">
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => {
                term.interrupt();
                void run(cmd);
                inputRef.current?.focus({ preventScroll: true });
              }}
              className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
            >
              {cmd}
            </button>
          ))}
          <span className="ml-auto hidden font-mono text-[11px] text-muted-foreground/70 sm:inline">
            Tab · ↑↓ · Ctrl+L
          </span>
        </div>
      </TerminalWindow>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { COMMANDS, execute } from "@/lib/terminal/commands";
import { commonPrefix, complete, resolve, tokenize } from "@/lib/terminal/parse";
import { line, t } from "@/lib/terminal/format";
import type { CommandActions, OutLine, TermLine, TerminalData } from "@/lib/terminal/types";

const HISTORY_KEY = "portfolio:terminal:history";
const HISTORY_MAX = 100;
const TYPE_SPEED = 70; // ms per character when the terminal types for the user

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function loadHistory(): string[] {
  try {
    const raw = window.sessionStorage.getItem(HISTORY_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveHistory(history: string[]) {
  try {
    window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-HISTORY_MAX)));
  } catch {
    /* storage unavailable — history is session-only anyway */
  }
}

export interface UseTerminalOptions {
  data: TerminalData;
  /** Called by `exit`. */
  onClose?: () => void;
  /** Called after `goto` scrolls the page; defaults to `onClose`. */
  onScrollTo?: () => void;
}

/**
 * All terminal state + key handling, independent of rendering. One instance
 * per visible terminal (section and overlay each own their own screen but
 * share command history via sessionStorage).
 */
export function useTerminal({ data, onClose, onScrollTo }: UseTerminalOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [lines, setLines] = useState<TermLine[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const nextId = useRef(1);
  const historyRef = useRef<string[]>([]);
  const historyIdx = useRef<number | null>(null); // null = editing a fresh line
  const draftRef = useRef("");
  const typingAbort = useRef(false);

  useEffect(() => {
    historyRef.current = loadHistory();
  }, []);

  const push = useCallback((out: OutLine[]) => {
    if (out.length === 0) return;
    setLines((prev) => [
      ...prev,
      ...out.map((l) => ({ ...l, id: nextId.current++ }) as TermLine),
    ]);
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const actions = useMemo<CommandActions>(
    () => ({
      clear,
      navigate: (href) => router.push(href),
      scrollTo: (id) => {
        if (pathname !== "/") {
          router.push(`/#${id}`);
          return;
        }
        document.getElementById(id)?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
        (onScrollTo ?? onClose)?.();
      },
      openExternal: (url) => window.open(url, "_blank", "noopener,noreferrer"),
      setTheme,
      theme,
      close: onClose,
    }),
    [clear, router, pathname, setTheme, theme, onClose, onScrollTo],
  );

  /** Execute a raw line. `echo: false` runs it silently (used for the banner). */
  const run = useCallback(
    async (raw: string, { echo = true }: { echo?: boolean } = {}) => {
      const trimmed = raw.trim();
      if (echo) push([{ kind: "input", text: raw }]);
      if (!trimmed) return;

      if (echo) {
        const h = historyRef.current;
        if (h[h.length - 1] !== trimmed) {
          historyRef.current = [...h, trimmed].slice(-HISTORY_MAX);
          saveHistory(historyRef.current);
        }
      }
      historyIdx.current = null;
      draftRef.current = "";

      setBusy(true);
      try {
        const out = await execute(trimmed, tokenize(trimmed), {
          data,
          history: historyRef.current,
          actions,
        });
        push(out);
      } finally {
        setBusy(false);
      }
    },
    [actions, data, push],
  );

  const submit = useCallback(() => {
    const value = input;
    setInput("");
    void run(value);
  }, [input, run]);

  const recall = useCallback(
    (direction: -1 | 1) => {
      const h = historyRef.current;
      if (h.length === 0) return;
      if (historyIdx.current === null) {
        if (direction === 1) return;
        draftRef.current = input;
        historyIdx.current = h.length - 1;
      } else {
        const next = historyIdx.current + direction;
        if (next < 0) return;
        if (next >= h.length) {
          historyIdx.current = null;
          setInput(draftRef.current);
          return;
        }
        historyIdx.current = next;
      }
      setInput(h[historyIdx.current]);
    },
    [input],
  );

  const tabComplete = useCallback(() => {
    const candidates = complete(input, COMMANDS, data);
    if (candidates.length === 0) return;
    if (candidates.length === 1) {
      const only = candidates[0];
      // Completing a bare command name that takes args → add a trailing space.
      const isCommandOnly = !only.includes(" ");
      const takesArgs = isCommandOnly && !!resolve(only, COMMANDS)?.usage;
      setInput(takesArgs ? `${only} ` : only);
      return;
    }
    const prefix = commonPrefix(candidates);
    if (prefix.length > input.length) {
      setInput(prefix);
      return;
    }
    // Ambiguous: echo the line and list the options, shell-style.
    push([
      { kind: "input", text: input },
      line(...candidates.map((c, i) => t((i ? "  " : "") + c.split(" ").pop()!, "cyan"))),
    ]);
  }, [input, data, push]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      typingAbort.current = true; // any real keypress cancels an auto-typed boot
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        recall(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        recall(1);
      } else if (e.key === "Tab") {
        e.preventDefault();
        tabComplete();
      } else if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        clear();
      } else if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
        if (window.getSelection()?.toString()) return; // let copy work
        e.preventDefault();
        push([{ kind: "input", text: `${input}^C` }]);
        setInput("");
        historyIdx.current = null;
      }
    },
    [submit, recall, tabComplete, clear, push, input],
  );

  /**
   * Type a command character by character, then run it. Used for the boot
   * demo. Bails out instantly (running the command at once) under reduced
   * motion, and stops if the user starts typing themselves.
   */
  const typeCommand = useCallback(
    async (cmd: string) => {
      typingAbort.current = false;
      if (!prefersReducedMotion()) {
        for (let i = 1; i <= cmd.length; i++) {
          if (typingAbort.current) break; // user took over → flush immediately
          setInput(cmd.slice(0, i));
          await new Promise((r) => setTimeout(r, TYPE_SPEED + Math.random() * 40));
        }
        if (!typingAbort.current) await new Promise((r) => setTimeout(r, 260));
      }
      setInput("");
      await run(cmd);
    },
    [run],
  );

  return {
    lines,
    input,
    setInput,
    busy,
    run,
    clear,
    onKeyDown,
    typeCommand,
    /** Mark the auto-typed boot as interrupted (e.g. on focus/click). */
    interrupt: () => {
      typingAbort.current = true;
    },
  };
}

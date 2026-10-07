"use client";

import Link from "next/link";
import { m } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion/variants";
import type { Span, TermLine, Tone } from "@/lib/terminal/types";

const TONE: Record<Tone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  prompt: "text-term-prompt",
  green: "text-term-green",
  yellow: "text-term-yellow",
  cyan: "text-term-cyan",
  magenta: "text-term-magenta",
  red: "text-term-red",
};

/** The `➜ ~` prompt shown before every input line. */
export function Prompt() {
  return (
    <span className="select-none whitespace-pre" aria-hidden="true">
      <span className="font-bold text-term-prompt">➜</span>
      <span className="text-term-cyan"> ~ </span>
    </span>
  );
}

function SpanView({ span }: { span: Span }) {
  const className = cn(
    TONE[span.tone ?? "default"],
    span.bold && "font-semibold",
    span.href && "underline decoration-current/40 underline-offset-4 transition-colors hover:decoration-current",
  );

  if (!span.href) return <span className={className}>{span.text}</span>;

  const internal = span.href.startsWith("/");
  if (internal) {
    return (
      <Link href={span.href} className={className}>
        {span.text}
      </Link>
    );
  }
  const newTab = /^https?:\/\//.test(span.href);
  return (
    <a
      href={span.href}
      className={className}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      {span.text}
    </a>
  );
}

function LineView({ line }: { line: TermLine }) {
  if (line.kind === "blank") return <div aria-hidden="true">&nbsp;</div>;

  if (line.kind === "input") {
    return (
      <div className="whitespace-pre-wrap break-words">
        <Prompt />
        <span className="font-semibold text-foreground">{line.text}</span>
      </div>
    );
  }

  return (
    <div
      className="whitespace-pre-wrap break-words"
      style={line.indent ? { paddingLeft: `${line.indent * 2}ch` } : undefined}
    >
      {line.spans.map((span, i) => (
        <SpanView key={i} span={span} />
      ))}
    </div>
  );
}

/**
 * Renders the scrollback. Each new line fades/slides in briefly; the global
 * MotionConfig collapses this for reduced-motion users. `role="log"` +
 * polite live region so screen readers announce command output.
 */
export function TerminalOutput({ lines }: { lines: TermLine[] }) {
  return (
    <div role="log" aria-live="polite" aria-relevant="additions">
      {lines.map((line) => (
        <m.div
          key={line.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: EASE }}
        >
          <LineView line={line} />
        </m.div>
      ))}
    </div>
  );
}

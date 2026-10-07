import type { OutLine, Span, Tone } from "./types";

/** Span helpers — keep command output terse and readable. */
export const t = (text: string, tone?: Tone, bold = false): Span => ({ text, tone, bold });
export const b = (text: string, tone?: Tone): Span => ({ text, tone, bold: true });
export const link = (text: string, href: string, tone: Tone = "cyan"): Span => ({
  text,
  href,
  tone,
});

/** One output row from spans (or a plain string). */
export function line(...spans: (Span | string)[]): OutLine {
  return {
    kind: "out",
    spans: spans.map((s) => (typeof s === "string" ? { text: s } : s)),
  };
}

/** An indented output row (each level ≈ 2ch). */
export function indent(level: number, ...spans: (Span | string)[]): OutLine {
  const l = line(...spans);
  return l.kind === "out" ? { ...l, indent: level } : l;
}

/** `label   value` — label in muted, padded to a fixed column. */
export function kv(label: string, value: Span | string, width = 11): OutLine {
  return line(
    t(label.padEnd(width), "muted"),
    typeof value === "string" ? { text: value } : value,
  );
}

export const blank = (): OutLine => ({ kind: "blank" });

export const error = (text: string): OutLine => line(t(text, "red"));

/** Comma-joined list where each item gets the same tone. */
export function joined(items: string[], tone: Tone = "default", sep = ", "): Span[] {
  return items.flatMap((item, i) =>
    i === 0 ? [t(item, tone)] : [t(sep, "muted"), t(item, tone)],
  );
}

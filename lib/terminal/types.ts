import type { Experience, SocialLink } from "@/types";

/** Semantic color channel for a span. Maps to the `--term-*` CSS tokens. */
export type Tone =
  | "default"
  | "muted"
  | "prompt"
  | "green"
  | "yellow"
  | "cyan"
  | "magenta"
  | "red";

/** An inline run of text with optional color, weight, and link target. */
export interface Span {
  text: string;
  tone?: Tone;
  bold?: boolean;
  /** Renders the span as a link. Internal paths use next/link; URLs open in a new tab. */
  href?: string;
}

/** A single rendered row of terminal output, before it gets an id. */
export type OutLine =
  | { kind: "input"; text: string }
  | { kind: "out"; spans: Span[]; indent?: number }
  | { kind: "blank" };

/** A row in state: same as `OutLine` with a stable key for rendering. */
export type TermLine = OutLine & { id: number };

/** Minimal project shape the terminal needs — no case-study components. */
export interface TerminalProject {
  slug: string;
  title: string;
  summary: string;
  year: number;
  role: string;
  tags: string[];
  stack: string[];
  featured?: boolean;
  links?: { live?: string; repo?: string };
}

/**
 * Everything the command set reads. Built on the server from the content
 * layer (see `lib/terminal/data.ts`) and passed to the client as props, so
 * the terminal bundle never imports the project case-study components.
 */
export interface TerminalData {
  profile: {
    name: string;
    title: string;
    tagline: string;
    bio: string;
    location: string;
    email: string;
    phone: string;
  };
  site: {
    url: string;
    resumeUrl: string;
    github: string;
    linkedin: string;
  };
  socials: SocialLink[];
  skills: { category: string; items: string[] }[];
  projects: TerminalProject[];
  experience: Experience[];
  /** Home-page section ids, for `goto` + autocomplete. */
  sections: string[];
}

/** Side effects a command may request. Implemented by the terminal hook. */
export interface CommandActions {
  clear(): void;
  /** Push an internal route (e.g. `/projects/zycart`). */
  navigate(href: string): void;
  /** Smooth-scroll to a home-page section by id, navigating home first if needed. */
  scrollTo(id: string): void;
  /** Open an external URL in a new tab. */
  openExternal(url: string): void;
  setTheme(theme: "light" | "dark" | "system"): void;
  /** Current theme selection, if known. */
  theme?: string;
  /** Close the host (only meaningful for the overlay). */
  close?: () => void;
}

export interface CommandContext {
  data: TerminalData;
  args: string[];
  raw: string;
  history: string[];
  actions: CommandActions;
  commands: Command[];
}

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  /** Argument hint shown in `help`, e.g. `"<slug>"`. */
  usage?: string;
  /** Omitted from `help` (easter eggs). */
  hidden?: boolean;
  run(ctx: CommandContext): OutLine[] | Promise<OutLine[]>;
}

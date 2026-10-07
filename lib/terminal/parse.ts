import type { Command, TerminalData } from "./types";

/** Split a raw line into tokens, honouring "double" and 'single' quotes. */
export function tokenize(raw: string): string[] {
  const out: string[] = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

/** Find a command by name or alias (case-insensitive). */
export function resolve(name: string, commands: Command[]): Command | undefined {
  const n = name.toLowerCase();
  return commands.find((c) => c.name === n || c.aliases?.includes(n));
}

/** Pseudo-filesystem exposed by `ls` / `cat`. */
export const FILES: Record<string, string> = {
  "about.md": "whoami",
  "skills.json": "skills",
  "projects/": "projects",
  "experience.md": "experience",
  "contact.md": "contact",
  "resume.pdf": "resume",
};

/**
 * Tab-completion. Returns every candidate that extends the current input;
 * the caller decides whether to apply (single match) or list (many).
 */
export function complete(input: string, commands: Command[], data: TerminalData): string[] {
  const tokens = tokenize(input);
  const trailingSpace = /\s$/.test(input);

  // Completing the command name itself.
  if (tokens.length === 0 || (tokens.length === 1 && !trailingSpace)) {
    const prefix = (tokens[0] ?? "").toLowerCase();
    return commands
      .filter((c) => !c.hidden && c.name.startsWith(prefix))
      .map((c) => c.name);
  }

  // Completing an argument for a known command.
  const cmd = resolve(tokens[0], commands);
  if (!cmd) return [];
  const partial = trailingSpace ? "" : (tokens[tokens.length - 1] ?? "");
  const head = trailingSpace ? tokens : tokens.slice(0, -1);
  const prefix = partial.toLowerCase();

  let pool: string[] = [];
  switch (cmd.name) {
    case "open":
      pool = data.projects.map((p) => p.slug);
      break;
    case "goto":
      pool = data.sections;
      break;
    case "skills":
      pool = data.skills.map((g) => g.category.toLowerCase());
      break;
    case "theme":
      pool = ["light", "dark", "system"];
      break;
    case "cat":
      pool = Object.keys(FILES);
      break;
    case "projects":
      pool = ["--featured"];
      break;
    case "help":
      pool = commands.filter((c) => !c.hidden).map((c) => c.name);
      break;
    default:
      return [];
  }
  return pool
    .filter((p) => p.toLowerCase().startsWith(prefix))
    .map((p) => [...head, p].join(" "));
}

/** Longest common prefix — used to partially complete when several match. */
export function commonPrefix(items: string[]): string {
  if (items.length === 0) return "";
  let prefix = items[0];
  for (const item of items.slice(1)) {
    while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1);
    if (!prefix) break;
  }
  return prefix;
}

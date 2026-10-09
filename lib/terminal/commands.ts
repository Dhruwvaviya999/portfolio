import { FILES, resolve } from "./parse";
import { b, blank, error, indent, joined, kv, line, link, t } from "./format";
import type { Command, CommandContext, OutLine, Span, TerminalProject } from "./types";

/** "2025-07-28" | "2025-07" -> "Jul 2025". Deterministic (no locale surprises). */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function month(iso: string): string {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1] ?? "?"} ${y}`;
}

function projectLines(p: TerminalProject, verbose = false): OutLine[] {
  const head = line(
    link(p.slug, `/projects/${p.slug}`),
    t("  "),
    t(String(p.year), "yellow"),
    t("  "),
    t(p.title, "default", true),
    ...(p.featured ? [t("  ★", "yellow")] : []),
  );
  if (!verbose) return [head];
  const links: Span[] = [];
  if (p.links?.live) links.push(link("live", p.links.live, "green"));
  if (p.links?.live && p.links?.repo) links.push(t("  "));
  if (p.links?.repo) links.push(link("repo", p.links.repo, "green"));
  return [
    head,
    indent(1, t(p.summary, "muted")),
    indent(1, t("role   ", "muted"), t(p.role)),
    indent(1, t("stack  ", "muted"), ...joined(p.stack, "cyan")),
    indent(1, t("tags   ", "muted"), ...joined(p.tags, "magenta")),
    ...(links.length ? [indent(1, t("links  ", "muted"), ...links)] : []),
  ];
}

const help: Command = {
  name: "help",
  aliases: ["?", "commands"],
  usage: "[command]",
  description: "List commands, or explain one.",
  run({ args, commands }) {
    if (args[0]) {
      const cmd = resolve(args[0], commands);
      if (!cmd) return [error(`help: no such command: ${args[0]}`)];
      return [
        line(b(cmd.name, "green"), t(cmd.usage ? ` ${cmd.usage}` : "", "magenta")),
        indent(1, t(cmd.description, "muted")),
        ...(cmd.aliases?.length
          ? [indent(1, t("aliases: ", "muted"), ...joined(cmd.aliases, "cyan"))]
          : []),
      ];
    }
    const visible = commands.filter((c) => !c.hidden);
    const label = (c: Command) => c.name + (c.usage ? ` ${c.usage}` : "");
    const width = Math.max(...visible.map((c) => label(c).length));
    return [
      line(t("Available commands", "muted")),
      ...visible.map((c) =>
        line(
          b(c.name, "green"),
          t(c.usage ? ` ${c.usage}` : "", "magenta"),
          t(" ".repeat(width - label(c).length + 2)),
          t(c.description, "muted"),
        ),
      ),
      blank(),
      line(
        t("Tip: ", "muted"),
        t("Tab", "yellow"),
        t(" completes, ", "muted"),
        t("↑/↓", "yellow"),
        t(" recalls history, ", "muted"),
        t("Ctrl+L", "yellow"),
        t(" clears.", "muted"),
      ),
    ];
  },
};

const whoami: Command = {
  name: "whoami",
  aliases: ["about", "me"],
  description: "Who I am, in a few lines.",
  run({ data }) {
    const { profile } = data;
    return [
      line(b(profile.name, "cyan"), t(" — ", "muted"), t(profile.title, "yellow")),
      line(t(profile.tagline, "muted")),
      blank(),
      line(t(profile.bio)),
      blank(),
      kv("location", profile.location),
      kv("email", link(profile.email, `mailto:${profile.email}`)),
      kv("status", t("● open to new opportunities", "green")),
    ];
  },
};

const skills: Command = {
  name: "skills",
  aliases: ["stack"],
  usage: "[category]",
  description: "Tools I work with, grouped by category.",
  run({ data, args }) {
    const filter = args[0]?.toLowerCase();
    const groups = filter
      ? data.skills.filter((g) => g.category.toLowerCase() === filter)
      : data.skills;
    if (groups.length === 0) {
      return [
        error(`skills: unknown category "${args[0]}"`),
        line(
          t("try: ", "muted"),
          ...joined(
            data.skills.map((g) => g.category.toLowerCase()),
            "cyan",
          ),
        ),
      ];
    }
    return groups.flatMap((g, i) => [
      ...(i > 0 ? [blank()] : []),
      line(b(g.category.toLowerCase(), "magenta"), t("/", "muted")),
      indent(1, ...joined(g.items, "cyan", "  ")),
    ]);
  },
};

const projects: Command = {
  name: "projects",
  aliases: ["work"],
  usage: "[--featured]",
  description: "Things I have built. Use open <slug> for the case study.",
  run({ data, args }) {
    const featuredOnly = args.includes("--featured") || args.includes("-f");
    const list = featuredOnly ? data.projects.filter((p) => p.featured) : data.projects;
    return [
      line(
        t(`${list.length} project${list.length === 1 ? "" : "s"}`, "muted"),
        t(featuredOnly ? "  (featured)" : "", "muted"),
      ),
      blank(),
      ...list.flatMap((p) => projectLines(p)),
      blank(),
      line(
        t("open <slug> ", "yellow"),
        t("for details · ", "muted"),
        t("★", "yellow"),
        t(" featured", "muted"),
      ),
    ];
  },
};

const open: Command = {
  name: "open",
  aliases: ["show", "view"],
  usage: "<slug>",
  description: "Show a project and jump to its case study.",
  run({ data, args, actions }) {
    if (!args[0]) {
      return [error("open: missing project slug"), line(t("try: ", "muted"), t("projects", "yellow"))];
    }
    const slug = args[0].toLowerCase();
    const p = data.projects.find((x) => x.slug === slug);
    if (!p) {
      const near = data.projects.filter(
        (x) => x.slug.includes(slug) || x.title.toLowerCase().includes(slug),
      );
      return [
        error(`open: no project named "${args[0]}"`),
        ...(near.length
          ? [line(t("did you mean: ", "muted"), ...joined(near.map((x) => x.slug), "cyan"))]
          : []),
      ];
    }
    setTimeout(() => actions.navigate(`/projects/${p.slug}`), 650);
    return [...projectLines(p, true), blank(), line(t("→ opening case study…", "green"))];
  },
};

const experience: Command = {
  name: "experience",
  aliases: ["exp", "jobs"],
  description: "Where I have worked.",
  run({ data }) {
    return data.experience.flatMap((job, i) => [
      ...(i > 0 ? [blank()] : []),
      line(
        b(job.role, "cyan"),
        t(" @ ", "muted"),
        job.url ? link(job.company, job.url, "default") : t(job.company),
      ),
      indent(
        1,
        t(month(job.start), "yellow"),
        t(" → ", "muted"),
        job.end ? t(month(job.end), "yellow") : t("Present", "green"),
      ),
      indent(1, t(job.summary, "muted")),
      ...job.highlights.map((h) => indent(1, t("· ", "prompt"), t(h))),
    ]);
  },
};

const stripProto = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "");

const contact: Command = {
  name: "contact",
  aliases: ["socials", "links"],
  description: "How to reach me.",
  run({ data }) {
    const { profile, site, socials } = data;
    return [
      kv("email", link(profile.email, `mailto:${profile.email}`)),
      kv("phone", link(profile.phone, `tel:${profile.phone.replace(/\s+/g, "")}`)),
      kv("github", link(stripProto(site.github), site.github)),
      kv("linkedin", link(stripProto(site.linkedin), site.linkedin)),
      ...socials
        .filter((s) => !["github", "linkedin", "mail"].includes(s.icon))
        .map((s) => kv(s.label.toLowerCase(), link(stripProto(s.href), s.href))),
      blank(),
      line(t("or ", "muted"), t("goto contact", "yellow"), t(" for the form.", "muted")),
    ];
  },
};

const resume: Command = {
  name: "resume",
  aliases: ["cv"],
  description: "Open my resume (PDF) in a new tab.",
  run({ data, actions }) {
    actions.openExternal(data.site.resumeUrl);
    return [line(t("→ opening ", "green"), link("resume.pdf", data.site.resumeUrl))];
  },
};

const goto: Command = {
  name: "goto",
  aliases: ["cd", "jump"],
  usage: "<section>",
  description: "Scroll to a section of this page.",
  run({ data, args, actions }) {
    const target = args[0]?.toLowerCase().replace(/^#/, "").replace(/\/$/, "");
    if (!target || target === "~" || target === "/") {
      actions.scrollTo("hero");
      return [line(t("→ top", "green"))];
    }
    if (target === "..") return [line(t("already at ~", "muted"))];
    if (!data.sections.includes(target)) {
      return [
        error(`goto: no section "${args[0]}"`),
        line(t("sections: ", "muted"), ...joined(data.sections, "cyan")),
      ];
    }
    actions.scrollTo(target);
    return [line(t(`→ #${target}`, "green"))];
  },
};

const theme: Command = {
  name: "theme",
  usage: "[light|dark|system]",
  description: "Switch the site theme.",
  run({ args, actions }) {
    const want = args[0]?.toLowerCase();
    if (!want) {
      return [
        kv("theme", t(actions.theme ?? "system", "cyan")),
        line(t("usage: theme light|dark|system", "muted")),
      ];
    }
    if (want !== "light" && want !== "dark" && want !== "system") {
      return [error(`theme: expected light, dark or system (got "${args[0]}")`)];
    }
    actions.setTheme(want);
    return [line(t("✓ theme → ", "green"), t(want, "cyan"))];
  },
};

const clear: Command = {
  name: "clear",
  aliases: ["cls"],
  description: "Clear the screen.",
  run({ actions }) {
    actions.clear();
    return [];
  },
};

const history: Command = {
  name: "history",
  description: "Commands you have run this session.",
  run({ history }) {
    if (history.length === 0) return [line(t("(empty)", "muted"))];
    return history.map((h, i) => line(t(String(i + 1).padStart(4), "muted"), t("  "), t(h)));
  },
};

const echo: Command = {
  name: "echo",
  usage: "<text>",
  description: "Print text back.",
  run({ args }) {
    return [line(t(args.join(" ")))];
  },
};

const ls: Command = {
  name: "ls",
  aliases: ["dir"],
  description: "List what is here.",
  run() {
    return [
      line(
        ...Object.keys(FILES).flatMap((f, i) => {
          const dir = f.endsWith("/");
          const tone = dir ? "cyan" : f.endsWith(".pdf") ? "magenta" : "default";
          return [...(i > 0 ? [t("  ")] : []), t(f, tone, dir)];
        }),
      ),
    ];
  },
};

const cat: Command = {
  name: "cat",
  usage: "<file>",
  description: "Print a file from ls.",
  async run(ctx) {
    const file = ctx.args[0];
    if (!file) return [error("cat: missing file")];
    const cmdName = FILES[file] ?? FILES[`${file}/`];
    if (!cmdName) return [error(`cat: ${file}: No such file or directory`)];
    const cmd = resolve(cmdName, ctx.commands);
    return cmd ? cmd.run({ ...ctx, args: [] }) : [];
  },
};

const pwd: Command = {
  name: "pwd",
  hidden: true,
  description: "Print working directory.",
  run({ data }) {
    const first = data.profile.name.split(" ")[0].toLowerCase();
    return [line(t(`/home/${first}/portfolio`, "cyan"))];
  },
};

const date: Command = {
  name: "date",
  hidden: true,
  description: "Current date.",
  run() {
    return [line(t(new Date().toString()))];
  },
};

const ROBOT = [
  "   ╭─────╮   ",
  "   │ ◉ ◉ │   ",
  "   │  ▬  │   ",
  "   ╰──┬──╯   ",
  " ╭────┴────╮ ",
  " │ ▪  ▪  ▪ │ ",
  " ╰─┬─────┬─╯ ",
  "   ╵     ╵   ",
];

const neofetch: Command = {
  name: "neofetch",
  aliases: ["fetch"],
  description: "System info, portfolio edition.",
  run({ data }) {
    const first = data.profile.name.split(" ")[0].toLowerCase();
    const since = data.experience[data.experience.length - 1]?.start;
    const months = since
      ? Math.max(1, Math.round((Date.now() - new Date(since).getTime()) / (1000 * 60 * 60 * 24 * 30.4)))
      : 0;
    const uptime = months >= 12 ? `${Math.floor(months / 12)}y ${months % 12}m` : `${months}m`;
    const skillCount = new Set(data.skills.flatMap((g) => g.items)).size;
    const host = `${first}@portfolio`;
    const info: [string, Span][] = [
      ["", b(host, "cyan")],
      ["", t("─".repeat(host.length), "muted")],
      ["OS", t("Next.js 15 · React 19 · TypeScript")],
      ["Role", t(data.profile.title)],
      ["Uptime", t(uptime, "yellow")],
      ["Packages", t(`${skillCount} skills, ${data.projects.length} projects`)],
      ["Shell", t("portfolio-sh 1.0")],
      ["Theme", t("neutral · brand indigo", "magenta")],
      ["Location", t(data.profile.location)],
    ];
    const rows = Math.max(ROBOT.length, info.length);
    return Array.from({ length: rows }, (_, i) => {
      const art = ROBOT[i] ?? " ".repeat(ROBOT[0].length);
      const entry = info[i];
      const rest: Span[] = entry ? (entry[0] ? [b(`${entry[0]}: `, "prompt"), entry[1]] : [entry[1]]) : [];
      return line(t(art, "cyan"), t("  "), ...rest);
    });
  },
};

const sudo: Command = {
  name: "sudo",
  hidden: true,
  description: "Nice try.",
  run() {
    return [
      line(t("[sudo] password for guest: ", "muted"), t("********", "muted")),
      error("guest is not in the sudoers file. This incident will be reported."),
    ];
  },
};

const exit: Command = {
  name: "exit",
  aliases: ["quit", "q"],
  hidden: true,
  description: "Close the terminal.",
  run({ actions }) {
    if (actions.close) {
      const close = actions.close;
      setTimeout(() => close(), 250);
      return [line(t("logout", "muted"))];
    }
    return [
      line(
        t("Nothing to exit — this terminal lives on the page. Try ", "muted"),
        t("clear", "yellow"),
        t(".", "muted"),
      ),
    ];
  },
};

const banner: Command = {
  name: "banner",
  hidden: true,
  description: "Welcome text.",
  run({ data }) {
    return [
      line(t("Welcome to ", "muted"), b(`${data.profile.name}'s`, "cyan"), t(" portfolio shell.", "muted")),
      line(t("Type ", "muted"), t("help", "yellow"), t(" to see what you can do.", "muted")),
    ];
  },
};

export const COMMANDS: Command[] = [
  help,
  whoami,
  skills,
  projects,
  open,
  experience,
  contact,
  resume,
  goto,
  theme,
  ls,
  cat,
  echo,
  history,
  clear,
  neofetch,
  // hidden
  pwd,
  date,
  sudo,
  exit,
  banner,
];

/** Run one tokenized line against the registry. Never throws; unknown → error line. */
export async function execute(
  raw: string,
  tokens: string[],
  base: Omit<CommandContext, "args" | "raw" | "commands">,
): Promise<OutLine[]> {
  const [name, ...args] = tokens;
  if (!name) return [];
  const cmd = resolve(name, COMMANDS);
  if (!cmd) {
    return [
      error(`command not found: ${name}`),
      line(t("Type ", "muted"), t("help", "yellow"), t(" for a list of commands.", "muted")),
    ];
  }
  try {
    return await cmd.run({ ...base, args, raw, commands: COMMANDS });
  } catch (err) {
    return [error(`${cmd.name}: ${err instanceof Error ? err.message : "failed"}`)];
  }
}

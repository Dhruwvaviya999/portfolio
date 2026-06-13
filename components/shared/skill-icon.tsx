import type { IconType } from "react-icons";
import {
  SiBootstrap,
  SiChakraui,
  SiCss,
  SiExpress,
  SiFirebase,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMui,
  SiMysql,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { FaCompass } from "react-icons/fa6";

import { cn } from "@/lib/utils";

/**
 * Brand-icon registry for the Skills section. Rendered in a server component,
 * so the SVGs ship as static HTML — zero client JS.
 *
 * `color` is the brand hex; entries without one (Next.js, Express, GitHub,
 * Vercel — black/white marks) fall back to `currentColor` so they adapt to the
 * light/dark theme.
 */
const ICONS: Record<string, { Icon: IconType; color?: string }> = {
  html: { Icon: SiHtml5, color: "#E34F26" },
  css: { Icon: SiCss, color: "#1572B6" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  react: { Icon: SiReact, color: "#61DAFB" },
  redux: { Icon: SiRedux, color: "#764ABC" },
  nextjs: { Icon: SiNextdotjs },
  tailwind: { Icon: SiTailwindcss, color: "#06B6D4" },
  mui: { Icon: SiMui, color: "#007FFF" },
  chakra: { Icon: SiChakraui, color: "#319795" },
  bootstrap: { Icon: SiBootstrap, color: "#7952B3" },
  nodejs: { Icon: SiNodedotjs, color: "#5FA04E" },
  express: { Icon: SiExpress },
  mysql: { Icon: SiMysql, color: "#4479A1" },
  mongodb: { Icon: SiMongodb, color: "#47A248" },
  firebase: { Icon: SiFirebase, color: "#FFCA28" },
  postgresql: { Icon: SiPostgresql, color: "#4169E1" },
  python: { Icon: SiPython, color: "#3776AB" },
  typescript: { Icon: SiTypescript, color: "#3178C6" },
  git: { Icon: SiGit, color: "#F05032" },
  github: { Icon: SiGithub },
  vscode: { Icon: VscVscode, color: "#0078D4" },
  postman: { Icon: SiPostman, color: "#FF6C37" },
  compass: { Icon: FaCompass, color: "#10AA50" },
  vercel: { Icon: SiVercel },
  netlify: { Icon: SiNetlify, color: "#00C7B7" },
};

export function SkillIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const entry = name ? ICONS[name] : undefined;
  if (!entry) return null;
  const { Icon, color } = entry;
  return (
    <Icon
      aria-hidden
      className={cn("size-5 shrink-0", color ? undefined : "text-foreground", className)}
      style={color ? { color } : undefined}
    />
  );
}

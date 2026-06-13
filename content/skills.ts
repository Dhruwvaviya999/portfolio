import type { SkillGroup } from "@/types";

/**
 * Skills, grouped by category. `icon` values are lucide-react icon names
 * resolved at render time; `level` is an optional 0–100 proficiency hint.
 *
 * NOTE: tune the list/levels to the real owner — this is a representative set.
 */
export const skills: SkillGroup[] = [
  {
    category: "Frontend",
    items: [
      { name: "React", icon: "atom", level: 95 },
      { name: "Next.js", icon: "triangle", level: 95 },
      { name: "TypeScript", icon: "file-code", level: 92 },
      { name: "Tailwind CSS", icon: "wind", level: 90 },
      { name: "Framer Motion", icon: "move", level: 80 },
    ],
  },
  {
    category: "3D & Graphics",
    items: [
      { name: "Three.js", icon: "box", level: 78 },
      { name: "React Three Fiber", icon: "boxes", level: 80 },
      { name: "GLSL / Shaders", icon: "sparkles", level: 65 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", icon: "server", level: 88 },
      { name: "PostgreSQL", icon: "database", level: 82 },
      { name: "Prisma", icon: "layers", level: 80 },
      { name: "tRPC", icon: "cable", level: 78 },
      { name: "GraphQL", icon: "share-2", level: 72 },
    ],
  },
  {
    category: "Tooling & DevOps",
    items: [
      { name: "Git", icon: "git-branch", level: 90 },
      { name: "Docker", icon: "container", level: 78 },
      { name: "Vercel", icon: "triangle", level: 88 },
      { name: "Vitest / Playwright", icon: "flask-conical", level: 80 },
    ],
  },
];

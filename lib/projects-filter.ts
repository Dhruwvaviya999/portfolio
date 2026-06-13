import type { Project } from "@/types";

/**
 * Client-safe project filtering. Kept separate from `lib/content/projects.ts`
 * (which is `server-only`, reads the filesystem) so the interactive index can
 * import it without pulling fs into the client bundle.
 */

export const PROJECT_CATEGORIES = [
  "All",
  "Frontend",
  "Full Stack",
  "Dashboard",
  "ERP",
  "Enterprise",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/** Normalize so "Full Stack" matches a "Full-Stack" tag. */
function normalize(value: string): string {
  return value.toLowerCase().replace(/[\s-]/g, "");
}

export function projectMatchesCategory(project: Project, category: string): boolean {
  if (category === "All") return true;
  const target = normalize(category);
  return project.tags.some((tag) => normalize(tag) === target);
}

/** Filter by category + a case-insensitive title/summary search. */
export function filterProjects(
  projects: Project[],
  category: string,
  query: string,
): Project[] {
  const q = query.trim().toLowerCase();
  return projects.filter(
    (project) =>
      projectMatchesCategory(project, category) &&
      (q === "" ||
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q)),
  );
}

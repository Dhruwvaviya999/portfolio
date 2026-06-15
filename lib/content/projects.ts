import type { ComponentType } from "react";
import type { Project } from "@/types";
import { type ProjectEntry, projectEntries } from "@/content/projects";

/**
 * Project content access. Projects are component-based: metadata lives in TS and
 * each case-study body is a React component (see `content/projects/`). No MDX,
 * no filesystem reads — everything is statically known at build time.
 */

/** Sort: featured first, then most recent year, then title. */
function byPriority(a: Project, b: Project): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.year !== b.year) return b.year - a.year;
  return a.title.localeCompare(b.title);
}

function sortedEntries(): ProjectEntry[] {
  return [...projectEntries].sort((a, b) => byPriority(a.meta, b.meta));
}

/** All project slugs. */
export function getProjectSlugs(): string[] {
  return projectEntries.map((entry) => entry.meta.slug);
}

/** Metadata for a single project, or `null` if it doesn't exist. */
export function getProjectMeta(slug: string): Project | null {
  return projectEntries.find((entry) => entry.meta.slug === slug)?.meta ?? null;
}

/** Metadata + case-study body component for a single project, or `null`. */
export function getProjectEntry(
  slug: string,
): { meta: Project; Body: ComponentType } | null {
  return projectEntries.find((entry) => entry.meta.slug === slug) ?? null;
}

/** All projects' metadata, sorted by priority. */
export function getAllProjects(): Project[] {
  return sortedEntries().map((entry) => entry.meta);
}

/** Featured projects only — used by the home page. */
export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured);
}

/**
 * Projects related to `slug`, ranked by shared-tag overlap (most first).
 * Falls back to other projects so the section is never empty.
 */
export function getRelatedProjects(slug: string, limit = 3): Project[] {
  const all = getAllProjects();
  const current = all.find((project) => project.slug === slug);
  if (!current) return [];

  return all
    .filter((project) => project.slug !== slug)
    .map((project) => ({
      project,
      score: project.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.project);
}

/** Previous/next project in display order, for detail-page navigation. */
export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const all = getAllProjects();
  const index = all.findIndex((project) => project.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}

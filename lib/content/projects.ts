import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Project, ProjectWithContent } from "@/types";

/**
 * Server-only project content loader.
 *
 * Projects are MDX files in `content/projects/`. Metadata lives in YAML
 * frontmatter; the case-study body is the MDX content (compiled at the page
 * level in Section 6). These utilities read frontmatter cheaply with
 * gray-matter — no MDX compilation — so listings and `generateStaticParams`
 * stay fast.
 */

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((item) => typeof item === "string");
}

/**
 * Narrows raw frontmatter to a typed `Project`, throwing a descriptive build
 * error if a required field is missing or malformed.
 */
function parseProject(slug: string, data: Record<string, unknown>): Project {
  const where = `content/projects/${slug}.mdx`;

  if (isString(data.slug) && data.slug !== slug) {
    throw new Error(
      `[content] frontmatter slug "${data.slug}" does not match filename "${slug}" in ${where}`,
    );
  }
  if (!isString(data.title)) throw new Error(`[content] missing "title" in ${where}`);
  if (!isString(data.summary)) throw new Error(`[content] missing "summary" in ${where}`);
  if (typeof data.year !== "number") throw new Error(`[content] missing numeric "year" in ${where}`);
  if (!isString(data.role)) throw new Error(`[content] missing "role" in ${where}`);
  if (!isStringArray(data.stack)) throw new Error(`[content] missing "stack" string[] in ${where}`);
  if (!isString(data.cover)) throw new Error(`[content] missing "cover" in ${where}`);

  const links =
    data.links && typeof data.links === "object"
      ? (data.links as Record<string, unknown>)
      : undefined;

  return {
    slug,
    title: data.title,
    summary: data.summary,
    year: data.year,
    role: data.role,
    stack: data.stack,
    tags: isStringArray(data.tags) ? data.tags : [],
    cover: data.cover,
    gallery: isStringArray(data.gallery) ? data.gallery : undefined,
    links: links
      ? {
          live: isString(links.live) ? links.live : undefined,
          repo: isString(links.repo) ? links.repo : undefined,
        }
      : undefined,
    featured: data.featured === true,
  };
}

/** Sort: featured first, then most recent year, then title. */
function byPriority(a: Project, b: Project): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.year !== b.year) return b.year - a.year;
  return a.title.localeCompare(b.title);
}

/** All project slugs (filenames without extension). */
export function getProjectSlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/** Validated metadata for a single project, or `null` if it doesn't exist. */
export function getProjectMeta(slug: string): Project | null {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const { data } = matter(fs.readFileSync(filePath, "utf8"));
  return parseProject(slug, data);
}

/** Validated metadata + raw MDX body for a single project, or `null`. */
export function getProject(slug: string): ProjectWithContent | null {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  return { meta: parseProject(slug, data), content };
}

/** All projects' metadata, sorted by priority. */
export function getAllProjects(): Project[] {
  return getProjectSlugs()
    .map((slug) => getProjectMeta(slug))
    .filter((p): p is Project => p !== null)
    .sort(byPriority);
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

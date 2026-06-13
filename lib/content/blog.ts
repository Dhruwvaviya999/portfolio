import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPost, BlogPostWithContent } from "@/types";

/**
 * Server-only blog content loader.
 *
 * Mirrors the project loader for `content/blog/`. No posts ship yet — these
 * utilities tolerate an empty/missing directory and are ready for when blog
 * content and routes are added. Drafts are excluded from production builds.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const isProd = process.env.NODE_ENV === "production";

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((item) => typeof item === "string");
}

function parsePost(slug: string, data: Record<string, unknown>): BlogPost {
  const where = `content/blog/${slug}.mdx`;

  if (!isString(data.title)) throw new Error(`[content] missing "title" in ${where}`);
  if (!isString(data.summary)) throw new Error(`[content] missing "summary" in ${where}`);
  if (!isString(data.publishedAt))
    throw new Error(`[content] missing "publishedAt" in ${where}`);

  return {
    slug,
    title: data.title,
    summary: data.summary,
    publishedAt: data.publishedAt,
    tags: isStringArray(data.tags) ? data.tags : [],
    cover: isString(data.cover) ? data.cover : undefined,
    draft: data.draft === true,
  };
}

/** Newest first. */
function byDateDesc(a: BlogPost, b: BlogPost): number {
  return b.publishedAt.localeCompare(a.publishedAt);
}

/** All post slugs (filenames without extension). */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/** Validated metadata for a single post, or `null` if it doesn't exist. */
export function getPostMeta(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const { data } = matter(fs.readFileSync(filePath, "utf8"));
  return parsePost(slug, data);
}

/** Validated metadata + raw MDX body for a single post, or `null`. */
export function getPost(slug: string): BlogPostWithContent | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  return { meta: parsePost(slug, data), content };
}

/** All published posts (drafts hidden in production), newest first. */
export function getAllPosts(): BlogPost[] {
  return getPostSlugs()
    .map((slug) => getPostMeta(slug))
    .filter((post): post is BlogPost => post !== null)
    .filter((post) => !isProd || !post.draft)
    .sort(byDateDesc);
}

/**
 * Shared application types.
 *
 * These are the single source of truth for content shapes consumed across
 * the site (data modules in `content/`, section components, and the
 * `/projects/[slug]` MDX pages added in later sections).
 */

/** A primary/secondary navigation entry. */
export interface NavItem {
  label: string;
  /** Absolute path, or `/#anchor` for an in-page section on the home route. */
  href: string;
  /** Opens in a new tab when true (used for off-site links). */
  external?: boolean;
}

/** A social / contact link. `icon` is a lucide-react icon name resolved at render time. */
export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

/** Outbound links for a project (both optional — a project may have neither). */
export interface ProjectLink {
  live?: string;
  repo?: string;
}

/**
 * Project metadata. The case-study body is authored in MDX (Section 6) and
 * rendered separately; this interface describes the frontmatter / card data.
 */
export interface Project {
  slug: string;
  title: string;
  summary: string;
  /** Release / completion year, e.g. 2025. */
  year: number;
  role: string;
  tags: string[];
  stack: string[];
  /** Path under /public, e.g. "/images/projects/foo.png". */
  cover: string;
  gallery?: string[];
  links?: ProjectLink;
  /** Surfaced on the home page when true. */
  featured?: boolean;
}

/**
 * The YAML frontmatter shape of a project MDX file. Identical to `Project`:
 * the loader validates frontmatter against this and trusts `slug` to match the
 * filename.
 */
export type ProjectFrontmatter = Project;

/** A project's validated metadata plus its raw (uncompiled) MDX body. */
export interface ProjectWithContent {
  meta: Project;
  /** Raw MDX source, compiled at the page level in Section 6. */
  content: string;
}

/** Blog post metadata (frontmatter). The case-study body is authored in MDX. */
export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  /** ISO date, e.g. "2025-02-14". */
  publishedAt: string;
  tags: string[];
  cover?: string;
  /** Excluded from listings/builds when true. */
  draft?: boolean;
}

/** A post's validated metadata plus its raw (uncompiled) MDX body. */
export interface BlogPostWithContent {
  meta: BlogPost;
  content: string;
}

/** A role in the work-history timeline. */
export interface Experience {
  company: string;
  role: string;
  /** ISO month, e.g. "2023-04". */
  start: string;
  /** ISO month, or `null` for "Present". */
  end: string | null;
  summary: string;
  highlights: string[];
  url?: string;
}

/** A single skill, optionally with an icon and a 0–100 proficiency. */
export interface Skill {
  name: string;
  icon?: string;
  level?: number;
  /** One-line explanation, surfaced in the skill detail dialog. */
  description?: string;
}

/** A named group of related skills (e.g. "Frontend", "Tooling"). */
export interface SkillGroup {
  category: string;
  items: Skill[];
}

/** Top-level profile / about data. */
export interface Profile {
  name: string;
  phone: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  socials: SocialLink[];
}

/** Theme selection exposed by next-themes. */
export type ThemeMode = "light" | "dark" | "system";

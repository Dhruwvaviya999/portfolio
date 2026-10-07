import "server-only";

import { profile } from "@/content/profile";
import { skills } from "@/content/skills";
import { experience } from "@/content/experience";
import { projectEntries } from "@/content/projects";
import { SECTION_IDS, socialLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import type { TerminalData } from "./types";

/**
 * Server-only snapshot of the content layer for the terminal. Strips the
 * project case-study components (and their imports) so the client bundle
 * only receives plain, serializable data.
 */
export function getTerminalData(): TerminalData {
  return {
    profile: {
      name: profile.name,
      title: profile.title,
      tagline: profile.tagline,
      bio: profile.bio,
      location: profile.location,
      email: profile.email,
      phone: profile.phone,
    },
    site: {
      url: siteConfig.url,
      resumeUrl: siteConfig.resumeUrl,
      github: siteConfig.links.github,
      linkedin: siteConfig.links.linkedin,
    },
    socials: socialLinks,
    skills: skills.map((g) => ({
      category: g.category,
      items: g.items.map((s) => s.name),
    })),
    projects: projectEntries.map(({ meta }) => ({
      slug: meta.slug,
      title: meta.title,
      summary: meta.summary,
      year: meta.year,
      role: meta.role,
      tags: meta.tags,
      stack: meta.stack,
      featured: meta.featured,
      links: meta.links,
    })),
    experience,
    sections: ["hero", ...SECTION_IDS],
  };
}

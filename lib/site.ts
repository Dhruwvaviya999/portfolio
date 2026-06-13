/**
 * Global site configuration — the single source of truth for branding,
 * canonical URL, and metadata. Consumed by the root layout (metadataBase +
 * Metadata) and the navigation config.
 *
 * NOTE: values marked `TODO` are placeholders — fill these in with the real
 * owner details before going live.
 */

// Set NEXT_PUBLIC_SITE_URL in the deployment env; falls back for local dev.
const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"; // TODO: real domain

export const siteConfig = {
  name: "Your Name", // TODO
  /** Used as the default <title> and the suffix in the title template. */
  title: "Your Name — Software Engineer & Creative Developer", // TODO
  description:
    "Portfolio of a software engineer building fast, polished web experiences with Next.js, TypeScript, and 3D on the web.", // TODO
  url,
  /** Dynamic OG image route is generated in Section 7. */
  ogImage: `${url}/opengraph-image`,
  author: {
    name: "Your Name", // TODO
    email: "owner@shubhamtanks.com",
    twitter: "@yourhandle", // TODO
  },
  keywords: [
    "portfolio",
    "software engineer",
    "frontend developer",
    "Next.js",
    "React",
    "TypeScript",
    "Three.js",
    "WebGL",
  ],
  links: {
    github: "https://github.com/yourhandle", // TODO
    linkedin: "https://linkedin.com/in/yourhandle", // TODO
    twitter: "https://twitter.com/yourhandle", // TODO
    email: "owner@shubhamtanks.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;

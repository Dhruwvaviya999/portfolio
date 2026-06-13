/**
 * Global site configuration — the single source of truth for branding,
 * canonical URL, and metadata. Consumed by the root layout (metadataBase +
 * Metadata) and the navigation config.
 *
 * NOTE: values marked `TODO` are placeholders — fill these in with the real
 * owner details before going live.
 */

// Set NEXT_PUBLIC_SITE_URL in the deployment env; falls back for local dev.
const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const siteConfig = {
  name: "Dhruw Vaviya",
  title: "Software Developer",
  description:
    "Portfolio of a software engineer building fast, polished web experiences with Next.js, TypeScript, and 3D on the web.", // TODO
  url,
  /** Dynamic OG image route is generated in Section 7. */
  ogImage: `${url}/opengraph-image`,
  /** Linked from the navbar Resume button. */
  resumeUrl: "/resume.pdf", // TODO: drop a resume PDF in /public
  author: {
    name: "Dhruw Vaviya",
    email: "dhruwvaviya123@gmail.com",
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
    github: "https://github.com/dhruwvaviya999",
    linkedin: "https://linkedin.com/in/dhruwvaviya",
    twitter: "https://twitter.com/yourhandle", // TODO
    email: "dhruwvaviya123@gmail.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;

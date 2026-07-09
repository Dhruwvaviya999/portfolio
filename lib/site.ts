const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const siteConfig = {
  name: "Dhruw Vaviya",
  title: "Software Developer",
  description:
    "Portfolio of a software engineer building fast, polished web experiences with Next.js, TypeScript, and 3D on the web.",
  url,
  /** Dynamic OG image route is generated in Section 7. */
  ogImage: `${url}/opengraph-image`,
  /** Linked from the navbar Resume button. */
  resumeUrl: "/resume.pdf",
  author: {
    name: "Dhruw Vaviya",
    email: "dhruwvaviya123@gmail.com",
    twitter: "@yourhandle",
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
    twitter: "https://twitter.com/yourhandle",
    email: "dhruwvaviya123@gmail.com",
    phone: "+91 8591608791",
  },
} as const;

export type SiteConfig = typeof siteConfig;

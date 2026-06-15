import type { Experience } from "@/types";

/**
 * Work-history timeline, most recent first. `end: null` renders as "Present".
 * Dates are ISO months ("YYYY-MM").
 *
 * NOTE: placeholder roles — replace with the real history before launch.
 */
export const experience: Experience[] = [
  {
    company: "Shubham Tanks and Liners",
    role: "Full-Stack Developer",
    start: "2026-01",
    end: null,
    summary:
      "Lead the web platform team building real-time collaboration tooling used by thousands of teams.",
    highlights: [
      "Architected a real-time multiplayer canvas with WebSockets and optimistic updates.",
      "Cut initial load time by 45% through code-splitting, RSC adoption, and image optimization.",
      "Established the design-system and component library now used across all products.",
    ],
    url: "https://example.com", // TODO
  },
  {
    company: "Shubham Tanks and Liners", // TODO
    role: "DWA Intern",
    start: "2025-07",
    end: "2026-01",
    summary:
      "Built and scaled the modules of an enterprise resource planning platform for mid-market manufacturers.",
    highlights: [
      "Delivered inventory, procurement, and reporting modules end-to-end with Next.js and PostgreSQL.",
      "Introduced typed APIs (tRPC) that eliminated a class of integration bugs.",
      "Mentored two junior engineers and ran the team's code-review process.",
    ],
    url: "https://example.com", // TODO
  },
];

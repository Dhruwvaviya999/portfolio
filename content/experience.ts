import type { Experience } from "@/types";

/**
 * Work-history timeline, most recent first. `end: null` renders as "Present".
 * Dates are ISO months ("YYYY-MM").
 *
 * NOTE: placeholder roles — replace with the real history before launch.
 */
export const experience: Experience[] = [
  {
    company: "Nexus Labs", // TODO
    role: "Senior Frontend Engineer",
    start: "2023-04",
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
    company: "Acme ERP", // TODO
    role: "Full-Stack Engineer",
    start: "2021-01",
    end: "2023-03",
    summary:
      "Built and scaled the modules of an enterprise resource planning platform for mid-market manufacturers.",
    highlights: [
      "Delivered inventory, procurement, and reporting modules end-to-end with Next.js and PostgreSQL.",
      "Introduced typed APIs (tRPC) that eliminated a class of integration bugs.",
      "Mentored two junior engineers and ran the team's code-review process.",
    ],
    url: "https://example.com", // TODO
  },
  {
    company: "Freelance", // TODO
    role: "Web Developer",
    start: "2019-06",
    end: "2020-12",
    summary:
      "Designed and shipped marketing sites and web apps for early-stage startups and small businesses.",
    highlights: [
      "Shipped 10+ production sites with a focus on performance and accessibility.",
      "Worked directly with founders to translate product ideas into polished UIs.",
    ],
  },
];

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
    role: "Full Stack Developer",
    start: "2026-01-28",
    end: null,
    summary:
      "Building internal and customer-facing web features for business operations, with a focus on clean UI, fast workflows, and scalable full-stack development.",
    highlights: [
      "Built and maintained full-stack features using Next.js, React, Node.js, Express.js, Django, MongoDB, and Tailwind CSS.",
      "Worked on dashboard-style interfaces, form flows, and data-driven pages for business use cases.",
      "Improved code structure and reusable components to make the app easier to scale and maintain.",
    ],
    url: "https://www.shubhamtanks.com",
  },
  {
    company: "Shubham Tanks and Liners",
    role: "DWA Intern",
    start: "2025-07-28",
    end: "2026-01-27",
    summary:
      "Learned and built multiple full-stack projects while strengthening frontend, backend, and database skills.",
    highlights: [
      "Built MERN stack projects using React, Node.js, Express.js, and MongoDB.",
      "Created authentication, CRUD features, admin panels, and API integrations.",
      "Practiced component-based UI development and backend logic for real-world applications.",
    ],
    url: "https://www.shubhamtanks.com",
  },
];

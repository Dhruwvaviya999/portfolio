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
      "Building and maintaining full-stack applications that support internal business operations, with a focus on scalable architecture, efficient workflows, and maintainable UI.",
    highlights: [
      "Develop and maintain the company's ERP system, primarily contributing to the Sales & Marketing module across the end-to-end Lead-to-PO business workflow.",
      "Build production features using React.js, Django & PostgreSQL, including 4+ business dashboards, dynamic forms, and workflow-driven screens used by internal teams.",
      "Built a Daily Sales Activity Form & Dashboard used by 9+ sales team members to track performance and improve visibility into sales activities.",
      "Design reusable components, API integrations, and backend services; independently handle debugging, testing, and database-related tasks.",
      "Contribute to 30+ features and enhancements, collaborating with business stakeholders to translate requirements intoproduction-ready software.",
    ],
    url: "https://www.shubhamtanks.com",
  },
  {
    company: "Shubham Tanks and Liners",
    role: "Full Stack Developer Intern",
    start: "2025-07-28",
    end: "2026-01-27",
    summary:
      "Started as a Full Stack Developer Intern, working on practical web applications while building strong foundations across frontend, backend, APIs, and databases.",
    highlights: [
      "Built 3+ internal web applications from scratch with React, Tailwind CSS, Node.js & MongoDB, including admin panels and dashboards.",
      "Automated routine workflows across email, Google Sheets, and other manual processes, reducing repetitive work and improving data handling for business teams.",
    ],
    url: "https://www.shubhamtanks.com",
  },
];

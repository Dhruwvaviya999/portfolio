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
      "Developed and maintained production-ready features using Next.js, React, Node.js, Express.js, Django, MongoDB, and Tailwind CSS.",
      "Built business dashboards, data management interfaces, dynamic forms, and workflow-driven features used by internal teams.",
      "Designed reusable components, API integrations, and backend services to improve development efficiency and application maintainability.",
      "Worked across the frontend, backend, and database layers to debug issues, implement new requirements, and improve existing application workflows.",
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
      "Developed full-stack web applications using the MERN stack, implementing responsive interfaces, REST APIs, authentication, and CRUD operations.",
      "Built admin panels, data-driven dashboards, and reusable React components for different business and project requirements.",
      "Worked with MongoDB and Express.js to design database operations and develop backend APIs for frontend applications.",
      "Integrated third-party APIs and implemented form validation, error handling, and application-level business logic.",
    ],
    url: "https://www.shubhamtanks.com",
  },
];

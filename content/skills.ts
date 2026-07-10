import type { SkillGroup } from "@/types";

/**
 * Skills, grouped by category. `icon` is a key into the SkillIcon registry
 * (components/shared/skill-icon.tsx), which resolves it to a brand logo.
 * `description` is the one-liner shown in the skill detail dialog.
 */
export const skills: SkillGroup[] = [
  {
    category: "Frontend",
    items: [
      {
        name: "HTML",
        icon: "html",
        description: "The markup language that gives every web page its structure and meaning.",
      },
      {
        name: "CSS",
        icon: "css",
        description: "The styling language that controls layout, colour, and responsiveness on the web.",
      },
      {
        name: "JavaScript",
        icon: "javascript",
        description: "The language of the web, powering interactivity in the browser and on the server.",
      },
      {
        name: "React JS",
        icon: "react",
        description: "A component-based library for building interactive user interfaces from reusable pieces.",
      },
      {
        name: "Redux",
        icon: "redux",
        description: "A predictable state container that centralises application state in one store.",
      },
      {
        name: "Next JS",
        icon: "nextjs",
        description: "A React framework adding server rendering, routing, and production tooling out of the box.",
      },
      {
        name: "Tailwind CSS",
        icon: "tailwind",
        description: "A utility-first CSS framework for styling directly in markup without leaving your component.",
      },
      {
        name: "Material UI",
        icon: "mui",
        description: "A React component library implementing Google's Material Design system.",
      },
      {
        name: "Chakra UI",
        icon: "chakra",
        description: "An accessible React component library built for fast, composable interfaces.",
      },
      {
        name: "Bootstrap",
        icon: "bootstrap",
        description: "A CSS framework offering a responsive grid and ready-made components.",
      },
    ],
  },
  {
    category: "Backend",
    items: [
      {
        name: "Node JS",
        icon: "nodejs",
        description: "A runtime that executes JavaScript outside the browser to build servers and tooling.",
      },
      {
        name: "Express JS",
        icon: "express",
        description: "A minimal Node.js framework for building REST APIs and web servers.",
      },
      {
        name: "MySQL",
        icon: "mysql",
        description: "A widely used relational database for structured, query-heavy data.",
      },
      {
        name: "MongoDB",
        icon: "mongodb",
        description: "A document database that stores flexible, JSON-like records instead of rigid tables.",
      },
      {
        name: "Firebase",
        icon: "firebase",
        description: "Google's backend platform bundling auth, database, and hosting behind one SDK.",
      },
      {
        name: "PostgreSQL",
        icon: "postgresql",
        description: "A powerful open-source relational database known for correctness and rich features.",
      },
    ],
  },
  {
    category: "Languages",
    items: [
      {
        name: "Python",
        icon: "python",
        description: "A readable general-purpose language popular for scripting, data work, and automation.",
      },
      {
        name: "JavaScript",
        icon: "javascript",
        description: "The language of the web, powering interactivity in the browser and on the server.",
      },
      {
        name: "TypeScript",
        icon: "typescript",
        description: "JavaScript with static types, catching bugs before the code ever runs.",
      },
    ],
  },
  {
    category: "Tools",
    items: [
      {
        name: "Git",
        icon: "git",
        description: "A distributed version control system that tracks every change to your code.",
      },
      {
        name: "GitHub",
        icon: "github",
        description: "The platform where Git repositories are hosted, reviewed, and shipped from.",
      },
      {
        name: "VS Code",
        icon: "vscode",
        description: "A fast, extensible code editor that I live in day to day.",
      },
      {
        name: "Postman",
        icon: "postman",
        description: "An API client for testing, debugging, and documenting HTTP endpoints.",
      },
      {
        name: "Compass",
        icon: "compass",
        description: "MongoDB's GUI for exploring collections and running queries visually.",
      },
      {
        name: "Vercel",
        icon: "vercel",
        description: "A deployment platform purpose-built for shipping Next.js apps to the edge.",
      },
      {
        name: "Netlify",
        icon: "netlify",
        description: "A hosting platform for deploying frontend sites straight from Git.",
      },
    ],
  },
];

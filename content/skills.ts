import type { SkillGroup } from "@/types";

/**
 * Skills, grouped by category. `icon` is a key into the SkillIcon registry
 * (components/shared/skill-icon.tsx), which resolves it to a brand logo.
 */
export const skills: SkillGroup[] = [
  {
    category: "Frontend",
    items: [
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "JavaScript", icon: "javascript" },
      { name: "React JS", icon: "react" },
      { name: "Redux", icon: "redux" },
      { name: "Next JS", icon: "nextjs" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Material UI", icon: "mui" },
      { name: "Chakra UI", icon: "chakra" },
      { name: "Bootstrap", icon: "bootstrap" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node JS", icon: "nodejs" },
      { name: "Express JS", icon: "express" },
      { name: "MySQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Firebase", icon: "firebase" },
      { name: "PostgreSQL", icon: "postgresql" },
    ],
  },
  {
    category: "Languages",
    items: [
      { name: "Python", icon: "python" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
    ],
  },
  {
    category: "Tools",
    items: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "VS Code", icon: "vscode" },
      { name: "Postman", icon: "postman" },
      { name: "Compass", icon: "compass" },
      { name: "Vercel", icon: "vercel" },
      { name: "Netlify", icon: "netlify" },
    ],
  },
];

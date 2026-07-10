import type { Project } from "@/types";
import { Prose } from "@/components/projects/case-study";

export const setTimerApp: Project = {
  slug: "set-timer-app",
  title: "Set Timer App",
  summary:
    "A lightweight countdown timer built with vanilla HTML, CSS, and JavaScript — set a duration and an alarm rings when it hits zero.",
  year: 2024,
  role: "Frontend Developer",
  featured: false,
  cover: "/images/projects/set-timer-app.png",
  stack: ["HTML", "CSS", "JavaScript"],
  tags: ["Frontend", "Vanilla JS", "Mini Project"],
  links: {
    live: "https://set-timer-app.vercel.app",
    repo: "https://github.com/Dhruwvaviya999/set-timer-app",
  },
};

export function SetTimerAppCaseStudy() {
  return (
    <Prose>
      <h2>Overview</h2>
      <p>
        A simple countdown timer. The user enters how long they want the timer to
        run, starts it, and an alarm sound rings once it reaches zero. Built with
        nothing but <strong>HTML</strong>, <strong>CSS</strong>, and plain{" "}
        <strong>JavaScript</strong> — no frameworks, no build step.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Set a custom countdown duration.</li>
        <li>Live countdown display that updates every second.</li>
        <li>Alarm sound plays when the timer finishes.</li>
        <li>Start, pause, and reset controls.</li>
      </ul>

      <h2>What I Learned</h2>
      <p>
        A small project, but a good exercise in DOM manipulation,{" "}
        <code>setInterval</code> timing, and clearing intervals properly so the
        countdown never drifts or double-fires.
      </p>
    </Prose>
  );
}

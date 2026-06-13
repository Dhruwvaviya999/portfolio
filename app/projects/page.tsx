import type { Metadata } from "next";

import { getAllProjects } from "@/lib/content/projects";
import { SlideUp } from "@/components/motion";
import { Breadcrumbs } from "@/components/projects/breadcrumbs";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies of products I've designed and built — enterprise platforms, dashboards, and real-time tools.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsIndexPage() {
  const projects = getAllProjects();

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects" }]} />

        <header className="mt-8 max-w-2xl">
          <SlideUp>
            <p className="font-mono text-sm font-medium uppercase tracking-widest text-brand">
              Portfolio
            </p>
          </SlideUp>
          <SlideUp delay={0.08}>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Projects
            </h1>
          </SlideUp>
          <SlideUp delay={0.16}>
            <p className="mt-4 text-lg text-muted-foreground">
              A collection of {projects.length} case{" "}
              {projects.length === 1 ? "study" : "studies"} — the problems, the
              decisions, and the results. Filter by focus or search by name.
            </p>
          </SlideUp>
        </header>

        <div className="mt-10">
          <ProjectsExplorer projects={projects} />
        </div>
      </div>
    </main>
  );
}

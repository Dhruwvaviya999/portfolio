import type { Project } from "@/types";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ProjectCard } from "./project-card";

/** "Related projects" block shown at the bottom of a case study. */
export function RelatedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="border-t border-border bg-muted/20"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <h2
            id="related-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Related projects
          </h2>
        </Reveal>
        <Stagger className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <StaggerItem key={project.slug}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

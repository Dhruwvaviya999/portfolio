import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import type { Project } from "@/types";
import { getFeaturedProjects } from "@/lib/content/projects";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { SocialIcon } from "@/components/shared/icons";

/**
 * Featured projects — pulls `featured` entries from the content layer. Covers
 * are rendered as theme-aware gradient placeholders for now; swap in
 * `next/image` once real cover art exists in /public/images/projects.
 */
export function ProjectsSection() {
  const projects = getFeaturedProjects();

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Work"
        title="Featured projects"
        description="A few things I've designed, built, and shipped end-to-end."
      />

      <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <StaggerItem key={project.slug}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-12 flex justify-center">
        <Button variant="outline" size="lg" render={<Link href="/projects" />}>
          View All Projects
          <ArrowRight className="size-4" />
        </Button>
      </Reveal>
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;

  return (
    <Card className="group/proj h-full pt-0 transition-all duration-300 hover:-translate-y-1 hover:ring-brand/40">
      {/* Thumbnail (placeholder gradient) */}
      <Link
        href={href}
        aria-label={project.title}
        className="relative block aspect-video w-full overflow-hidden bg-gradient-to-br from-brand/25 via-brand/5 to-transparent"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-brand/15 transition-transform duration-500 group-hover/proj:scale-110"
        >
          {project.title.charAt(0)}
        </span>
        {project.tags[0] ? (
          <Badge className="absolute left-3 top-3" variant="secondary">
            {project.tags[0]}
          </Badge>
        ) : null}
        <span className="absolute bottom-3 right-3 font-mono text-xs text-muted-foreground">
          {project.year}
        </span>
      </Link>

      <CardHeader>
        <CardTitle className="text-lg">
          <Link href={href} className="transition-colors hover:text-brand">
            {project.title}
          </Link>
        </CardTitle>
        <CardDescription>{project.summary}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      {(project.links?.repo || project.links?.live) && (
        <CardFooter className="gap-2">
          {project.links?.repo ? (
            <Button
              variant="ghost"
              size="sm"
              render={
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <SocialIcon name="github" className="size-4" />
              Code
            </Button>
          ) : null}
          {project.links?.live ? (
            <Button
              variant="ghost"
              size="sm"
              render={
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <ExternalLink className="size-4" />
              Live
            </Button>
          ) : null}
        </CardFooter>
      )}
    </Card>
  );
}

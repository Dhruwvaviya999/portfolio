import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

/**
 * Project card for the index + related sections. Shared (no client-only deps),
 * so it renders in both the client explorer grid and server-rendered sections.
 * The cover is a theme-aware gradient placeholder that zooms on hover — swap in
 * `next/image` once real cover art exists.
 */
export function ProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;

  return (
    <Card className="group/proj h-full pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-brand/40">
      {/* Cover image with gradient fallback */}
      <Link
        href={href}
        aria-label={`Read the ${project.title} case study`}
        className="relative block aspect-video w-full overflow-hidden bg-gradient-to-br from-brand/25 via-brand/5 to-transparent"
      >
        {project.cover ? (
          <Image
            src={project.cover}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover/proj:scale-105"
          />
        ) : (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-brand/15 transition-transform duration-500 group-hover/proj:scale-110"
          >
            {project.title.charAt(0)}
          </span>
        )}
        {project.featured ? (
          <Badge className="absolute right-3 top-3">Featured</Badge>
        ) : null}
        {project.tags[0] ? (
          <Badge variant="secondary" className="absolute left-3 top-3">
            {project.tags[0]}
          </Badge>
        ) : null}
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
          {project.stack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Link
          href={href}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          Read Case Study
          <ArrowRight className="size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}

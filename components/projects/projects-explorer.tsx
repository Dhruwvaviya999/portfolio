"use client";

import { Search } from "lucide-react";

import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { PROJECT_CATEGORIES } from "@/lib/projects-filter";
import { useProjectFilter } from "@/hooks/use-project-filter";
import { Stagger, StaggerItem } from "@/components/motion";
import { ProjectCard } from "./project-card";

/**
 * Client island for the index: category chips + title/summary search, with a
 * responsive grid below. All projects are passed in from the (statically
 * generated) server page; filtering happens in-memory so the route stays SSG.
 */
export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const { category, setCategory, query, setQuery, filtered } =
    useProjectFilter(projects);

  return (
    <div>
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects…"
            aria-label="Search projects"
            className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {PROJECT_CATEGORIES.map((option) => {
            const active = category === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setCategory(option)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  active
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
      </p>

      {filtered.length > 0 ? (
        <Stagger
          key={`${category}-${query}`}
          className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((project) => (
            <StaggerItem key={project.slug}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">
          No projects match your filters.
        </p>
      )}
    </div>
  );
}

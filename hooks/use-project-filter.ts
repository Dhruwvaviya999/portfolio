"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/types";
import { filterProjects } from "@/lib/projects-filter";

/** Holds the index page's category + search state and the derived results. */
export function useProjectFilter(projects: Project[]) {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => filterProjects(projects, category, query),
    [projects, category, query],
  );

  return { category, setCategory, query, setQuery, filtered };
}

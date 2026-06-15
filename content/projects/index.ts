import type { ComponentType } from "react";
import type { Project } from "@/types";

import { ErpSystemCaseStudy, meta as erpSystem } from "./erp-system";
import { StockerCaseStudy, meta as stocker } from "./stocker";

/**
 * Project registry. Each entry pairs a project's metadata with the React
 * component that renders its case-study body (component-based — no MDX).
 * To add a project: create `content/projects/<slug>.tsx` and register it here.
 */
export interface ProjectEntry {
  meta: Project;
  Body: ComponentType;
}

export const projectEntries: ProjectEntry[] = [
  { meta: stocker, Body: StockerCaseStudy },
  { meta: erpSystem, Body: ErpSystemCaseStudy },
];

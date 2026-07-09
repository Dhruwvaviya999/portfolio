import type { ComponentType } from "react";
import type { Project } from "@/types";

import { ErpSystemCaseStudy, erpSystem } from "./erp-system";
import { MedygoCaseStudy, medygo } from "./medygo";
import { StockerCaseStudy, stocker } from "./stocker";
import { FaSpaghettiMonsterFlying } from "react-icons/fa6";

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
  { meta: medygo, Body: MedygoCaseStudy },
  // { meta: erpSystem, Body: ErpSystemCaseStudy },
  { meta: "", Body: ""}, // Set Timer App Project
  { meta: "", Body: ""}, // Finance Tracker Project
  { meta: "", Body: ""}, // Snake Game Project
  { meta: "", Body: ""}, // Travel Tracker Project
  { meta: "", Body: ""}, // Another Game Project
  { meta: "", Body: ""}, // Weather Wise Project
];

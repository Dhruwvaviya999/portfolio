import type { ComponentType } from "react";
import type { Project } from "@/types";

import { ErpSystemCaseStudy, erpSystem } from "./erp-system";
import { FinancelyCaseStudy, financely } from "./financely";
import { MedygoCaseStudy, medygo } from "./medygo";
import { SetTimerAppCaseStudy, setTimerApp } from "./set-timer-app";
import { StockerCaseStudy, stocker } from "./stocker";
import { WeatherWiseCaseStudy, weatherWise } from "./weather-wise";

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
  { meta: financely, Body: FinancelyCaseStudy },
  { meta: setTimerApp, Body: SetTimerAppCaseStudy },
  { meta: weatherWise, Body: WeatherWiseCaseStudy },
  // { meta: erpSystem, Body: ErpSystemCaseStudy },
  // { meta: "", Body: ""}, // Snake Game Project
  // { meta: "", Body: ""}, // Travel Tracker Project
  // { meta: "", Body: ""}, // Another Game Project
];

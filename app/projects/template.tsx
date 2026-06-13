"use client";

import type { ReactNode } from "react";
import { m } from "framer-motion";

/**
 * Per-navigation enter transition for the projects routes. `template.tsx`
 * remounts on every navigation (unlike `layout.tsx`), so this fades/slides the
 * page in when moving between the index and case studies. Honors reduced motion
 * via the global MotionConfig.
 */
export default function ProjectsTemplate({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}

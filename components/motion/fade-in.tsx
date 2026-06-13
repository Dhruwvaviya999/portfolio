"use client";

import * as React from "react";
import { m } from "framer-motion";
import { fadeInVariants } from "./variants";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before animating. */
  delay?: number;
  /** Override the animation duration in seconds. */
  duration?: number;
}

/**
 * Fades content in on mount. Use for above-the-fold elements that should
 * animate immediately (e.g. the hero), where a scroll trigger isn't wanted.
 */
export function FadeIn({ children, className, delay = 0, duration }: FadeInProps) {
  return (
    <m.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeInVariants(delay, duration)}
    >
      {children}
    </m.div>
  );
}

"use client";

import * as React from "react";
import { m } from "framer-motion";
import { slideUpVariants } from "./variants";

interface SlideUpProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before animating. */
  delay?: number;
  /** Override the animation duration in seconds. */
  duration?: number;
  /** Vertical offset (px) to translate from. */
  y?: number;
}

/**
 * Slides + fades content up on mount. Pairs with `FadeIn` for hero/above-the-fold
 * content; use `Reveal` instead when the element should animate on scroll.
 */
export function SlideUp({
  children,
  className,
  delay = 0,
  duration,
  y = 24,
}: SlideUpProps) {
  return (
    <m.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={slideUpVariants(delay, duration, y)}
    >
      {children}
    </m.div>
  );
}

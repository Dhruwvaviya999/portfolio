"use client";

import { m, useScroll, useSpring } from "framer-motion";

/**
 * Thin reading-progress bar pinned to the very top of the viewport, scaling
 * with page scroll. The spring smooths the motion value so the bar eases
 * rather than tracking scroll 1:1.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-brand"
    />
  );
}

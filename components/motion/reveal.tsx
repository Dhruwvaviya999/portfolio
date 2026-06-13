"use client";

import * as React from "react";
import { m } from "framer-motion";
import { VIEWPORT, slideUpVariants } from "./variants";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before animating once in view. */
  delay?: number;
  /** Override the animation duration in seconds. */
  duration?: number;
  /** Vertical offset (px) to translate from. */
  y?: number;
  /** Animate only the first time it enters the viewport (default true). */
  once?: boolean;
}

/**
 * The primary scroll-triggered primitive: slides + fades content in when it
 * enters the viewport. Defaults to firing once so content doesn't re-animate
 * on scroll-back.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration,
  y = 24,
  once = true,
}: RevealProps) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...VIEWPORT, once }}
      variants={slideUpVariants(delay, duration, y)}
    >
      {children}
    </m.div>
  );
}

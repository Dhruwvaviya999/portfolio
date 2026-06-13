"use client";

import * as React from "react";
import { m } from "framer-motion";
import { VIEWPORT, staggerContainer, staggerItemVariants } from "./variants";

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  /** Delay between each child's reveal, in seconds. */
  stagger?: number;
  /** Delay before the first child reveals, in seconds. */
  delayChildren?: number;
  /** Animate only the first time it enters the viewport (default true). */
  once?: boolean;
}

/**
 * Scroll-triggered container that reveals its children in sequence. Wrap each
 * child in `<StaggerItem>` so it inherits the staggered timing.
 */
export function Stagger({
  children,
  className,
  stagger,
  delayChildren,
  once = true,
}: StaggerProps) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...VIEWPORT, once }}
      variants={staggerContainer(stagger, delayChildren)}
    >
      {children}
    </m.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

/** A single item within a `Stagger` container. */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <m.div className={className} variants={staggerItemVariants}>
      {children}
    </m.div>
  );
}

/**
 * Shared Framer Motion timing + variants.
 *
 * Centralizing easing/duration here keeps motion consistent across every
 * primitive and gives one place to tune the site's "feel". These are plain
 * data/factory functions (no React), safe to import anywhere.
 */

import type { Variants } from "framer-motion";

/** easeOutExpo-style cubic bezier — quick start, soft settle. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DURATION = {
  fast: 0.3,
  base: 0.5,
  slow: 0.8,
} as const;

/** Default viewport config for scroll-triggered reveals (animate once). */
export const VIEWPORT = { once: true, margin: "-80px" } as const;

export function fadeInVariants(
  delay = 0,
  duration: number = DURATION.base,
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration, delay, ease: EASE } },
  };
}

export function slideUpVariants(
  delay = 0,
  duration: number = DURATION.base,
  y = 24,
): Variants {
  return {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration, delay, ease: EASE } },
  };
}

/** Container variant — staggers the reveal of its children. */
export function staggerContainer(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

/** Item variant for children of a `Stagger` container. */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
};

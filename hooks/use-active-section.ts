"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-spy: returns the id of the section currently crossing the middle of
 * the viewport, or `null` if none are present (e.g. on routes without these
 * sections). The default `rootMargin` collapses the observation area to a thin
 * band at the viewport center so exactly one section is "active" at a time.
 *
 * Gracefully no-ops until the matching `<section id>` elements exist, so it's
 * safe to mount before the home sections are built.
 */
export function useActiveSection(
  sectionIds: string[],
  rootMargin = "-50% 0px -50% 0px",
): string | null {
  const [active, setActive] = useState<string | null>(null);
  // Stable primitive dependency so the effect doesn't re-run on array identity.
  const ids = sectionIds.join("|");

  useEffect(() => {
    const idList = ids.split("|").filter(Boolean);
    const elements = idList
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id);
        if (intersecting.length > 0) {
          // Prefer the first section in document order.
          const next = idList.find((id) => intersecting.includes(id));
          if (next) setActive(next);
        }
      },
      { rootMargin, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return active;
}

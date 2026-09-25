/**
 * Navigation configuration — the single source of truth for the header,
 * footer, scroll-spy, and active-link logic.
 *
 * The site is single-scroll, so primary nav items are in-page anchors
 * (`/#section`). `SECTION_IDS` is derived from them and fed to the scroll-spy
 * hook; `socialLinks` drives the footer (`icon` names resolve to icons at
 * render time).
 */

import type { NavItem, SocialLink } from "@/types";
import { siteConfig } from "@/lib/site";

export const mainNav: NavItem[] = [
  { label: "About", href: "/#about" },
  { label: "Terminal", href: "/#terminal" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

/** Section element ids the scroll-spy observes, derived from the anchor nav. */
export const SECTION_IDS: string[] = mainNav
  .map((item) => (item.href.startsWith("/#") ? item.href.slice(2) : null))
  .filter((id): id is string => id !== null);

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: siteConfig.links.github, icon: "github" },
  { label: "LinkedIn", href: siteConfig.links.linkedin, icon: "linkedin" },
  { label: "X", href: siteConfig.links.twitter, icon: "twitter" },
  { label: "Email", href: `mailto:${siteConfig.links.email}`, icon: "mail" },
];

/**
 * Whether a nav item is "active" for the current location. Anchor items are
 * active when on the home route and their section is in view; route items are
 * active when the path matches (or is nested under) their href.
 */
export function isNavItemActive(
  item: NavItem,
  pathname: string,
  activeSection: string | null,
): boolean {
  if (item.href.startsWith("/#")) {
    return pathname === "/" && activeSection === item.href.slice(2);
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

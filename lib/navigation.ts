/**
 * Navigation configuration.
 *
 * `mainNav` drives the header and (later) scroll-spy. Home-page sections use
 * `/#anchor` hrefs; `Projects` points at the dedicated route added in Section 6.
 * `socialLinks` drives the footer / contact links — `icon` names map to
 * lucide-react icons at render time.
 */

import type { NavItem, SocialLink } from "@/types";
import { siteConfig } from "@/lib/site";

export const mainNav: NavItem[] = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: siteConfig.links.github, icon: "github" },
  { label: "LinkedIn", href: siteConfig.links.linkedin, icon: "linkedin" },
  { label: "X", href: siteConfig.links.twitter, icon: "twitter" },
  { label: "Email", href: `mailto:${siteConfig.links.email}`, icon: "mail" },
];

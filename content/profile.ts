import type { Profile } from "@/types";
import { socialLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

/**
 * Top-level profile / about data.
 *
 * NOTE: placeholder copy marked `TODO` — replace with the real bio before
 * launch. Socials are reused from the navigation config for a single source
 * of truth.
 */
export const profile: Profile = {
  name: siteConfig.name,
  title: "Software Engineer & Creative Developer", // TODO
  tagline: "I build fast, polished web experiences — from product UIs to real-time 3D.", // TODO
  bio:
    "Full-stack engineer focused on the frontend, with a soft spot for performance, " +
    "design systems, and the occasional WebGL experiment. I've shipped everything from " +
    "internal ERP platforms to real-time collaboration tools, and I care about the small " +
    "details that make software feel effortless.", // TODO
  location: "Remote", // TODO
  email: siteConfig.links.email,
  socials: socialLinks,
};

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
  title: "Software Developer",
  tagline:
    "I build fast, polished web experiences — from product UIs to real-time 3D.", // TODO
  bio: "I’m a dedicated Full Stack Developer with 1+ years of experience in building scalable Full stack applications. Coming from a Commerce background, I worked hard to learn web development through consistent practice and real projects. I learn fast, solve problems effectively, and deliver clean, reliable solutions.", // TODO
  location: "Remote", // TODO
  email: siteConfig.links.email,
  socials: socialLinks,
};

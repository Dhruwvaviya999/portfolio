import type { Profile } from "@/types";
import { socialLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

export const profile: Profile = {
  name: siteConfig.name,
  title: "Software Developer",
  phone: "+91 8591608791",
  tagline:
    "I build full stack web apps — from clean UIs to reliable backends.",
  bio: "I’m a dedicated Full Stack Developer with 1+ years of experience in building scalable Full stack applications. Coming from a Commerce background, I worked hard to learn Software development through consistent practice and real projects. I learn fast, solve problems effectively, and deliver clean, reliable solutions.",
  location: "Remote",
  email: siteConfig.links.email,
  socials: socialLinks,
};

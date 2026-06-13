import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";
import { personJsonLd, websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import {
  AboutSection,
  ContactSection,
  ExperienceSection,
  HeroSection,
  ProjectsSection,
  SkillsSection,
} from "@/components/sections";

export const metadata: Metadata = {
  // Absolute title so the home page reads well (bypasses the "%s | name" template).
  title: { absolute: `${siteConfig.name} — ${siteConfig.title}` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="flex-1">
      <JsonLd data={personJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </main>
  );
}

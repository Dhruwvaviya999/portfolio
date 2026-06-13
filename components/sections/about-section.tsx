import { Code2, Rocket, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { profile } from "@/content/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

/**
 * About — professional summary plus three scannable cards (what I build,
 * current focus, key strengths). Content is local placeholder copy (TODO) since
 * it isn't part of the structured content layer.
 */
const aboutCards: { title: string; icon: LucideIcon; items: string[] }[] = [
  {
    title: "What I build",
    icon: Code2,
    items: [
      "Production web apps with Next.js & TypeScript",
      "Design systems and reusable component libraries",
      "Real-time, data-heavy dashboards",
      "Interactive 3D / WebGL experiences",
    ],
  },
  {
    title: "Current focus",
    icon: Target,
    items: [
      "RSC-first, accessible interfaces",
      "Performance budgets & Core Web Vitals",
      "Motion that respects reduced-motion",
    ],
  },
  {
    title: "Key strengths",
    icon: Rocket,
    items: [
      "Frontend architecture",
      "End-to-end ownership",
      "Pragmatic problem solving",
      "Clear communication",
    ],
  },
];

export function AboutSection() {
  return (
    <Section id="about">
      <SectionHeading eyebrow="About" title="A bit about me" />

      <Reveal className="mt-6">
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {profile.bio}
        </p>
      </Reveal>

      <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {aboutCards.map(({ title, icon: Icon, items }) => (
          <StaggerItem key={title}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="mt-2">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

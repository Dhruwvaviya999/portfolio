import { skills } from "@/content/skills";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stagger, StaggerItem } from "@/components/motion";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { SkillIcon } from "@/components/shared/skill-icon";

/**
 * Skills — one premium card per category from the content layer. Each technology
 * is a pill showing its brand icon + name. Cards reveal with a staggered
 * entrance and lift on hover. Icons render server-side (static SVG, no client JS).
 */
export function SkillsSection() {
  return (
    <Section id="skills" className="bg-muted/30">
      <SectionHeading
        eyebrow="Skills"
        title="Tools I work with"
        description="A pragmatic stack for building fast, polished, maintainable products."
      />

      <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {skills.map((group) => (
          <StaggerItem key={group.category}>
            <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-brand/40">
              <CardHeader>
                <CardTitle className="text-base">{group.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {group.items.map((skill) => (
                    <li key={skill.name}>
                      <span className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm transition-colors hover:border-brand/40 hover:bg-background">
                        <SkillIcon name={skill.icon} className="size-[1.15rem]" />
                        <span className="truncate">{skill.name}</span>
                      </span>
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

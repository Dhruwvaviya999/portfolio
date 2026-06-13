import { skills } from "@/content/skills";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stagger, StaggerItem } from "@/components/motion";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

/**
 * Skills — one premium card per category from the content layer, each holding
 * technology badges. Cards reveal with a staggered entrance and lift on hover.
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
                <CardTitle>{group.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <Badge
                      key={skill.name}
                      variant="secondary"
                      className="h-7 px-3 text-sm transition-colors hover:bg-brand/15 hover:text-brand"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

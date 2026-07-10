import { skills } from "@/content/skills";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { SkillTile } from "@/components/shared/skill-tile";

/**
 * Skills — each category is a plain heading over a flat grid of icon tiles.
 * Clicking a tile opens a dialog where the logo flips in and a one-line
 * definition explains the tool.
 */
export function SkillsSection() {
  return (
    <Section id="skills" className="bg-muted/30">
      <SectionHeading
        eyebrow="Skills"
        title="Tools I work with"
        description="A pragmatic stack for building fast, polished, maintainable products. Tap any tool to learn what it does."
      />

      <div className="mt-12 space-y-10">
        {skills.map((group) => (
          <Reveal key={group.category}>
            <div className="mb-4 flex items-center gap-4">
              <h3 className="font-mono text-xs font-semibold tracking-widest text-brand uppercase">
                {group.category}
              </h3>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-gradient-to-r from-border to-transparent"
              />
            </div>

            <Stagger className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {group.items.map((skill) => (
                <StaggerItem key={`${group.category}-${skill.name}`}>
                  <SkillTile skill={skill} category={group.category} />
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

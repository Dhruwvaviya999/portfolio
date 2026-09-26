import { skills } from "@/content/skills";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { LogoTrain, type TrainSkill } from "@/components/shared/logo-train";

// --- Old category-partitioned imports (kept for reference) ---
// import { Reveal, Stagger, StaggerItem } from "@/components/motion";
// import { SkillTile } from "@/components/shared/skill-tile";

/**
 * Flatten every category into one list of logos, dropping duplicates by name
 * ("JavaScript" lives under both Frontend and Languages) so a tool shows once.
 */
const allSkills: TrainSkill[] = (() => {
  const seen = new Set<string>();
  return skills.flatMap((group) =>
    group.items
      .filter((skill) => {
        if (seen.has(skill.name)) return false;
        seen.add(skill.name);
        return true;
      })
      .map((skill) => ({ skill, category: group.category })),
  );
})();

/**
 * Skills — just the logos, formed into a "train" that chases the mouse cursor
 * and trails its path like a comet tail, collapsing into a stack when it stops.
 */
export function SkillsSection() {
  return (
    <Section id="skills" className="overflow-x-clip bg-muted/30">
      <SectionHeading
        eyebrow="Skills"
        title="Tools I work with"
        description="A pragmatic stack for building fast, polished, maintainable products. Move your cursor through them, then click to let them go."
      />

      {/* Full-bleed breakout: the train plays across the entire viewport
          width, not just the centered content column. The Section root clips
          the scrollbar-width overflow of 100vw. */}
      <div className="mx-[calc(50%-50vw)] mt-12 w-screen">
        <LogoTrain items={allSkills} />
      </div>

      {/*
        --- Previous layout: one grid per category (Frontend / Backend /
        Languages / Tools). Commented out in favour of the logo train above;
        restore this block (and the imports up top) to bring the category
        partition back.

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
      */}
    </Section>
  );
}

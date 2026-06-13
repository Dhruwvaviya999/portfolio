import { experience } from "@/content/experience";
import { Stagger, StaggerItem } from "@/components/motion";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

/** "2023-04" -> "Apr 2023". Runs server-side only, so no hydration concerns. */
function formatMonth(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Experience — a vertical timeline of roles from the content layer. Each entry
 * reveals with a staggered motion effect. Highlights surface enterprise / ERP /
 * dashboard / automation work.
 */
export function ExperienceSection() {
  return (
    <Section id="experience">
      <SectionHeading
        eyebrow="Experience"
        title="Where I've worked"
        description="Building and scaling enterprise platforms, dashboards, and internal tooling."
      />

      <Stagger className="mt-12 space-y-8">
        {experience.map((job, index) => {
          const isLast = index === experience.length - 1;
          return (
            <StaggerItem key={`${job.company}-${job.start}`}>
              <div className="grid grid-cols-[auto_1fr] gap-x-4">
                {/* Timeline marker + connector */}
                <div className="flex flex-col items-center">
                  <span className="mt-1.5 size-3 shrink-0 rounded-full border-2 border-brand bg-background" />
                  {!isLast ? <span className="mt-1 w-px flex-1 bg-border" /> : null}
                </div>

                {/* Content */}
                <div className="pb-2">
                  <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {formatMonth(job.start)} – {job.end ? formatMonth(job.end) : "Present"}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">
                    {job.role} ·{" "}
                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand hover:underline"
                      >
                        {job.company}
                      </a>
                    ) : (
                      <span className="text-brand">{job.company}</span>
                    )}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{job.summary}</p>
                  <ul className="mt-3 space-y-1.5">
                    {job.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-brand/60"
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}

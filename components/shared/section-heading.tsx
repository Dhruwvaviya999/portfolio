import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion";

/**
 * Standard section heading: a brand eyebrow, title, and optional description.
 * Revealed on scroll. Used across all home sections for a consistent rhythm.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal>
      <div
        className={cn(
          "max-w-2xl",
          align === "center" && "mx-auto text-center",
          className,
        )}
      >
        {eyebrow ? (
          <p className="font-mono text-sm font-medium uppercase tracking-widest text-brand">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}

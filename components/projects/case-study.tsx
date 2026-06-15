import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export { Callout } from "@/components/mdx/callout";

/**
 * Typographic wrapper for component-authored case studies. Styles descendant
 * HTML (h2/h3/p/lists/links/strong) so a case-study body can be written as
 * plain semantic JSX and read consistently in light and dark mode.
 */
export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-foreground/80",
        "[&_h2]:mt-12 [&_h2]:scroll-m-20 [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground first:[&_h2]:mt-0",
        "[&_h3]:mt-8 [&_h3]:scroll-m-20 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-foreground",
        "[&_p]:mt-6 [&_p]:text-[1.05rem] [&_p]:leading-8",
        "[&_ul]:my-6 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2",
        "[&_ol]:my-6 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2",
        "[&_li]:leading-7 [&_li]:marker:text-brand/60",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:no-underline",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A results grid — cleaner than a markdown table for headline metrics. */
export function Metrics({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <dl className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-muted/30 p-4"
        >
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 text-lg font-semibold text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

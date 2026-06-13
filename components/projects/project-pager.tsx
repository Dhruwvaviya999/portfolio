import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { Project } from "@/types";
import { cn } from "@/lib/utils";

/** Previous / next project navigation at the foot of a case study. */
export function ProjectPager({
  prev,
  next,
}: {
  prev: Project | null;
  next: Project | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Project navigation"
      className="mx-auto w-full max-w-6xl px-4 sm:px-6"
    >
      <div className="grid grid-cols-1 gap-4 border-t border-border py-10 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="group flex flex-col gap-1 rounded-xl border border-border p-4 transition-colors hover:border-brand/40"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              Previous
            </span>
            <span className="font-medium transition-colors group-hover:text-brand">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}

        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className={cn(
              "group flex flex-col gap-1 rounded-xl border border-border p-4 transition-colors hover:border-brand/40",
              "sm:text-right",
            )}
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground sm:justify-end">
              Next
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="font-medium transition-colors group-hover:text-brand">
              {next.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
    </nav>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Consistent section shell: vertical rhythm, centered max-width container, and
 * `scroll-mt` so anchor jumps clear the sticky navbar. `id` feeds the scroll-spy.
 */
export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-20 sm:py-28", className)}>
      <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

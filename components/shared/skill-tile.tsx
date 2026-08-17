"use client";

import { m, useReducedMotion } from "framer-motion";

import type { Skill } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SkillIcon } from "@/components/shared/skill-icon";

const SPRING = { type: "spring", stiffness: 260, damping: 28, mass: 0.8 } as const;

/**
 * A single skill tile. Clicking it opens a dialog, and the tile's logo flies
 * from the grid into the dialog as a shared element (`layoutId`) — then back
 * again on close. Reduced-motion users get a static swap instead.
 *
 * The dialog's own zoom keyframes are disabled (`data-*:animate-none`): a CSS
 * transform on the popup would distort the icon's layout projection mid-flight.
 */
export function SkillTile({
  skill,
  category,
}: {
  skill: Skill;
  category: string;
}) {
  const reduceMotion = useReducedMotion();
  // Must be unique across the page — "JavaScript" appears in two categories.
  const layoutId = reduceMotion
    ? undefined
    : `skill-icon-${category}-${skill.name}`;

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={`About ${skill.name}`}
            className="group/skill flex size-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border border-border bg-background/60 px-3 py-5 text-center transition-colors duration-300 outline-none hover:border-brand/40 hover:bg-background hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand/50"
          />
        }
      >
        <m.span layoutId={layoutId} transition={SPRING} className="block">
          <SkillIcon
            name={skill.icon}
            className="size-8 transition-transform duration-300 group-hover/skill:scale-110"
          />
        </m.span>
        <span className="text-xs font-medium text-muted-foreground transition-colors group-hover/skill:text-foreground">
          {skill.name}
        </span>
      </DialogTrigger>

      <DialogContent className="data-closed:animate-none data-open:animate-none sm:max-w-md">
        <DialogHeader className="items-center gap-4 text-center">
          {/* The bordered plate fades in around the icon as it lands. */}
          <m.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05, duration: 0.25 }}
            className="flex size-20 items-center justify-center rounded-2xl border border-border bg-muted/50 shadow-sm"
          >
            <m.span layoutId={layoutId} transition={SPRING} className="block">
              <SkillIcon name={skill.icon} className="size-10" />
            </m.span>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.25 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex flex-col items-center gap-2">
              <DialogTitle className="text-lg">{skill.name}</DialogTitle>
              <Badge variant="secondary">{category}</Badge>
            </div>

            {skill.description ? (
              <DialogDescription className="text-balance leading-relaxed">
                {skill.description}
              </DialogDescription>
            ) : null}
          </m.div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

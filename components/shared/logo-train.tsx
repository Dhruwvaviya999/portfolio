"use client";

import { useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";

import type { Skill } from "@/types";
import { SkillIcon } from "@/components/shared/skill-icon";

export type TrainSkill = { skill: Skill; category: string };

/**
 * How hard each logo eases toward the one ahead of it, per frame. Higher =
 * tighter, snappier train; lower = a longer, slower tail that strings out so
 * the logos arrive at the cursor one by one and you can read each of them.
 */
const FOLLOW = 0.12;

/** Ease used while the logos fan out on click — a touch softer, so the
 *  reflow settles smoothly instead of snapping into the grid. */
const SPREAD_FOLLOW = 0.09;

/** Keep every logo (and its plate) this far from the container edges so it
 *  never rides up over the "Tools I work with" heading. */
const EDGE = 64;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

/**
 * A "train" of logos that chases the mouse anywhere in the skills section. The
 * head eases toward the cursor and every other logo eases toward the one in
 * front of it, so the chain strings out along the cursor's path and collapses
 * into a stack when it stops.
 *
 * Press and hold the mouse and the train fans out into an even grid that fills
 * the whole section (never above the heading); release to reel it back in.
 *
 * Positions live in refs and are written straight to the DOM inside a single
 * animation frame, so the 25-logo chain never triggers a React re-render.
 */
export function LogoTrain({ items }: { items: TrainSkill[] }) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const points = useRef(items.map(() => ({ x: 0, y: 0 })));
  const target = useRef({ x: 0, y: 0 });
  const spread = useRef(false);
  const seeded = useRef(false);

  useAnimationFrame(() => {
    if (reduceMotion) return;
    const c = containerRef.current;
    if (!c) return;

    const pts = points.current;
    const n = pts.length;
    const rect = c.getBoundingClientRect();

    // First frame: park the whole train at the centre so it doesn't fly in
    // from the top-left corner before the cursor is ever seen.
    if (!seeded.current) {
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      target.current.x = cx;
      target.current.y = cy;
      for (const p of pts) {
        p.x = cx;
        p.y = cy;
      }
      seeded.current = true;
    }

    if (spread.current) {
      // Fan out into an aspect-aware grid that fills the padded area, each row
      // spread evenly across the full width — logos end up "everywhere".
      const w = Math.max(rect.width - EDGE * 2, 1);
      const h = Math.max(rect.height - EDGE * 2, 1);
      const cols = Math.max(1, Math.round(Math.sqrt(n * (w / h))));
      const rows = Math.ceil(n / cols);

      for (let i = 0; i < n; i++) {
        const row = Math.floor(i / cols);
        const inRow = row < rows - 1 ? cols : n - cols * (rows - 1);
        const col = i - row * cols;
        const tx = EDGE + (inRow === 1 ? w / 2 : (col / (inRow - 1)) * w);
        const ty = EDGE + (rows === 1 ? h / 2 : (row / (rows - 1)) * h);
        pts[i].x += (tx - pts[i].x) * SPREAD_FOLLOW;
        pts[i].y += (ty - pts[i].y) * SPREAD_FOLLOW;
      }
    } else {
      // Clamp the cursor target so plates always stay clear of the heading.
      const tx = clamp(target.current.x, EDGE, rect.width - EDGE);
      const ty = clamp(target.current.y, EDGE, rect.height - EDGE);
      pts[0].x += (tx - pts[0].x) * FOLLOW;
      pts[0].y += (ty - pts[0].y) * FOLLOW;
      for (let i = 1; i < n; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * FOLLOW;
        pts[i].y += (pts[i - 1].y - pts[i].y) * FOLLOW;
      }
    }

    for (let i = 0; i < n; i++) {
      const el = nodeRefs.current[i];
      if (el) {
        el.style.transform = `translate3d(${pts[i].x}px, ${pts[i].y}px, 0) translate(-50%, -50%)`;
      }
    }
  });

  // Reduced motion / non-hover fallback: a calm centred wrap of the logos.
  if (reduceMotion) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        {items.map((item) => (
          <span
            key={`${item.category}-${item.skill.name}`}
            className="flex items-center justify-center rounded-2xl border border-border bg-background p-3 shadow-sm sm:p-4"
          >
            <SkillIcon name={item.skill.icon} className="size-12 sm:size-16" />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        target.current.x = e.clientX - rect.left;
        target.current.y = e.clientY - rect.top;
      }}
      onPointerDown={() => {
        spread.current = true;
      }}
      onPointerUp={() => {
        spread.current = false;
      }}
      onPointerLeave={() => {
        spread.current = false;
      }}
      className="relative h-[72vh] min-h-125 w-full touch-none select-none"
    >
      {items.map((item, i) => (
        <span
          key={`${item.category}-${item.skill.name}`}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          aria-hidden="true"
          // Head sits on top; each carriage tucks behind the one ahead.
          style={{ zIndex: items.length - i }}
          className="pointer-events-none absolute top-0 left-0 [will-change:transform]"
        >
          <span className="flex items-center justify-center rounded-2xl border border-border bg-background p-3 shadow-md sm:p-4">
            <SkillIcon name={item.skill.icon} className="size-12 sm:size-16" />
          </span>
        </span>
      ))}
    </div>
  );
}

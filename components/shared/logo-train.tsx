"use client";

import { useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";

import type { Skill } from "@/types";
import { SkillIcon } from "@/components/shared/skill-icon";

export type TrainSkill = { skill: Skill; category: string };

/**
 * Time gap between carriages. Logo `i` chases the point the cursor occupied
 * `i * DELAY_MS` ago, so the train replays the cursor's path — spacing
 * stretches when the mouse moves fast and bunches when it slows, and the
 * whole snake piles back into a stack (tail last) once the cursor rests.
 */
const DELAY_MS = 110;

/** Ease toward the delayed target while trailing, normalised to a 60fps
 *  frame. Lower = calmer, silkier trail; higher = sharper corners. */
const FOLLOW = 0.17;

/** How long the click-burst journey takes, per logo (ms). Each logo gets a
 *  touch of random variance so the burst shimmers instead of moving as one
 *  rigid sheet. */
const SCATTER_MS = 900;

/** How long a logo's journey back from its scattered spot to the train
 *  takes (ms), once its turn in the queue comes up. */
const REGATHER_MS = 750;

/**
 * Shape of the scatter/regather journeys: 0 = constant speed, towards 1 =
 * launch fast, breathe slower through the middle, then speed up again to
 * land — smooth (sinusoidal) the whole way. 0.55 ≈ 1.55x speed at the two
 * ends and 0.45x at the midpoint.
 */
const MID_SLOWDOWN = 0.55;

/** How far a scattered logo may stray from its grid cell centre, as a
 *  fraction of the cell — makes the burst look thrown, not laid out. */
const JITTER = 0.8;

/** Keep every logo (and its plate) this far from the container edges so it
 *  never rides up over the "Tools I work with" heading. */
const EDGE = 64;

/** Milliseconds of cursor history to retain beyond the deepest delay. */
const HISTORY_SLACK = 1000;

/** Per-logo animation modes. */
const M_FOLLOW = 0; // trailing the delayed cursor history
const M_BURST = 1; // journeying out to its scattered spot
const M_PINNED = 2; // parked at its scattered spot, waiting for its turn
const M_REJOIN = 3; // journeying from the scattered spot back to the train

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

/** Fast → slow → fast, smooth everywhere: e(t) = t + A·sin(2πt)/2π. */
const journeyEase = (t: number) =>
  t + (MID_SLOWDOWN * Math.sin(2 * Math.PI * t)) / (2 * Math.PI);

type Sample = { x: number; y: number; t: number };

/**
 * A "train" of logos that replays the cursor's path. Every frame the (clamped)
 * pointer position is pushed into a history buffer; logo `i` eases toward the
 * sample from `i * DELAY_MS` ago. Because a logo with no sample old enough
 * simply stays put, the carriages peel out of the stack one by one when the
 * cursor takes off, and rejoin one by one after a scatter.
 *
 * Press and hold to fling the logos to jittered spots across the section
 * (never above the heading); they stay pinned while held. On release the
 * history restarts, so the train re-forms carriage by carriage. Both the
 * burst out and the journey back are timed tweens with a fast–slow–fast
 * profile (see MID_SLOWDOWN) rather than raw easing pulls, so they launch
 * quickly, breathe through the middle, and land decisively.
 *
 * Positions live in refs and are written straight to the DOM inside a single
 * animation frame, so the 25-logo chain never triggers a React re-render.
 */
export function LogoTrain({ items }: { items: TrainSkill[] }) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const points = useRef(items.map(() => ({ x: 0, y: 0 })));
  const scatterTo = useRef(items.map(() => ({ x: 0, y: 0 })));
  const history = useRef<Sample[]>([]);
  const target = useRef({ x: 0, y: 0 });
  const spread = useRef(false);
  const seeded = useRef(false);

  // Per-logo journey state (modes above). Journeys interpolate from a frozen
  // start point so their pacing is fully under journeyEase's control.
  const mode = useRef(items.map(() => M_FOLLOW));
  const journeyFrom = useRef(items.map(() => ({ x: 0, y: 0 })));
  const journeyT0 = useRef(items.map(() => 0));
  const journeyDur = useRef(items.map(() => 0));

  // Last frame timestamp, so pointer handlers share the animation clock.
  const clock = useRef(0);

  /** Fling every logo to a shuffled, jittered grid cell inside the padded
   *  area, so the burst covers the whole section but looks random. */
  const buildScatter = () => {
    const c = containerRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const n = items.length;
    const w = Math.max(rect.width - EDGE * 2, 1);
    const h = Math.max(rect.height - EDGE * 2, 1);
    const cols = Math.max(1, Math.round(Math.sqrt(n * (w / h))));
    const rows = Math.ceil(n / cols);

    // Even-grid cell centres (partial last row spread across full width).
    const cells: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / cols);
      const inRow = row < rows - 1 ? cols : n - cols * (rows - 1);
      const col = i - row * cols;
      cells.push({
        x: EDGE + (inRow === 1 ? w / 2 : (col / (inRow - 1)) * w),
        y: EDGE + (rows === 1 ? h / 2 : (row / (rows - 1)) * h),
      });
    }

    // Shuffle so chain-neighbours don't land next to each other.
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    const jx = (w / cols) * JITTER;
    const jy = (h / rows) * JITTER;
    for (let i = 0; i < n; i++) {
      scatterTo.current[i].x = clamp(
        cells[i].x + (Math.random() - 0.5) * jx,
        EDGE,
        rect.width - EDGE,
      );
      scatterTo.current[i].y = clamp(
        cells[i].y + (Math.random() - 0.5) * jy,
        EDGE,
        rect.height - EDGE,
      );
    }
  };

  useAnimationFrame((time, delta) => {
    if (reduceMotion) return;
    const c = containerRef.current;
    if (!c) return;

    clock.current = time;
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

    // Frame-rate independent trail ease (tuned against a 60fps frame).
    const dt = Math.min(delta, 100) / (1000 / 60);
    const follow = 1 - Math.pow(1 - FOLLOW, dt);

    const hist = history.current;
    if (!spread.current) {
      // Record where the cursor is *now* (clamped clear of the heading).
      // Pushing even when idle is intentional: identical samples are what
      // make the tail catch up and collapse into a stack.
      hist.push({
        x: clamp(target.current.x, EDGE, rect.width - EDGE),
        y: clamp(target.current.y, EDGE, rect.height - EDGE),
        t: time,
      });
      const maxAge = (n - 1) * DELAY_MS + HISTORY_SLACK;
      while (hist.length > 1 && hist[0].t < time - maxAge) hist.shift();
    }

    // One backwards walk serves every carriage: delays grow with i, so the
    // cursor `j` only ever moves toward older samples.
    let j = hist.length - 1;
    for (let i = 0; i < n; i++) {
      // Delayed history sample for this carriage, if one old enough exists.
      let hasSample = false;
      let sx = 0;
      let sy = 0;
      if (!spread.current && hist.length > 0) {
        const wantT = time - i * DELAY_MS;
        while (j >= 0 && hist[j].t > wantT) j--;
        if (j >= 0) {
          hasSample = true;
          sx = hist[j].x;
          sy = hist[j].y;
        }
      }

      const m = mode.current[i];

      if (m === M_BURST) {
        const k = clamp((time - journeyT0.current[i]) / journeyDur.current[i], 0, 1);
        const e = journeyEase(k);
        pts[i].x =
          journeyFrom.current[i].x +
          (scatterTo.current[i].x - journeyFrom.current[i].x) * e;
        pts[i].y =
          journeyFrom.current[i].y +
          (scatterTo.current[i].y - journeyFrom.current[i].y) * e;
        if (k >= 1) mode.current[i] = M_PINNED;
      } else if (m === M_PINNED) {
        // Parked. The moment this carriage's slot in the history exists,
        // its turn has come: launch the journey back to the train.
        if (hasSample) {
          mode.current[i] = M_REJOIN;
          journeyFrom.current[i].x = pts[i].x;
          journeyFrom.current[i].y = pts[i].y;
          journeyT0.current[i] = time;
          journeyDur.current[i] = REGATHER_MS;
        }
      } else if (m === M_REJOIN) {
        // Homing tween: the destination is the *live* delayed sample, so the
        // journey lands on the moving train, not where it used to be.
        const k = clamp((time - journeyT0.current[i]) / journeyDur.current[i], 0, 1);
        const e = journeyEase(k);
        if (hasSample) {
          pts[i].x = journeyFrom.current[i].x + (sx - journeyFrom.current[i].x) * e;
          pts[i].y = journeyFrom.current[i].y + (sy - journeyFrom.current[i].y) * e;
        }
        if (k >= 1) mode.current[i] = M_FOLLOW;
      } else if (hasSample) {
        // M_FOLLOW: trail the delayed cursor history. No sample old enough
        // (fresh buffer) means hold still until this carriage's moment comes.
        pts[i].x += (sx - pts[i].x) * follow;
        pts[i].y += (sy - pts[i].y) * follow;
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
        buildScatter();
        spread.current = true;
        for (let i = 0; i < items.length; i++) {
          mode.current[i] = M_BURST;
          journeyFrom.current[i].x = points.current[i].x;
          journeyFrom.current[i].y = points.current[i].y;
          journeyT0.current[i] = clock.current;
          // Slight variance so the sheet of logos doesn't move in lockstep.
          journeyDur.current[i] = SCATTER_MS * (0.85 + Math.random() * 0.3);
        }
      }}
      onPointerUp={() => {
        spread.current = false;
        // Restart the path: carriages rejoin one by one as their history
        // slots refill, each on its own fast–slow–fast journey.
        history.current.length = 0;
      }}
      onPointerLeave={() => {
        spread.current = false;
        history.current.length = 0;
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
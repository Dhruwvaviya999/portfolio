"use client";

import { useEffect, useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";

import type { Skill } from "@/types";
import { SkillIcon } from "@/components/shared/skill-icon";

export type TrainSkill = { skill: Skill; category: string };

/* ----------------------------------------------------------------------------
 * Tuning. The simulation runs in fixed 60fps steps (see STEP_MS) so these
 * per-step factors behave identically on 60/120/144Hz displays.
 * ------------------------------------------------------------------------- */

/** Fixed simulation step (ms). */
const STEP_MS = 1000 / 60;
/** Max steps per frame — caps catch-up after a tab switch. */
const MAX_STEPS = 4;

/** Spring pull toward a logo's rest spot when released (per step). */
const SPRING = 0.08;
/** Velocity damping when released (per step). ~0.82 = lively overshoot. */
const DAMPING = 0.82;

/** Lerp factor toward the cursor trail while gathering (per step). */
const FOLLOW = 0.14;
/** Trail samples between consecutive carriages — the spacing of the snake. */
const TRAIL_GAP = 6;
/** Extra trail samples kept beyond what the last carriage needs. */
const TRAIL_SLACK = 30;

/** While resting, every logo's target drifts ±WOBBLE_PX this often (ms). */
const WOBBLE_MS = 2000;
const WOBBLE_PX = 10;

/** Entrance: per-logo stagger and journey duration (ms). */
const ENTER_STAGGER_MS = 75;
const ENTER_MS = 500;

/** Keep every rest spot this far from the container edges. */
const EDGE = 64;
/** Soft wall for the spring: a plate's centre never crosses this inset, so
 *  an overshoot can't sail over the heading or out of the viewport. */
const WALL = 44;
/** Velocity kept (and reversed) when a plate hits the wall. */
const WALL_BOUNCE = 0.35;
/** How far a rest spot may stray from its grid cell centre (fraction of cell). */
const JITTER = 0.8;
/** Seed for the rest layout — same spread on every visit. */
const LAYOUT_SEED = 0x9e3779b9;

/** Cursor must travel this far after a release before the train re-forms —
 *  filters the click's own micro-jitter. */
const REGATHER_MOVE_PX = 14;

/** easeOutBack — overshoots then settles. */
const easeOutBack = (t: number) =>
  1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/** Tiny seeded PRNG (mulberry32) so the rest layout is stable across mounts. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Rest layout as normalised (0..1) coordinates: a shuffled, jittered grid so
 * the spread covers the area evenly but reads as thrown. Computed once per
 * item count; scaled to the live container size on every resize.
 */
function buildLayout(n: number, aspect: number): Array<{ u: number; v: number }> {
  const rand = mulberry32(LAYOUT_SEED + n);
  const cols = Math.max(1, Math.round(Math.sqrt(n * aspect)));
  const rows = Math.ceil(n / cols);
  const cells: Array<{ u: number; v: number }> = [];
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols);
    const inRow = row < rows - 1 ? cols : n - cols * (rows - 1);
    const col = i - row * cols;
    cells.push({
      u: inRow === 1 ? 0.5 : col / (inRow - 1),
      v: rows === 1 ? 0.5 : row / (rows - 1),
    });
  }
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  const ju = JITTER / Math.max(cols - 1, 1);
  const jv = JITTER / Math.max(rows - 1, 1);
  return cells.map((c) => ({
    u: clamp(c.u + (rand() - 0.5) * ju, 0, 1),
    v: clamp(c.v + (rand() - 0.5) * jv, 0, 1),
  }));
}

/**
 * Stacking for carriage rank r of n: rises head → tail with an over-under
 * weave so each carriage pops above both neighbours; the tail stays highest.
 */
const zForRank = (r: number, n: number) =>
  r === n - 1 ? 2 * n + 5 : 2 * (r + 1) + (r % 2 === 1 ? 3 : 0);

type Logo = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Live rest target (base + wobble). */
  restX: number;
  restY: number;
  /** Fixed rest spot for the current container size. */
  baseX: number;
  baseY: number;
  scale: number;
};

type Phase = "waiting" | "entering" | "idle";

/**
 * A "train" of logos with three behaviours, all driven from one rAF loop that
 * writes transforms straight to the DOM (no React re-renders):
 *
 * - **Entrance** — the first time the section scrolls into view, the logos pop
 *   out of the centre one by one (scale 0 → 1.5 → 1, easeOutBack) onto their
 *   rest spots.
 * - **Gather** — while the cursor moves inside, the logos snake after it:
 *   ranks are dealt by distance (closest leads) and rank r lerps toward the
 *   trail sample r × TRAIL_GAP frames old, so the chain replays the path and
 *   piles into a stack when the cursor rests.
 * - **Release** — a click (or lifting a finger) lets go: every logo springs
 *   from wherever it is back to its rest spot with a damped overshoot, then
 *   breathes gently (each target wobbles ±10px every 2s). The next real
 *   cursor move gathers them again.
 *
 * Rest spots come from a seeded jittered grid so the spread is the same on
 * every visit and scales with the container.
 */
export function LogoTrain({ items }: { items: TrainSkill[] }) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const logos = useRef<Logo[]>(
    items.map(() => ({
      x: 0, y: 0, vx: 0, vy: 0, restX: 0, restY: 0, baseX: 0, baseY: 0, scale: 0,
    })),
  );
  const layout = useRef<Array<{ u: number; v: number }>>([]);
  const size = useRef({ w: 0, h: 0 });

  const phase = useRef<Phase>("waiting");
  const enterT0 = useRef(0);

  const cursor = useRef({ x: 0, y: 0, active: false });
  /** True once released (click) until the cursor genuinely moves again. */
  const released = useRef(false);
  const releaseOrigin = useRef({ x: 0, y: 0 });

  const trail = useRef<Array<{ x: number; y: number }>>([]);
  /** rank -> logo index while gathering. Empty = re-deal on next step. */
  const order = useRef<number[]>([]);
  const zDirty = useRef(false);

  const acc = useRef(0);
  const wobbleAcc = useRef(0);

  /** Scale the normalised layout to the container; keep entrance/rest in sync. */
  const applyLayout = (w: number, h: number) => {
    size.current = { w, h };
    const n = items.length;
    if (layout.current.length !== n) layout.current = buildLayout(n, Math.max(w / Math.max(h, 1), 0.2));
    const iw = Math.max(w - EDGE * 2, 1);
    const ih = Math.max(h - EDGE * 2, 1);
    for (let i = 0; i < n; i++) {
      const L = logos.current[i];
      const { u, v } = layout.current[i];
      L.baseX = EDGE + u * iw;
      L.baseY = EDGE + v * ih;
      L.restX = L.baseX;
      L.restY = L.baseY;
    }
  };

  // Size tracking + entrance trigger.
  useEffect(() => {
    if (reduceMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) applyLayout(width, height);
    });
    ro.observe(el);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase.current === "waiting") {
          phase.current = "entering";
          enterT0.current = -1; // stamped from the rAF clock on its first frame
          released.current = true; // land in the resting (spread) state
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, items.length]);

  /** One fixed simulation step. */
  const step = () => {
    const G = logos.current;
    const cur = cursor.current;

    if (cur.active && !released.current) {
      // Gather: record the cursor and snake the chain after it.
      const tr = trail.current;
      tr.push({ x: cur.x, y: cur.y });
      if (tr.length > G.length * TRAIL_GAP + TRAIL_SLACK) tr.shift();

      if (order.current.length === 0) {
        order.current = G.map((L, i) => ({ i, d: Math.hypot(L.x - cur.x, L.y - cur.y) }))
          .sort((a, b) => a.d - b.d)
          .map((o) => o.i);
        zDirty.current = true;
      }
      const ord = order.current;
      for (let r = 0; r < ord.length; r++) {
        const idx = tr.length - 1 - r * TRAIL_GAP;
        if (idx < 0) continue; // its moment hasn't come — hold still
        const L = G[ord[r]];
        const s = tr[idx];
        L.x = lerp(L.x, s.x, FOLLOW);
        L.y = lerp(L.y, s.y, FOLLOW);
        L.vx = 0;
        L.vy = 0;
      }
    } else if (released.current) {
      // Release: damped spring toward the (wobbling) rest spot, with a soft
      // wall at the container edges so overshoots bounce instead of escaping.
      const { w, h } = size.current;
      for (const L of G) {
        L.vx += (L.restX - L.x) * SPRING;
        L.vy += (L.restY - L.y) * SPRING;
        L.vx *= DAMPING;
        L.vy *= DAMPING;
        L.x += L.vx;
        L.y += L.vy;
        if (L.x < WALL) {
          L.x = WALL;
          L.vx *= -WALL_BOUNCE;
        } else if (L.x > w - WALL) {
          L.x = w - WALL;
          L.vx *= -WALL_BOUNCE;
        }
        if (L.y < WALL) {
          L.y = WALL;
          L.vy *= -WALL_BOUNCE;
        } else if (L.y > h - WALL) {
          L.y = h - WALL;
          L.vy *= -WALL_BOUNCE;
        }
      }
      wobbleAcc.current += STEP_MS;
      if (wobbleAcc.current > WOBBLE_MS) {
        wobbleAcc.current = 0;
        for (const L of G) {
          L.restX = L.baseX + (Math.random() * 2 - 1) * WOBBLE_PX;
          L.restY = L.baseY + (Math.random() * 2 - 1) * WOBBLE_PX;
        }
      }
    }
    // Otherwise (pointer left mid-gather): hold still.
  };

  useAnimationFrame((time, delta) => {
    if (reduceMotion) return;
    const G = logos.current;
    const n = G.length;
    const { w, h } = size.current;
    if (w === 0 || h === 0) return;

    if (phase.current === "entering") {
      // Pop out of the centre one by one onto the rest spots. `time` is
      // framer's frame clock (ms since mount), so the start is stamped here
      // rather than from performance.now().
      if (enterT0.current < 0) enterT0.current = time;
      const cx = w / 2;
      const cy = h / 2;
      const elapsed = time - enterT0.current;
      let done = true;
      for (let i = 0; i < n; i++) {
        const t0 = elapsed - i * ENTER_STAGGER_MS;
        if (t0 < 0) {
          done = false;
          continue;
        }
        const k = Math.min(t0 / ENTER_MS, 1);
        if (k < 1) done = false;
        const e = easeOutBack(k);
        const L = G[i];
        L.x = lerp(cx, L.baseX, e);
        L.y = lerp(cy, L.baseY, e);
        L.scale = k < 0.5 ? lerp(0, 1.5, k * 2) : lerp(1.5, 1, (k - 0.5) * 2);
      }
      if (done) {
        phase.current = "idle";
        for (const L of G) {
          L.x = L.baseX;
          L.y = L.baseY;
          L.scale = 1;
          L.vx = 0;
          L.vy = 0;
        }
      }
    } else if (phase.current === "idle") {
      acc.current += Math.min(delta, 250);
      let steps = 0;
      while (acc.current >= STEP_MS && steps < MAX_STEPS) {
        step();
        acc.current -= STEP_MS;
        steps++;
      }
      if (steps === MAX_STEPS) acc.current = 0;
    } else {
      return; // waiting for the section to scroll into view
    }

    if (zDirty.current) {
      zDirty.current = false;
      const ord = order.current;
      for (let r = 0; r < ord.length; r++) {
        const el = nodeRefs.current[ord[r]];
        if (el) el.style.zIndex = String(zForRank(r, n));
      }
    }

    for (let i = 0; i < n; i++) {
      const el = nodeRefs.current[i];
      if (!el) continue;
      const L = G[i];
      el.style.transform = `translate3d(${L.x}px, ${L.y}px, 0) translate(-50%, -50%) scale(${L.scale})`;
    }
  });

  /** Cursor moved inside: gather (unless it's just the click's own jitter). */
  const onMove = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    cursor.current.x = clamp(x, EDGE, rect.width - EDGE);
    cursor.current.y = clamp(y, EDGE, rect.height - EDGE);
    cursor.current.active = true;
    if (released.current) {
      const moved = Math.hypot(x - releaseOrigin.current.x, y - releaseOrigin.current.y);
      if (moved < REGATHER_MOVE_PX) return;
      released.current = false;
      trail.current = [];
      order.current = [];
    }
  };

  /** Click / finger lifted: let the train go. */
  const release = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      releaseOrigin.current.x = clientX - rect.left;
      releaseOrigin.current.y = clientY - rect.top;
    }
    cursor.current.active = false;
    released.current = true;
    trail.current = [];
    order.current = [];
    wobbleAcc.current = 0;
  };

  // Reduced motion: a calm centred wrap of the logos.
  if (reduceMotion) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        {items.map((item) => (
          <span
            key={`${item.category}-${item.skill.name}`}
            className="flex items-center justify-center rounded-2xl border border-border bg-background p-2.5 shadow-sm sm:p-3"
          >
            <SkillIcon name={item.skill.icon} className="size-10 sm:size-14" />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={(e) => onMove(e.clientX, e.clientY)}
      onPointerUp={(e) => release(e.clientX, e.clientY)}
      onPointerLeave={() => {
        // Leaving mid-gather freezes the chain where it is; a released spread
        // keeps breathing. Either way the next move inside picks it back up.
        cursor.current.active = false;
        trail.current = [];
        order.current = [];
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
          style={{ zIndex: zForRank(i, items.length), transform: "scale(0)" }}
          className="pointer-events-none absolute top-0 left-0 [will-change:transform]"
        >
          <span className="flex items-center justify-center rounded-2xl border border-border bg-background p-2.5 shadow-md sm:p-3">
            <SkillIcon name={item.skill.icon} className="size-10 sm:size-14" />
          </span>
        </span>
      ))}
    </div>
  );
}

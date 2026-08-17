"use client";

import { useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";

import type { Skill } from "@/types";
import { SkillIcon } from "@/components/shared/skill-icon";

export type TrainSkill = { skill: Skill; category: string };

/**
 * Time gap between carriages. Carriage rank `r` chases the point the cursor
 * occupied `r * DELAY_MS` ago, so the train replays the cursor's path —
 * spacing stretches when the mouse moves fast and bunches when it slows, and
 * the whole snake piles back into a stack once the cursor rests.
 *
 * Ranks are a *mapping*, not the item order: at mount the chain runs in
 * reverse (the last logo leads), and every regather re-deals the ranks by
 * distance to the cursor — see `order`. After a scatter this same delay is
 * the launch stagger: rank r's slot exists r * DELAY_MS after the wake, so
 * the logos come home one by one, closest first.
 */
const DELAY_MS = 110;

/** Ease toward the delayed target while trailing, normalised to a 60fps
 *  frame. Lower = calmer, silkier trail; higher = sharper corners. */
const FOLLOW = 0.17;

/** How long the click-burst journey takes, per logo (ms). Each logo gets a
 *  touch of random variance so the burst shimmers instead of moving as one
 *  rigid sheet. */
const SCATTER_MS = 900;

/** How long the pull into the cursor takes on a click (ms), before the burst
 *  radiates back out from that exact point. */
const GATHER_MS = 340;

/** How long a logo's journey back from its scattered spot to the train
 *  takes (ms), once its turn in the queue comes up. */
const REGATHER_MS = 700;

/** Minimum distance (px) every scatter destination keeps from the click
 *  point, so the burst always pushes the logos clear of the cursor instead
 *  of parking one on top of it. */
const SPREAD_CLEAR_PX = 170;

/**
 * Shape of the regather journeys: 0 = constant speed, towards 1 =
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

/** How far (px) the cursor must travel after a scatter click before the
 *  train wakes up and regathers — filters out the micro-jitter of the click
 *  itself so the burst doesn't instantly un-scatter. */
const REGATHER_MOVE_PX = 14;

/** Milliseconds of cursor history to retain beyond the deepest delay. */
const HISTORY_SLACK = 1000;

/** Per-logo animation modes. */
const M_FOLLOW = 0; // trailing the delayed cursor history
const M_BURST = 1; // journeying out to its scattered spot
const M_PINNED = 2; // parked at its scattered spot, waiting for its slot
const M_REJOIN = 3; // journeying from the scattered spot back to the train
const M_GATHER = 4; // being pulled into the cursor before a fresh burst

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

/** Fast → slow → fast, smooth everywhere: e(t) = t + A·sin(2πt)/2π. */
const journeyEase = (t: number) =>
  t + (MID_SLOWDOWN * Math.sin(2 * Math.PI * t)) / (2 * Math.PI);

/** Damped-spring response for the click-burst: flies out fast, overshoots
 *  its destination (~20%), and wobbles back to rest like a medium-strength
 *  spring — the higher frequency makes the recoil read clearly but settle
 *  fast. The 3.5π frequency puts t=1 exactly on a cosine zero crossing, so
 *  e(1) = 1 and the settle branch is a true no-op (no end-of-wobble snap). */
const burstEase = (t: number) =>
  1 - Math.exp(-5.5 * t) * Math.cos(3.5 * Math.PI * t);

/** Smooth pull for the gather-to-cursor phase (smoothstep). */
const gatherEase = (t: number) => t * t * (3 - 2 * t);

/** Hard cap (px) on how far past its destination a bouncing logo may
 *  overshoot, so long flings still bounce but never sail over the heading
 *  or out of the section. Must stay <= EDGE minus the plate half-extent
 *  (~41px at the sm size) so a bounce at the padded boundary can never
 *  cross the container edge. */
const BOUNCE_MAX_PX = 22;

/**
 * Stacking for carriage rank r of n. Base z RISES from the head (leading the
 * cursor, bottom-most of the stack) to the tail (top-most, arriving last),
 * and every second carriage gets a small boost so it pops above BOTH of its
 * neighbours — an over-under weave. The tail is pinned strictly highest so
 * the weave boost can never lift its neighbour over the final, last-arriving
 * carriage.
 */
const zForRank = (r: number, n: number) =>
  r === n - 1 ? 2 * n + 5 : 2 * (r + 1) + (r % 2 === 1 ? 3 : 0);

type Sample = { x: number; y: number; t: number };

/**
 * A "train" of logos that replays the cursor's path. Every frame the (clamped)
 * pointer position is pushed into a history buffer; the carriage holding rank
 * `r` eases toward the sample from `r * DELAY_MS` ago. Because a carriage
 * with no sample old enough simply stays put, the logos peel out of the stack
 * one by one when the cursor takes off, and rejoin one by one after a scatter.
 *
 * Click to fling the logos outward from the cursor to jittered spots across
 * the section (never above the heading). Every click first pulls the logos
 * into the cursor (M_GATHER, a quick smoothstep suction), then bursts them
 * out from that exact point — so a second click at a new spot visibly
 * re-originates the spread there. Each burst is a damped-spring tween
 * (burstEase): it shoots out, overshoots its landing spot (~18%, capped),
 * and bounces back to rest.
 *
 * The logos stay scattered until the cursor genuinely moves again
 * (REGATHER_MOVE_PX filters the click's own jitter). That move re-deals the
 * ranks by distance — closest logo becomes the head, farthest the tail — so
 * the launch queue and the train slots are one and the same: rank r's slot
 * exists r * DELAY_MS after the wake, and each logo flies straight onto its
 * own live slot in the re-forming train (the stack itself while the cursor
 * rests) on a fast–slow–fast journey. Closest first, one by one, no parking.
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

  // rank -> logo index. order[0] is the head. Starts as the reversed item
  // order (last logo leads) and is re-dealt by cursor distance on every
  // regather, so "closest comes home first" and "slot r opens at r * delay"
  // describe the same queue.
  const order = useRef(items.map((_, r) => items.length - 1 - r));
  // Set when `order` changes so the z-weave is rewritten to follow the new
  // chain before the next paint.
  const zDirty = useRef(false);

  // Where the cursor was when the scatter click landed, so we can tell a
  // real wake-up move from the click's own micro-jitter.
  const scatterOrigin = useRef({ x: 0, y: 0 });

  // The click point every gather journey pulls into and every burst radiates
  // from.
  const gatherPoint = useRef({ x: 0, y: 0 });

  // Per-logo journey state (modes above). Journeys interpolate from a frozen
  // start point so their pacing is fully under journeyEase's control.
  const mode = useRef(items.map(() => M_FOLLOW));
  const journeyFrom = useRef(items.map(() => ({ x: 0, y: 0 })));
  const journeyT0 = useRef(items.map(() => 0));
  const journeyDur = useRef(items.map(() => 0));

  // Last frame timestamp, so pointer handlers share the animation clock.
  const clock = useRef(0);

  /** Fling every logo to a shuffled, jittered grid cell inside the padded
   *  area, so the burst covers the whole section but looks random. Cells
   *  landing inside SPREAD_CLEAR_PX of the click point (ox, oy) are pushed
   *  radially out of it, so the spread always leaves the cursor clear. */
  const buildScatter = (ox: number, oy: number) => {
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
      let x = clamp(cells[i].x + (Math.random() - 0.5) * jx, EDGE, rect.width - EDGE);
      let y = clamp(cells[i].y + (Math.random() - 0.5) * jy, EDGE, rect.height - EDGE);
      const dx = x - ox;
      const dy = y - oy;
      const d = Math.hypot(dx, dy);
      if (d < SPREAD_CLEAR_PX) {
        if (d < 1) {
          // Degenerate: the cell sits on the click point — pick a spoke.
          const a = (i / n) * Math.PI * 2;
          x = ox + Math.cos(a) * SPREAD_CLEAR_PX;
          y = oy + Math.sin(a) * SPREAD_CLEAR_PX;
        } else {
          x = ox + (dx / d) * SPREAD_CLEAR_PX;
          y = oy + (dy / d) * SPREAD_CLEAR_PX;
        }
        x = clamp(x, EDGE, rect.width - EDGE);
        y = clamp(y, EDGE, rect.height - EDGE);
      }
      scatterTo.current[i].x = x;
      scatterTo.current[i].y = y;
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

    // One backwards walk serves every carriage: delays grow with rank, so
    // the cursor `j` only ever moves toward older samples.
    let j = hist.length - 1;
    for (let r = 0; r < n; r++) {
      const i = order.current[r];
      // Delayed history sample for this carriage, if one old enough exists.
      let hasSample = false;
      let sx = 0;
      let sy = 0;
      if (!spread.current && hist.length > 0) {
        const wantT = time - r * DELAY_MS;
        while (j >= 0 && hist[j].t > wantT) j--;
        if (j >= 0) {
          hasSample = true;
          sx = hist[j].x;
          sy = hist[j].y;
        }
      }

      const m = mode.current[i];

      if (m === M_GATHER) {
        // Suction into the click point; on arrival, flip straight into the
        // burst so the spread visibly radiates from the cursor itself.
        const k = clamp((time - journeyT0.current[i]) / journeyDur.current[i], 0, 1);
        const e = gatherEase(k);
        pts[i].x = journeyFrom.current[i].x + (gatherPoint.current.x - journeyFrom.current[i].x) * e;
        pts[i].y = journeyFrom.current[i].y + (gatherPoint.current.y - journeyFrom.current[i].y) * e;
        if (k >= 1) {
          mode.current[i] = M_BURST;
          journeyFrom.current[i].x = gatherPoint.current.x;
          journeyFrom.current[i].y = gatherPoint.current.y;
          journeyT0.current[i] = time;
          // Slight variance so the sheet of logos doesn't move in lockstep.
          journeyDur.current[i] = SCATTER_MS * (0.85 + Math.random() * 0.3);
        }
      } else if (m === M_BURST) {
        const k = clamp((time - journeyT0.current[i]) / journeyDur.current[i], 0, 1);
        if (k >= 1) {
          // Wobble finished: settle exactly on the destination. If the wake
          // move already fired while this logo was still in flight
          // (click-then-drag), its slot may even exist already — M_PINNED
          // hands it into the queue on the very next frame.
          pts[i].x = scatterTo.current[i].x;
          pts[i].y = scatterTo.current[i].y;
          mode.current[i] = M_PINNED;
        } else {
          const jdx = scatterTo.current[i].x - journeyFrom.current[i].x;
          const jdy = scatterTo.current[i].y - journeyFrom.current[i].y;
          let e = burstEase(k);
          if (e > 1) {
            // Springy landing: cap the overshoot in pixels so long flings
            // bounce too, without sailing far past their landing spot.
            const dist = Math.hypot(jdx, jdy) || 1;
            e = 1 + Math.min((e - 1) * dist, BOUNCE_MAX_PX) / dist;
          }
          pts[i].x = journeyFrom.current[i].x + jdx * e;
          pts[i].y = journeyFrom.current[i].y + jdy * e;
        }
      } else if (m === M_PINNED) {
        // Parked. The moment this carriage's slot in the history exists,
        // its turn has come: ranks were dealt by distance at the wake, so
        // slots open closest-first, one every DELAY_MS. Launch home.
        if (hasSample) {
          mode.current[i] = M_REJOIN;
          journeyFrom.current[i].x = pts[i].x;
          journeyFrom.current[i].y = pts[i].y;
          journeyT0.current[i] = time;
          journeyDur.current[i] = REGATHER_MS;
        }
      } else if (m === M_REJOIN) {
        // Homing tween onto this carriage's *live* slot in the re-forming
        // train — the stack itself while the cursor rests, a point on the
        // replayed path once it moves. The slot exists for as long as the
        // history does; if a pointer-leave wipes the history mid-flight,
        // park where we are and let M_PINNED relaunch when it returns.
        if (!hasSample) {
          mode.current[i] = M_PINNED;
        } else {
          const k = clamp((time - journeyT0.current[i]) / journeyDur.current[i], 0, 1);
          const e = journeyEase(k);
          pts[i].x = journeyFrom.current[i].x + (sx - journeyFrom.current[i].x) * e;
          pts[i].y = journeyFrom.current[i].y + (sy - journeyFrom.current[i].y) * e;
          if (k >= 1) mode.current[i] = M_FOLLOW;
        }
      } else if (hasSample) {
        // M_FOLLOW: trail the delayed cursor history. No sample old enough
        // (fresh buffer) means hold still until this carriage's moment comes.
        pts[i].x += (sx - pts[i].x) * follow;
        pts[i].y += (sy - pts[i].y) * follow;
      }
    }

    if (zDirty.current) {
      zDirty.current = false;
      for (let r = 0; r < n; r++) {
        const el = nodeRefs.current[order.current[r]];
        if (el) el.style.zIndex = String(zForRank(r, n));
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
      onPointerMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        target.current.x = x;
        target.current.y = y;
        // A genuine move after a scatter click wakes the train back up. The
        // distance gate ignores the click's own jitter. Waking re-deals the
        // ranks by distance to the cursor — closest logo becomes the head —
        // then restarts the path, so the slot queue brings them home
        // closest-first, one every DELAY_MS.
        if (spread.current) {
          const dx = x - scatterOrigin.current.x;
          const dy = y - scatterOrigin.current.y;
          if (Math.hypot(dx, dy) > REGATHER_MOVE_PX) {
            spread.current = false;
            history.current.length = 0;
            const pts = points.current;
            order.current.sort(
              (a, b) =>
                Math.hypot(pts[a].x - x, pts[a].y - y) -
                Math.hypot(pts[b].x - x, pts[b].y - y),
            );
            zDirty.current = true;
          }
        }
      }}
      onPointerDown={(e) => {
        // Stamp the origin from the event itself: on touch (or after a
        // scroll under a stationary cursor) no pointermove precedes the tap,
        // so target.current would be stale and the wake gate would fire on
        // the click's own jitter.
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          target.current.x = e.clientX - rect.left;
          target.current.y = e.clientY - rect.top;
        }
        spread.current = true;
        scatterOrigin.current.x = target.current.x;
        scatterOrigin.current.y = target.current.y;
        // Every click re-originates the spread at the cursor: pull each logo
        // into the click point first (gather), then burst out from it. Works
        // identically for the first click (the stacked train is already at
        // the cursor, so the gather is near-instant) and for re-clicks from
        // anywhere on screen — no drift, journeys are absolute.
        gatherPoint.current.x = clamp(
          target.current.x,
          EDGE,
          (rect?.width ?? 0) - EDGE,
        );
        gatherPoint.current.y = clamp(
          target.current.y,
          EDGE,
          (rect?.height ?? 0) - EDGE,
        );
        buildScatter(gatherPoint.current.x, gatherPoint.current.y);
        for (let i = 0; i < items.length; i++) {
          mode.current[i] = M_GATHER;
          journeyFrom.current[i].x = points.current[i].x;
          journeyFrom.current[i].y = points.current[i].y;
          journeyT0.current[i] = clock.current;
          // Slight variance so the pull doesn't move as one rigid sheet.
          journeyDur.current[i] = GATHER_MS * (0.9 + Math.random() * 0.2);
        }
      }}
      onPointerLeave={() => {
        // Mid-float, leaving just resets the path. A scattered burst stays
        // exactly where it is until the cursor comes back and moves.
        if (!spread.current) history.current.length = 0;
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
          // Initial z-weave for the mount-time reversed chain (item i holds
          // rank n-1-i). Rewritten from the rAF whenever the ranks are
          // re-dealt — see zForRank.
          style={{ zIndex: zForRank(items.length - 1 - i, items.length) }}
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
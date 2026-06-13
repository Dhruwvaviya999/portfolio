"use client";

import { m } from "framer-motion";

/**
 * Mobile / no-WebGL / reduced-motion fallback: a lightweight animated SVG
 * mascot instead of the full 3D scene. Theme-aware for free — it reads the
 * `--robot-*` CSS variables (defined per theme in globals.css), so it recolors
 * with the page and never reads the theme in JS (no hydration issues).
 *
 * The gentle float + eye pulse use Framer Motion; both collapse automatically
 * for users who prefer reduced motion (global MotionConfig).
 */
export function RobotFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <m.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-40 max-w-[60%]"
      >
        <svg
          viewBox="0 0 200 240"
          className="h-auto w-full"
          role="img"
          aria-label="Robot mascot"
        >
          {/* Antenna */}
          <line
            x1="100"
            y1="40"
            x2="100"
            y2="18"
            stroke="var(--robot-joint)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="100" cy="14" r="7" fill="var(--robot-eye)" />

          {/* Head */}
          <rect
            x="55"
            y="38"
            width="90"
            height="70"
            rx="20"
            fill="var(--robot-body)"
            stroke="var(--robot-joint)"
            strokeWidth="2"
          />
          {/* Visor */}
          <rect x="66" y="55" width="68" height="36" rx="14" fill="var(--robot-joint)" />
          {/* Eyes */}
          <m.circle
            cx="86"
            cy="73"
            r="7"
            fill="var(--robot-eye)"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <m.circle
            cx="114"
            cy="73"
            r="7"
            fill="var(--robot-eye)"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Torso */}
          <rect
            x="60"
            y="116"
            width="80"
            height="80"
            rx="22"
            fill="var(--robot-body)"
            stroke="var(--robot-joint)"
            strokeWidth="2"
          />
          {/* Chest panel */}
          <rect x="84" y="134" width="32" height="30" rx="8" fill="var(--robot-body-accent)" />

          {/* Arms */}
          <rect
            x="36"
            y="120"
            width="18"
            height="60"
            rx="9"
            fill="var(--robot-body)"
            stroke="var(--robot-joint)"
            strokeWidth="2"
          />
          <rect
            x="146"
            y="120"
            width="18"
            height="60"
            rx="9"
            fill="var(--robot-body)"
            stroke="var(--robot-joint)"
            strokeWidth="2"
          />

          {/* Legs */}
          <rect x="78" y="196" width="16" height="34" rx="8" fill="var(--robot-body)" />
          <rect x="106" y="196" width="16" height="34" rx="8" fill="var(--robot-body)" />
        </svg>
      </m.div>
    </div>
  );
}

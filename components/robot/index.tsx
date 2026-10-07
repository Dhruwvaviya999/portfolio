"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import { HandControl } from "./HandControl";
import { createHandState, type HandState } from "./hand-state";
import { RobotFallback } from "./RobotFallback";
import { RobotLoader } from "./RobotLoader";

/**
 * Public entry point for the robot system.
 *
 * Orchestrates: lazy-loading the heavy 3D scene (`dynamic`, `ssr:false` — three
 * never server-renders and isn't in the initial bundle), capability gating, and
 * the off-screen render pause.
 *
 * IMPORTANT: the heavy modules (RobotCanvas / RobotControls / RobotModel) are
 * intentionally NOT re-exported here — they're reached only through the dynamic
 * import, which is what keeps three.js out of any consumer's bundle.
 */
const RobotCanvas = dynamic(() => import("./RobotCanvas"), {
  ssr: false,
  loading: () => <RobotLoader />,
});

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

type Mode = "pending" | "canvas" | "fallback";

/**
 * Decorative robot mascot. Renders the full 3D scene on every capable device
 * (phones included, so mobile matches desktop), and falls back to a lightweight
 * animated SVG only without WebGL or when the user prefers reduced motion.
 * The 3D scene also gets an opt-in webcam hand-control toggle (`HandControl`).
 * Size it via `className` on the consumer side.
 */
export function Robot({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [inView, setInView] = useState(true);
  // Shared by the (dynamically loaded) scene and the webcam hook; mutated per
  // frame, never set as state.
  const hand = useRef<HandState>(createHandState());

  // Capability detection (client-only) — runs after mount to avoid any
  // hydration mismatch; re-evaluates if the motion preference flips.
  useEffect(() => {
    const motionMql = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => {
      const useFallback = motionMql.matches || !supportsWebGL();
      setMode(useFallback ? "fallback" : "canvas");
    };

    evaluate();
    motionMql.addEventListener("change", evaluate);
    return () => motionMql.removeEventListener("change", evaluate);
  }, []);

  // Pause the render loop while off-screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div ref={containerRef} className="h-full w-full" aria-hidden="true">
        {mode === "pending" && <RobotLoader />}
        {mode === "fallback" && <RobotFallback />}
        {mode === "canvas" && <RobotCanvas active={inView} hand={hand} />}
      </div>
      {/* Outside the aria-hidden box so the toggle stays reachable. Only with
          the 3D scene — the SVG fallback has nothing to drive. */}
      {mode === "canvas" && <HandControl hand={hand} />}
    </div>
  );
}

// Public, lightweight exports only (no three.js).
export { RobotFallback } from "./RobotFallback";
export { RobotLoader } from "./RobotLoader";

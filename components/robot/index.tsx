"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
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
 * Size it via `className` on the consumer side.
 */
export function Robot({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [inView, setInView] = useState(true);

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
    <div
      ref={containerRef}
      className={cn("relative h-full w-full", className)}
      aria-hidden="true"
    >
      {mode === "pending" && <RobotLoader />}
      {mode === "fallback" && <RobotFallback />}
      {mode === "canvas" && <RobotCanvas active={inView} />}
    </div>
  );
}

// Public, lightweight exports only (no three.js).
export { RobotFallback } from "./RobotFallback";
export { RobotLoader } from "./RobotLoader";

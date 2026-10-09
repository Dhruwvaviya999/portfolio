"use client";

import { createContext, use, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";

import { createHandState, type HandState } from "./hand-state";
import { useHandTracking } from "./use-hand-tracking";

/**
 * Hand control spans the layout: the toggle sits in the navbar, while the
 * camera preview and the robot it drives sit in the hero. So the webcam
 * session lives here, in the root providers, and is shared with both.
 *
 * Two contexts: the robot only needs stable handles (the per-frame hand ref,
 * a ref for its root, a way to report its mode), so it doesn't re-render its
 * WebGL scene every time the recognised gesture changes.
 */

/** How the robot renders. Only the 3D scene can be driven by hand. */
export type RobotMode = "pending" | "canvas" | "fallback";

interface RobotBinding {
  /** Written every processed frame by the tracker, read by the scene. */
  hand: RefObject<HandState>;
  /** The robot's root element, scrolled into view when tracking starts. */
  robotRef: RefObject<HTMLDivElement | null>;
  setRobotMode: (mode: RobotMode) => void;
}

type HandControl = ReturnType<typeof useHandTracking> & {
  robotMode: RobotMode;
  robotRef: RefObject<HTMLDivElement | null>;
};

const RobotBindingContext = createContext<RobotBinding | null>(null);
const HandControlContext = createContext<HandControl | null>(null);

export function HandControlProvider({ children }: { children: ReactNode }) {
  const hand = useRef<HandState>(createHandState());
  const robotRef = useRef<HTMLDivElement>(null);
  const [robotMode, setRobotMode] = useState<RobotMode>("pending");
  const tracking = useHandTracking(hand);

  const binding = useMemo(() => ({ hand, robotRef, setRobotMode }), []);

  return (
    <RobotBindingContext value={binding}>
      <HandControlContext value={{ ...tracking, robotMode, robotRef }}>
        {children}
      </HandControlContext>
    </RobotBindingContext>
  );
}

/** For the robot itself — stable, never triggers a re-render. */
export function useRobotBinding(): RobotBinding {
  const value = use(RobotBindingContext);
  if (!value) throw new Error("useRobotBinding must be used inside <HandControlProvider>");
  return value;
}

/** Tracking status, gesture and controls, for the toggle and the preview. */
export function useHandControl(): HandControl {
  const value = use(HandControlContext);
  if (!value) throw new Error("useHandControl must be used inside <HandControlProvider>");
  return value;
}

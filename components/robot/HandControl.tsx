"use client";

import { useEffect } from "react";
import { Camera, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { HandGesture } from "./hand-state";
import { useHandControl } from "./hand-control-context";
import type { HandTrackingStatus } from "./use-hand-tracking";

const GESTURE_LABEL: Record<HandGesture, string> = {
  none: "👋 ✊ 👍 ✌️",
  open: "👋 wave",
  fist: "✊ turn",
  thumb_up: "👍 jump",
  thumb_down: "👎 aww",
  victory: "✌️ spin",
  point: "☝️",
  love: "🤟 hi!",
};

const BUTTON_TITLE: Record<HandTrackingStatus, string> = {
  idle: "Control the robot with your hand (runs on your device — the camera feed never leaves your browser)",
  camera: "Waiting for camera access…",
  model: "Loading hand tracking…",
  active: "Stop hand control",
};

/**
 * Navbar toggle for webcam hand control, icon-only next to the terminal
 * button. The navbar only renders it on the page that has the robot; it hides
 * itself if the camera can't be used or the robot fell back to the static SVG
 * (nothing to drive).
 */
export function HandControlButton() {
  const { status, supported, toggle, robotMode, robotRef } = useHandControl();

  if (supported === false || robotMode === "fallback") return null;

  const active = status === "active";
  const loading = status === "camera" || status === "model";

  const onClick = () => {
    // The scene isn't mounted yet (first frame after hydration).
    if (robotMode !== "canvas") return;
    // The navbar stays put while the hero scrolls away; bring the robot and
    // its camera preview back into view when switching on.
    if (status === "idle") robotRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    toggle();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={loading}
      aria-label="Control the robot with your hand"
      aria-pressed={active}
      aria-busy={loading}
      title={BUTTON_TITLE[status]}
      className="aria-pressed:bg-muted aria-pressed:text-brand"
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Camera className="size-4" />}
    </Button>
  );
}

/**
 * The robot-side half of hand control: while active, a small mirrored preview
 * (top-right) of what the recognizer sees plus the gesture it currently reads;
 * errors bottom-right. Rendered outside the robot's `aria-hidden` box so the
 * preview and errors stay reachable for assistive tech.
 */
export function HandPreview() {
  const { status, error, supported, gesture, tracking, videoRef, stop } = useHandControl();

  // Release the camera when the robot (and this <video>) goes away.
  useEffect(() => stop, [stop]);

  // Unknown until mounted (never rendered on the server).
  if (supported === null) return null;
  if (!supported) {
    // Camera APIs need a secure context. Production is HTTPS; this only
    // bites when testing on a phone over plain http://<lan-ip>.
    return process.env.NODE_ENV === "development" ? (
      <p className="absolute right-0 bottom-0 max-w-[60%] text-right text-xs text-muted-foreground">
        Hand control needs HTTPS — run <code className="font-mono">pnpm dev:https</code>
      </p>
    ) : null;
  }

  const active = status === "active";

  return (
    <>
      {/* Preview, top-right: the one corner the robot's head doesn't reach.
          Stays in the DOM (visibility, not display) so the <video> keeps
          decoding while hidden — iOS won't feed frames from a display:none
          video. Mirrored like a selfie so moving right feels like right. */}
      <div
        className={cn(
          "absolute top-0 right-0 overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/10",
          active ? "visible" : "invisible",
        )}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          aria-label="Camera preview for hand tracking"
          className="h-15 w-20 -scale-x-100 object-cover sm:h-20 sm:w-27"
        />
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1.5 left-1.5 size-2 rounded-full",
            tracking ? "bg-emerald-500" : "bg-muted-foreground/60",
          )}
        />
        <span
          aria-live="polite"
          className="absolute inset-x-0 bottom-0 truncate bg-background/75 px-1 py-0.5 text-center font-mono text-[10px] text-foreground backdrop-blur-sm"
        >
          {tracking ? GESTURE_LABEL[gesture] : "no hand"}
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="absolute right-0 bottom-0 max-w-[70%] text-right text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </>
  );
}

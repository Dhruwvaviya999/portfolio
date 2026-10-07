"use client";

import type { RefObject } from "react";
import { CameraOff, Hand, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { HandGesture, HandState } from "./hand-state";
import { useHandTracking, type HandTrackingStatus } from "./use-hand-tracking";

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

const BUTTON_LABEL: Record<HandTrackingStatus, string> = {
  idle: "Control with your hand",
  camera: "Allow camera…",
  model: "Loading model…",
  active: "Stop camera",
};

/**
 * Opt-in webcam control for the robot: a toggle button (bottom-right) and,
 * while active, a small mirrored preview (top-right) of what the recognizer
 * sees plus the gesture it currently reads. Rendered outside the robot's
 * `aria-hidden` box so the button stays reachable for assistive tech.
 */
export function HandControl({ hand }: { hand: RefObject<HandState> }) {
  const { status, error, supported, gesture, tracking, videoRef, toggle } = useHandTracking(hand);

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
  const loading = status === "camera" || status === "model";
  const label = BUTTON_LABEL[status];

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

      {/* Toggle, bottom-right. Icon-only on phones, where the square is small. */}
      <div className="absolute right-0 bottom-0 flex max-w-[70%] flex-col items-end gap-1.5">
        {error && (
          <p role="alert" className="text-right text-xs text-destructive">
            {error}
          </p>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggle}
          disabled={loading}
          aria-label={label}
          title="Runs on your device — the camera feed never leaves your browser"
          className="max-sm:size-8 max-sm:px-0"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : active ? (
            <CameraOff />
          ) : (
            <Hand />
          )}
          <span className="max-sm:hidden">{label}</span>
        </Button>
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group, type Mesh, type MeshStandardMaterial } from "three";
import type { HandGesture, HandState } from "./hand-state";
import { RobotModel, type RobotPalette } from "./RobotModel";

const HEAD_YAW = 0.45; // max head turn (rad)
const HEAD_PITCH = 0.28;
const FLOAT_AMP = 0.12;
const WAVE_INTERVAL = 7; // base seconds between waves
const WAVE_DURATION = 1.8;
const BLINK_INTERVAL = 4;
// Hand gestures (webcam)
const JUMP_DURATION = 0.6;
const JUMP_HEIGHT = 0.45;
const GRAB_SENSITIVITY = 2.6; // rad of yaw per unit of hand travel while fisted
const SPIN_TURN = Math.PI * 2;
const WAVE_REPEAT = 0.6; // pause between waves while a palm is held up

/** Frame-rate-independent exponential smoothing (damp), built on lerp. */
function damp(current: number, target: number, lambda: number, dt: number): number {
  return MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/**
 * Drives all robot motion from a single `useFrame` callback, mutating object
 * refs directly (no React state per frame → no re-renders):
 *
 * - idle: gentle float, subtle breathing scale, slow body sway
 * - head: smooth mouse tracking (global pointer)
 * - eyes: soft glow pulse + occasional blink
 * - arm: a small wave every few seconds
 * - hover: slight scale/glow reaction
 * - scroll: subtle forward tilt
 * - hand (optional webcam ref): the palm replaces the mouse for head
 *   tracking; open palm waves, thumbs-up jumps + glows, fist drags the yaw,
 *   victory spins a full turn, thumbs-down hangs the head and dims the eyes.
 *   One-shot gestures are edge-triggered off `gestureAt`, so holding one
 *   doesn't refire it every frame.
 *
 * Sign of head yaw/pitch is easily flipped if the tracking feels mirrored.
 */
export function RobotControls({
  palette,
  hand,
}: {
  palette: RobotPalette;
  hand?: RefObject<HandState>;
}) {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const eyes = useRef<Group>(null);
  const waveArm = useRef<Group>(null);

  const pointer = useRef({ x: 0, y: 0 });
  const hovered = useRef(false);
  const hoverFactor = useRef(0);
  const wave = useRef({ active: false, startedAt: 0, nextAt: WAVE_INTERVAL });
  const blink = useRef({ active: false, startedAt: 0, nextAt: BLINK_INTERVAL });
  // Hand-driven: body yaw on top of the idle sway (grab/spin), a one-shot
  // jump, and the last gesture timestamp we've reacted to.
  const yaw = useRef({ current: 0, target: 0 });
  const grabX = useRef<number | null>(null);
  const jump = useRef({ active: false, startedAt: 0 });
  const seenGestureAt = useRef(0);

  // Our own animation clock. R3F resets `clock.elapsedTime` to 0 whenever the
  // `frameloop` prop flips (we pause the loop off-screen), which would yank
  // `t` backwards past the timestamps stored in the blink/wave refs — a blink
  // caught mid-flight then extrapolates lerp(1, 0.1, negative) and stretches
  // the eyes into giant beams. Accumulating clamped deltas keeps t monotonic
  // and smooth across pauses, tab switches, and frameloop toggles.
  const localTime = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.05); // clamp to avoid jumps after tab switch
    localTime.current += dt;
    const t = localTime.current;

    // Hand input (webcam). Only consulted while a hand is in frame.
    const hs = hand?.current;
    const handActive = hs?.tracking === true;
    const gesture: HandGesture = hs && handActive ? hs.gesture : "none";
    const gestureChanged = !!hs && hs.gestureAt !== seenGestureAt.current;
    if (hs) seenGestureAt.current = hs.gestureAt;
    if (gestureChanged) {
      if (gesture === "victory") yaw.current.target += SPIN_TURN;
      if (gesture === "thumb_up" && !jump.current.active) {
        jump.current.active = true;
        jump.current.startedAt = t;
      }
      if (gesture === "open") wave.current.nextAt = Math.min(wave.current.nextAt, t);
    }
    // Fist: drag the robot around by its yaw, like a mouse drag.
    if (hs && handActive && gesture === "fist") {
      if (grabX.current !== null) yaw.current.target += (hs.x - grabX.current) * GRAB_SENSITIVITY;
      grabX.current = hs.x;
    } else {
      grabX.current = null;
    }
    yaw.current.current = damp(yaw.current.current, yaw.current.target, 8, dt);

    // Hover easing (thumbs-up / 🤟 borrow the same "excited" reaction)
    const excited = hovered.current || gesture === "thumb_up" || gesture === "love";
    hoverFactor.current = damp(hoverFactor.current, excited ? 1 : 0, 6, dt);
    const hf = hoverFactor.current;

    // Body: float + breathing + gentle idle sway (rotation is user-controlled
    // via OrbitControls, so no scroll tilt here).
    const j = jump.current;
    let jumpY = 0;
    if (j.active) {
      const p = (t - j.startedAt) / JUMP_DURATION;
      if (p >= 1) j.active = false;
      else jumpY = Math.sin(p * Math.PI) * JUMP_HEIGHT;
    }
    const g = root.current;
    if (g) {
      g.position.y = Math.sin(t * 1.2) * FLOAT_AMP + hf * 0.06 + jumpY;
      const breathe = 1 + Math.sin(t * 1.6) * 0.012 + hf * 0.03;
      g.scale.setScalar(breathe);
      g.rotation.z = Math.sin(t * 0.7) * 0.03;
      g.rotation.y = Math.sin(t * 0.4) * 0.05 + yaw.current.current;
    }

    // Head: follows the hand when one is in frame, else the mouse.
    // Thumbs-down hangs the head regardless.
    const px = hs && handActive ? hs.x : pointer.current.x;
    const py = hs && handActive ? hs.y : pointer.current.y;
    const pitch = gesture === "thumb_down" ? HEAD_PITCH * 1.3 : py * HEAD_PITCH;
    const h = head.current;
    if (h) {
      h.rotation.y = damp(h.rotation.y, px * HEAD_YAW, 4, dt);
      h.rotation.x = damp(h.rotation.x, pitch, 4, dt);
    }

    // Eyes: blink (vertical squash) + glow pulse
    const b = blink.current;
    if (!b.active && t > b.nextAt) {
      b.active = true;
      b.startedAt = t;
    }
    let blinkScale = 1;
    if (b.active) {
      const bt = t - b.startedAt;
      if (bt < 0.07) blinkScale = MathUtils.lerp(1, 0.1, bt / 0.07);
      else if (bt < 0.16) blinkScale = MathUtils.lerp(0.1, 1, (bt - 0.07) / 0.09);
      else {
        b.active = false;
        b.nextAt = t + BLINK_INTERVAL + Math.random() * 3;
      }
    }
    const ey = eyes.current;
    if (ey) {
      ey.scale.y = blinkScale;
      const mood = gesture === "thumb_down" ? 0.35 : 1; // dim when sad
      const glow =
        (palette.emissive * (1 + Math.sin(t * 2.5) * 0.18) + hf * palette.emissive * 0.5) * mood;
      for (const child of ey.children) {
        const mat = (child as Mesh).material as MeshStandardMaterial | undefined;
        if (mat) mat.emissiveIntensity = glow;
      }
    }

    // Arm: occasional wave
    const w = wave.current;
    if (!w.active && t > w.nextAt) {
      w.active = true;
      w.startedAt = t;
    }
    const arm = waveArm.current;
    if (arm) {
      const restZ = 0.12;
      let targetZ = restZ;
      if (w.active) {
        const p = (t - w.startedAt) / WAVE_DURATION;
        if (p >= 1) {
          w.active = false;
          // Keep waving back while a palm is held up; otherwise the usual idle gap.
          w.nextAt = gesture === "open" ? t + WAVE_REPEAT : t + WAVE_INTERVAL + Math.random() * 4;
        } else {
          const envelope = Math.sin(p * Math.PI); // 0 -> 1 -> 0
          const raised = MathUtils.lerp(restZ, 2.0, envelope);
          targetZ = raised + Math.sin(t * 12) * 0.18 * envelope; // wiggle while raised
        }
      }
      arm.rotation.z = damp(arm.rotation.z, targetZ, 10, dt);
    }
  });

  return (
    <RobotModel
      palette={palette}
      rootRef={root}
      headRef={head}
      eyesRef={eyes}
      waveArmRef={waveArm}
      onPointerOver={() => {
        hovered.current = true;
      }}
      onPointerOut={() => {
        hovered.current = false;
      }}
    />
  );
}

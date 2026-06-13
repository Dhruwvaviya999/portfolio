"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { RobotModel, type RobotPalette } from "./RobotModel";

const HEAD_YAW = 0.45; // max head turn (rad)
const HEAD_PITCH = 0.28;
const FLOAT_AMP = 0.12;
const WAVE_INTERVAL = 7; // base seconds between waves
const WAVE_DURATION = 1.8;
const BLINK_INTERVAL = 4;

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
 *
 * Sign of head yaw/pitch is easily flipped if the tracking feels mirrored.
 */
export function RobotControls({ palette }: { palette: RobotPalette }) {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const eyes = useRef<Group>(null);
  const waveArm = useRef<Group>(null);

  const pointer = useRef({ x: 0, y: 0 });
  const hovered = useRef(false);
  const hoverFactor = useRef(0);
  const scrollY = useRef(0);

  const wave = useRef({ active: false, startedAt: 0, nextAt: WAVE_INTERVAL });
  const blink = useRef({ active: false, startedAt: 0, nextAt: BLINK_INTERVAL });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05); // clamp to avoid jumps after tab switch

    // Hover easing
    hoverFactor.current = damp(hoverFactor.current, hovered.current ? 1 : 0, 6, dt);
    const hf = hoverFactor.current;

    // Body: float + breathing + sway + scroll tilt
    const g = root.current;
    if (g) {
      g.position.y = Math.sin(t * 1.2) * FLOAT_AMP + hf * 0.06;
      const breathe = 1 + Math.sin(t * 1.6) * 0.012 + hf * 0.03;
      g.scale.setScalar(breathe);
      g.rotation.z = Math.sin(t * 0.7) * 0.03;
      g.rotation.y = Math.sin(t * 0.4) * 0.05;
      const scrollTilt = MathUtils.clamp(scrollY.current / 4000, 0, 1) * 0.12;
      g.rotation.x = damp(g.rotation.x, scrollTilt, 4, dt);
    }

    // Head: mouse tracking
    const h = head.current;
    if (h) {
      h.rotation.y = damp(h.rotation.y, pointer.current.x * HEAD_YAW, 4, dt);
      h.rotation.x = damp(h.rotation.x, pointer.current.y * HEAD_PITCH, 4, dt);
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
      const glow =
        palette.emissive * (1 + Math.sin(t * 2.5) * 0.18) + hf * palette.emissive * 0.5;
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
          w.nextAt = t + WAVE_INTERVAL + Math.random() * 4;
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

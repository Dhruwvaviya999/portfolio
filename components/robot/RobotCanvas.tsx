"use client";

import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { useTheme } from "next-themes";

import { RobotControls } from "./RobotControls";
import { darkPalette, lightPalette } from "./RobotModel";

/**
 * The R3F scene: minimal camera, lighting, a baked Lightformer environment
 * (what makes the metals read as metal — no network assets, no HDR files),
 * and contact shadows around the robot. Reads the theme *outside* the Canvas
 * and passes a palette down as props (R3F's reconciler doesn't inherit
 * next-themes' React context).
 *
 * Heavy (three.js): only ever mounted via `dynamic(ssr:false)` from `index`,
 * so it stays out of the initial bundle and never server-renders.
 *
 * `active` toggles the render loop — set to false when off-screen to stop the
 * rAF loop and save CPU/GPU.
 */

/**
 * The Environment below bakes once (`frames={1}`), which requires a rendered
 * frame — if the canvas mounts (or the env remounts on theme change) while
 * `frameloop="never"`, the metals would stay black until the loop resumes.
 * This kicks one frame on mount and whenever `dep` (the theme) changes.
 */
function Kick({ dep }: { dep: string | undefined }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate, dep]);
  return null;
}

export default function RobotCanvas({ active = true }: { active?: boolean }) {
  // Touch devices split the gesture: horizontal drag spins the robot, vertical
  // swipe scrolls the page. OrbitControls hard-sets `touch-action: none` inline
  // on the canvas (which would trap scroll inside the robot), so we override it
  // with `touch-pan-y!` — a CSS `!important` rule beats that inline style, and
  // the browser then hands us only the horizontal gestures. Vertical swipes
  // fire `pointercancel`, which OrbitControls treats as pointer-up, so a
  // scroll never leaves the controls in a half-dragged state.
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(pointer: coarse)");
    const evaluate = () => setTouch(mql.matches);
    evaluate();
    mql.addEventListener("change", evaluate);
    return () => mql.removeEventListener("change", evaluate);
  }, []);

  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const palette = dark ? darkPalette : lightPalette;

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 35 }}
      className={touch ? "touch-pan-y!" : "cursor-grab active:cursor-grabbing"}
    >
      <Kick dep={resolvedTheme} />
      <ambientLight intensity={palette.ambient} />
      <directionalLight position={[4, 6, 5]} intensity={palette.keyLight} />
      <pointLight position={[-4, 1, 3]} color={palette.rimColor} intensity={palette.rimIntensity} />

      {/* Local studio-strip environment: long reflections that sell the
          brushed-metal shell. No preset => zero network fetches; no
          `background` => the canvas alpha stays transparent. `key` forces a
          re-bake on theme change (frames={1} bakes exactly once). */}
      <Environment key={resolvedTheme} resolution={256} frames={1}>
        {/* overhead softbox */}
        <Lightformer
          form="rect"
          color="#ffffff"
          intensity={dark ? 2.8 : 3}
          position={[0, 5, -1]}
          rotation-x={Math.PI / 2}
          scale={[10, 10, 1]}
        />
        {/* paired thin left strips -> long streaks on the chamfers */}
        <Lightformer
          form="rect"
          color="#ffffff"
          intensity={dark ? 1.2 : 1.5}
          position={[-5, 1, 1]}
          rotation-y={Math.PI / 2}
          scale={[12, 0.8, 1]}
        />
        <Lightformer
          form="rect"
          color="#ffffff"
          intensity={dark ? 0.8 : 1.0}
          position={[-5, -0.5, 1]}
          rotation-y={Math.PI / 2}
          scale={[12, 0.4, 1]}
        />
        {/* brand-blue right strip */}
        <Lightformer
          form="rect"
          color="#8FABD4"
          intensity={dark ? 1.6 : 1.2}
          position={[5, 0.5, 0]}
          rotation-y={-Math.PI / 2}
          scale={[12, 1, 1]}
        />
        {/* front fill -> catch-light in the black visor glass */}
        <Lightformer
          form="rect"
          color="#ffffff"
          intensity={dark ? 0.6 : 0.8}
          position={[0, 0.5, 5]}
          rotation-y={Math.PI}
          scale={[8, 2, 1]}
        />
      </Environment>

      <RobotControls palette={palette} />

      {/* Drag to rotate the robot 360° in place — no pan/zoom, so the page
          still scrolls over the canvas and the robot stays centered. On touch
          the polar angle is pinned to the equator: tilt is what would fight the
          page scroll, and yaw alone still gives the full 360° spin. */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={touch ? 0.9 : 0.6}
        minPolarAngle={touch ? Math.PI / 2 : Math.PI * 0.1}
        maxPolarAngle={touch ? Math.PI / 2 : Math.PI * 0.9}
      />

      <ContactShadows
        position={[0, -1.85, 0]}
        opacity={palette.shadowOpacity}
        scale={9}
        blur={2.6}
        far={4}
        color={palette.shadowColor}
        resolution={256}
        frames={1}
      />
    </Canvas>
  );
}

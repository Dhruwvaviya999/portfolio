"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useTheme } from "next-themes";

import { RobotControls } from "./RobotControls";
import { darkPalette, lightPalette } from "./RobotModel";

/**
 * The R3F scene: minimal camera, lighting, and contact shadows around the
 * robot. Reads the theme *outside* the Canvas and passes a palette down as
 * props (R3F's reconciler doesn't inherit next-themes' React context).
 *
 * Heavy (three.js): only ever mounted via `dynamic(ssr:false)` from `index`,
 * so it stays out of the initial bundle and never server-renders.
 *
 * `active` toggles the render loop — set to false when off-screen to stop the
 * rAF loop and save CPU/GPU.
 */
export default function RobotCanvas({ active = true }: { active?: boolean }) {
  const { resolvedTheme } = useTheme();
  const palette = resolvedTheme === "dark" ? darkPalette : lightPalette;

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 35 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <ambientLight intensity={palette.ambient} />
      <directionalLight position={[4, 6, 5]} intensity={palette.keyLight} />
      <pointLight position={[-4, 1, 3]} color={palette.rimColor} intensity={palette.rimIntensity} />

      <RobotControls palette={palette} />

      {/* Drag to rotate the robot 360° in place — no pan/zoom, so the page
          still scrolls over the canvas and the robot stays centered. */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
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

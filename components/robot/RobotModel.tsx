"use client";

import type { RefObject } from "react";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";

/**
 * Theme-aware material/lighting palette for the robot. Defined in TS (not the
 * CSS oklch tokens) because three.js `Color` can't parse oklch, and the robot
 * has its own brand-driven look.
 */
export interface RobotPalette {
  /** Main shell color. */
  body: string;
  /** Secondary panels (chest, etc.). */
  accent: string;
  /** Joints, visor, feet. */
  joint: string;
  /** Glowing eye / antenna color. */
  eye: string;
  /** Base eye emissive intensity. */
  emissive: number;
  metalness: number;
  roughness: number;
  /** Scene lighting. */
  ambient: number;
  keyLight: number;
  rimColor: string;
  rimIntensity: number;
  /** Contact shadow. */
  shadowOpacity: number;
  shadowColor: string;
}

// Light: clean metallic, brand #4A70A9 / #8FABD4.
export const lightPalette: RobotPalette = {
  body: "#e9eef5",
  accent: "#8FABD4",
  joint: "#4A70A9",
  eye: "#4A70A9",
  emissive: 0.9,
  metalness: 0.55,
  roughness: 0.35,
  ambient: 0.85,
  keyLight: 1.6,
  rimColor: "#8FABD4",
  rimIntensity: 0.5,
  shadowOpacity: 0.35,
  shadowColor: "#1c2a44",
};

// Dark: dark metallic surfaces, brighter glowing accents.
export const darkPalette: RobotPalette = {
  body: "#2a3142",
  accent: "#4A70A9",
  joint: "#8FABD4",
  eye: "#9fc4ff",
  emissive: 1.6,
  metalness: 0.85,
  roughness: 0.3,
  ambient: 0.35,
  keyLight: 1.1,
  rimColor: "#8FABD4",
  rimIntensity: 1.1,
  shadowOpacity: 0.5,
  shadowColor: "#000000",
};

interface RobotModelProps {
  palette: RobotPalette;
  /** Floating/sway/breathing group (animated by RobotControls). */
  rootRef: RefObject<Group | null>;
  /** Mouse-tracking head group. */
  headRef: RefObject<Group | null>;
  /** Eyes group — scaled for blink, materials pulsed for glow. */
  eyesRef: RefObject<Group | null>;
  /** The arm that waves. */
  waveArmRef: RefObject<Group | null>;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * Procedural robot — built entirely from box/sphere/cylinder geometry with
 * rounded edges (drei `RoundedBox`). No external models. Pure structure: all
 * motion is driven imperatively by `RobotControls` through the passed refs, so
 * this component never re-renders per frame.
 *
 * A static inner group offsets the whole robot so its visual center sits at the
 * origin (keeps it framed regardless of the floating animation on `rootRef`).
 */
export function RobotModel({
  palette,
  rootRef,
  headRef,
  eyesRef,
  waveArmRef,
  onPointerOver,
  onPointerOut,
}: RobotModelProps) {
  const { body, accent, joint, eye, emissive, metalness, roughness } = palette;

  return (
    <group ref={rootRef} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <group position={[0, -0.35, 0]}>
        {/* Torso */}
        <RoundedBox args={[1.4, 1.5, 0.9]} radius={0.18} smoothness={4}>
          <meshStandardMaterial color={body} metalness={metalness} roughness={roughness} />
        </RoundedBox>
        {/* Chest panel */}
        <RoundedBox args={[0.7, 0.55, 0.06]} radius={0.06} smoothness={3} position={[0, 0.05, 0.47]}>
          <meshStandardMaterial color={accent} metalness={0.4} roughness={0.5} />
        </RoundedBox>
        {/* Neck */}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.18, 0.2, 0.25, 24]} />
          <meshStandardMaterial color={joint} metalness={metalness} roughness={roughness} />
        </mesh>

        {/* Head */}
        <group ref={headRef} position={[0, 1.3, 0]}>
          <RoundedBox args={[1.25, 1.0, 1.0]} radius={0.2} smoothness={4}>
            <meshStandardMaterial color={body} metalness={metalness} roughness={roughness} />
          </RoundedBox>
          {/* Visor / face plate */}
          <RoundedBox args={[1.0, 0.55, 0.08]} radius={0.18} smoothness={4} position={[0, 0.02, 0.48]}>
            <meshStandardMaterial color={joint} metalness={0.6} roughness={0.25} />
          </RoundedBox>
          {/* Eyes */}
          <group ref={eyesRef} position={[0, 0.05, 0.54]}>
            {[-0.26, 0.26].map((x) => (
              <mesh key={x} position={[x, 0, 0]}>
                <sphereGeometry args={[0.13, 24, 24]} />
                <meshStandardMaterial
                  color={eye}
                  emissive={eye}
                  emissiveIntensity={emissive}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
          {/* Antenna */}
          <mesh position={[0, 0.62, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.34, 16]} />
            <meshStandardMaterial color={joint} metalness={metalness} roughness={roughness} />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <sphereGeometry args={[0.08, 20, 20]} />
            <meshStandardMaterial
              color={eye}
              emissive={eye}
              emissiveIntensity={emissive * 0.8}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Arms — the +x arm waves; the -x arm rests. */}
        <group ref={waveArmRef} position={[0.85, 0.55, 0]} rotation={[0, 0, 0.12]}>
          <Arm palette={palette} />
        </group>
        <group position={[-0.85, 0.55, 0]} rotation={[0, 0, -0.12]}>
          <Arm palette={palette} />
        </group>

        {/* Legs */}
        {[-0.38, 0.38].map((x) => (
          <group key={x} position={[x, -0.8, 0]}>
            <mesh position={[0, -0.25, 0]}>
              <cylinderGeometry args={[0.16, 0.14, 0.5, 20]} />
              <meshStandardMaterial color={body} metalness={metalness} roughness={roughness} />
            </mesh>
            <RoundedBox args={[0.36, 0.2, 0.5]} radius={0.08} smoothness={3} position={[0, -0.55, 0.08]}>
              <meshStandardMaterial color={joint} metalness={metalness} roughness={roughness} />
            </RoundedBox>
          </group>
        ))}
      </group>
    </group>
  );
}

/** One arm: shoulder joint + upper arm + hand. Rotated by its parent group. */
function Arm({ palette }: { palette: RobotPalette }) {
  const { body, joint, metalness, roughness } = palette;
  return (
    <>
      <mesh>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color={joint} metalness={metalness} roughness={roughness} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.13, 0.12, 0.75, 20]} />
        <meshStandardMaterial color={body} metalness={metalness} roughness={roughness} />
      </mesh>
      <RoundedBox args={[0.3, 0.3, 0.3]} radius={0.1} smoothness={3} position={[0, -0.92, 0]}>
        <meshStandardMaterial color={joint} metalness={metalness} roughness={roughness} />
      </RoundedBox>
    </>
  );
}

"use client";

import { useEffect, useMemo, type RefObject } from "react";
import { RoundedBox } from "@react-three/drei";
import { MeshPhysicalMaterial, MeshStandardMaterial, type Group } from "three";

/**
 * Theme-aware material/lighting palette for the robot. Defined in TS (not the
 * CSS oklch tokens) because three.js `Color` can't parse oklch, and the robot
 * has its own brand-driven look.
 *
 * Design language: "two-layer machined android" — a bright chamfered metal
 * SHELL over a dark machined UNDERSTRUCTURE (panel) that peeks through at
 * every junction, with polished trim rings at the joints. Exactly four
 * emissive elements: two eyes, the antenna tip, and the chest core.
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
  /** Dark machined recess/gasket metal (understructure). */
  panel: string;
  /** Polished ring/joint steel. */
  trim: string;
  /** Visor glass base color. */
  glass: string;
  /** Base eye emissive intensity. */
  emissive: number;
  /** Faint HUD emissive on the visor glass. */
  visorGlow: number;
  metalness: number;
  roughness: number;
  /** envMapIntensity multiplier for the baked Lightformer environment. */
  envIntensity: number;
  /** Scene lighting. */
  ambient: number;
  keyLight: number;
  rimColor: string;
  rimIntensity: number;
  /** Contact shadow. */
  shadowOpacity: number;
  shadowColor: string;
}

// Light: clean machined metal, brand #4A70A9 / #8FABD4.
export const lightPalette: RobotPalette = {
  body: "#e9eef5",
  accent: "#8FABD4",
  joint: "#4A70A9",
  eye: "#4A70A9",
  panel: "#3b4557",
  trim: "#b6c3d6",
  glass: "#0a111f",
  emissive: 0.9,
  visorGlow: 0.05,
  metalness: 0.85,
  roughness: 0.32,
  envIntensity: 1.0,
  ambient: 0.45,
  keyLight: 1.2,
  rimColor: "#8FABD4",
  rimIntensity: 0.35,
  shadowOpacity: 0.35,
  shadowColor: "#1c2a44",
};

// Dark: dark metallic surfaces, brighter glowing accents. Body sits a few
// lightness steps above the page background (~oklch 0.145); trim is
// intentionally LIGHTER than the body so joints catch rim light on the
// near-black page.
export const darkPalette: RobotPalette = {
  body: "#3d4a68",
  accent: "#4A70A9",
  joint: "#8FABD4",
  eye: "#9fc4ff",
  panel: "#1a2235",
  trim: "#7d93b8",
  glass: "#060a12",
  emissive: 1.3,
  visorGlow: 0.12,
  metalness: 0.85,
  roughness: 0.38,
  envIntensity: 1.8,
  ambient: 0.38,
  keyLight: 0.95,
  rimColor: "#8FABD4",
  rimIntensity: 0.9,
  shadowOpacity: 0.5,
  shadowColor: "#000000",
};

/**
 * Shared materials, built once per palette instead of one inline material per
 * mesh (~40 meshes would otherwise each compile their own). Disposed when the
 * palette (theme) changes. The four emissive LED parts keep inline JSX
 * materials — the eyes especially, since RobotControls writes their
 * emissiveIntensity per frame.
 */
function useRobotMaterials(palette: RobotPalette) {
  const materials = useMemo(
    () => ({
      shell: new MeshStandardMaterial({
        color: palette.body,
        metalness: palette.metalness,
        roughness: palette.roughness,
        envMapIntensity: palette.envIntensity,
      }),
      panel: new MeshStandardMaterial({
        color: palette.panel,
        metalness: 0.65,
        roughness: 0.5,
        envMapIntensity: palette.envIntensity * 0.6,
      }),
      trim: new MeshStandardMaterial({
        color: palette.trim,
        metalness: 1.0,
        roughness: 0.2,
        envMapIntensity: palette.envIntensity * 1.1,
      }),
      chrome: new MeshStandardMaterial({
        color: palette.trim,
        metalness: 1.0,
        roughness: 0.12,
        envMapIntensity: palette.envIntensity * 1.3,
      }),
      foot: new MeshStandardMaterial({
        color: palette.panel,
        metalness: 0.7,
        roughness: 0.4,
        envMapIntensity: palette.envIntensity * 0.6,
      }),
      glass: new MeshPhysicalMaterial({
        color: palette.glass,
        metalness: 0,
        roughness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: palette.eye,
        emissiveIntensity: palette.visorGlow,
        envMapIntensity: palette.envIntensity * 1.5,
      }),
    }),
    [palette],
  );

  useEffect(() => {
    return () => {
      for (const mat of Object.values(materials)) mat.dispose();
    };
  }, [materials]);

  return materials;
}

type RobotMaterials = ReturnType<typeof useRobotMaterials>;

/** LED lens color — dark glass the emissive glow shines through. */
const LENS = "#0a101c";

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
 * Procedural robot — built entirely from box/sphere/cylinder/torus geometry
 * with chamfered edges (drei `RoundedBox`, tight radii). No external models or
 * textures. Pure structure: all motion is driven imperatively by
 * `RobotControls` through the passed refs, so this component never re-renders
 * per frame.
 *
 * A static inner group offsets the whole robot so its visual center sits at
 * the origin (keeps it framed regardless of the floating animation on
 * `rootRef`).
 *
 * Every detail overlay sits >=0.002 proud of its parent face (never coplanar)
 * to avoid z-fighting; keep those offsets if you move things.
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
  const { eye, emissive } = palette;
  const materials = useRobotMaterials(palette);

  return (
    <group ref={rootRef} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <group position={[0, -0.35, 0]}>
        {/* Torso shell */}
        <RoundedBox args={[1.4, 1.5, 0.9]} radius={0.07} smoothness={4} material={materials.shell} />
        {/* Chest mounting plate (dark recess behind the core) */}
        <RoundedBox
          args={[0.7, 0.55, 0.06]}
          radius={0.03}
          smoothness={3}
          position={[0, 0.05, 0.47]}
          material={materials.panel}
        />
        {/* Chest core — static LED (NOT part of eyesRef) */}
        <mesh position={[0, 0.12, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.03, 32]} />
          <meshStandardMaterial
            color={LENS}
            emissive={eye}
            emissiveIntensity={emissive * 0.7}
            toneMapped={false}
          />
        </mesh>
        {/* Chest core bezel */}
        <mesh position={[0, 0.12, 0.505]} material={materials.trim}>
          <torusGeometry args={[0.11, 0.018, 12, 36]} />
        </mesh>
        {/* Front panel seams */}
        {[0.48, -0.32].map((y) => (
          <mesh key={y} position={[0, y, 0.452]} material={materials.panel}>
            <boxGeometry args={[1.12, 0.014, 0.012]} />
          </mesh>
        ))}
        {/* Hex bolts punctuating the seams */}
        {(
          [
            [0.5, 0.48],
            [-0.5, 0.48],
            [0.5, -0.32],
            [-0.5, -0.32],
          ] as const
        ).map(([x, y]) => (
          <mesh
            key={`${x}:${y}`}
            position={[x, y, 0.457]}
            rotation={[Math.PI / 2, 0, 0]}
            material={materials.trim}
          >
            <cylinderGeometry args={[0.028, 0.028, 0.02, 6]} />
          </mesh>
        ))}
        {/* Side intake vents */}
        {[0.702, -0.702].map((x) => (
          <mesh key={x} position={[x, 0.11, 0]} material={materials.panel}>
            <boxGeometry args={[0.02, 0.05, 0.34]} />
          </mesh>
        ))}
        {/* Back spine panel — rewards the 360° drag */}
        <RoundedBox
          args={[0.78, 0.95, 0.07]}
          radius={0.05}
          smoothness={3}
          position={[0, 0.05, -0.45]}
          material={materials.panel}
        />
        {/* Pelvis frame — dark understructure bridging torso and legs */}
        <RoundedBox
          args={[1.0, 0.3, 0.64]}
          radius={0.06}
          smoothness={3}
          position={[0, -0.78, 0]}
          material={materials.panel}
        />
        {/* Neck — dark exposed joint between the two shell masses */}
        <mesh position={[0, 0.85, 0]} material={materials.panel}>
          <cylinderGeometry args={[0.18, 0.2, 0.25, 24]} />
        </mesh>
        {/* Neck bearing ring */}
        <mesh position={[0, 0.76, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.trim}>
          <torusGeometry args={[0.24, 0.035, 12, 32]} />
        </mesh>

        {/* Head */}
        <group ref={headRef} position={[0, 1.3, 0]}>
          <RoundedBox args={[1.25, 1.0, 1.0]} radius={0.08} smoothness={4} material={materials.shell} />
          {/* Visor bezel — dark frame the glass sits in */}
          <RoundedBox
            args={[1.08, 0.62, 0.06]}
            radius={0.06}
            smoothness={4}
            position={[0, 0.02, 0.45]}
            material={materials.panel}
          />
          {/* Visor — smoked clearcoat glass with a faint HUD glow */}
          <RoundedBox
            args={[1.0, 0.55, 0.08]}
            radius={0.08}
            smoothness={4}
            position={[0, 0.02, 0.48]}
            material={materials.glass}
          />
          {/* Blackout socket discs — blink reveals a dark camera shutter,
              not a hole into the visor. HEAD children, never inside eyesRef. */}
          {[-0.26, 0.26].map((x) => (
            <mesh
              key={`socket:${x}`}
              position={[x, 0.05, 0.535]}
              rotation={[Math.PI / 2, 0, 0]}
              material={materials.panel}
            >
              <cylinderGeometry args={[0.115, 0.115, 0.025, 24]} />
            </mesh>
          ))}
          {/* Eye socket rings — machined bezels the lenses sit in */}
          {[-0.26, 0.26].map((x) => (
            <mesh key={`ring:${x}`} position={[x, 0.05, 0.53]} material={materials.trim}>
              <torusGeometry args={[0.15, 0.02, 12, 32]} />
            </mesh>
          ))}
          {/* Eyes — LEDs behind dark lens glass. MUST stay the only children
              of eyesRef (RobotControls pulses + blink-squashes them). */}
          <group ref={eyesRef} position={[0, 0.05, 0.54]}>
            {[-0.26, 0.26].map((x) => (
              <mesh key={x} position={[x, 0, 0]}>
                <sphereGeometry args={[0.13, 24, 24]} />
                <meshStandardMaterial
                  color={LENS}
                  roughness={0.25}
                  emissive={eye}
                  emissiveIntensity={emissive}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
          {/* Ear sensor pods */}
          {[-0.655, 0.655].map((x) => (
            <mesh key={x} position={[x, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.panel}>
              <cylinderGeometry args={[0.13, 0.13, 0.08, 24]} />
            </mesh>
          ))}
          {/* Antenna — chrome rod out of a machined boss */}
          <mesh position={[0, 0.53, 0]} material={materials.panel}>
            <cylinderGeometry args={[0.055, 0.075, 0.08, 16]} />
          </mesh>
          <mesh position={[0, 0.62, 0]} material={materials.chrome}>
            <cylinderGeometry args={[0.025, 0.025, 0.34, 16]} />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <sphereGeometry args={[0.08, 20, 20]} />
            <meshStandardMaterial
              color={LENS}
              emissive={eye}
              emissiveIntensity={emissive * 0.8}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Arms — the +x arm waves; the -x arm rests. */}
        <group ref={waveArmRef} position={[0.85, 0.55, 0]} rotation={[0, 0, 0.12]}>
          <Arm materials={materials} />
        </group>
        <group position={[-0.85, 0.55, 0]} rotation={[0, 0, -0.12]}>
          <Arm materials={materials} />
        </group>

        {/* Legs */}
        {[-0.38, 0.38].map((x) => (
          <group key={x} position={[x, -0.8, 0]}>
            {/* Hip ball joint emerging from the pelvis frame */}
            <mesh position={[0, 0.02, 0]} material={materials.trim}>
              <sphereGeometry args={[0.16, 24, 24]} />
            </mesh>
            <mesh position={[0, -0.25, 0]} material={materials.shell}>
              <cylinderGeometry args={[0.16, 0.14, 0.5, 20]} />
            </mesh>
            {/* Ankle gasket ring */}
            <mesh position={[0, -0.47, 0]} material={materials.panel}>
              <cylinderGeometry args={[0.155, 0.155, 0.05, 20]} />
            </mesh>
            <RoundedBox
              args={[0.36, 0.2, 0.5]}
              radius={0.04}
              smoothness={3}
              position={[0, -0.55, 0.08]}
              material={materials.foot}
            />
          </group>
        ))}
      </group>
    </group>
  );
}

/**
 * One arm: polished shoulder ball in a dark gasket ring, shell upper arm with
 * an elbow trim ring, wrist gasket, machined hand. Rotated by its parent
 * group.
 */
function Arm({ materials }: { materials: RobotMaterials }) {
  return (
    <>
      <mesh material={materials.trim}>
        <sphereGeometry args={[0.2, 24, 24]} />
      </mesh>
      {/* Shoulder gasket ring — dark seal where the ball meets the shell */}
      <mesh rotation={[0, Math.PI / 2, 0]} material={materials.panel}>
        <torusGeometry args={[0.215, 0.028, 12, 28]} />
      </mesh>
      <mesh position={[0, -0.4, 0]} material={materials.shell}>
        <cylinderGeometry args={[0.13, 0.12, 0.75, 20]} />
      </mesh>
      {/* Elbow joint ring */}
      <mesh position={[0, -0.45, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.trim}>
        <torusGeometry args={[0.14, 0.03, 12, 24]} />
      </mesh>
      {/* Wrist gasket */}
      <mesh position={[0, -0.77, 0]} material={materials.panel}>
        <cylinderGeometry args={[0.14, 0.14, 0.055, 20]} />
      </mesh>
      <RoundedBox
        args={[0.3, 0.3, 0.3]}
        radius={0.05}
        smoothness={3}
        position={[0, -0.92, 0]}
        material={materials.trim}
      />
    </>
  );
}

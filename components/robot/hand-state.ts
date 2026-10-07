/**
 * Shared hand-tracking state. Written by `useHandTracking` (webcam +
 * MediaPipe) and read every frame by `RobotControls`, through a plain mutable
 * ref — same pattern as the mouse pointer, so there are no React re-renders
 * on the detection path.
 */

/** Our ids for the gestures MediaPipe's bundled recognizer can name. */
export type HandGesture =
  | "none"
  | "open"
  | "fist"
  | "thumb_up"
  | "thumb_down"
  | "victory"
  | "point"
  | "love";

export interface HandState {
  /** A hand is currently in frame. */
  tracking: boolean;
  /**
   * Palm center in -1..1, mirrored so moving your hand to the right reads as
   * +x — the same convention as the mouse pointer in `RobotControls`.
   */
  x: number;
  y: number;
  gesture: HandGesture;
  /** `performance.now()` when `gesture` last changed (for edge-triggering). */
  gestureAt: number;
}

export function createHandState(): HandState {
  return { tracking: false, x: 0, y: 0, gesture: "none", gestureAt: 0 };
}

const GESTURE_BY_CATEGORY: Record<string, HandGesture> = {
  Open_Palm: "open",
  Closed_Fist: "fist",
  Thumb_Up: "thumb_up",
  Thumb_Down: "thumb_down",
  Victory: "victory",
  Pointing_Up: "point",
  ILoveYou: "love",
};

/** MediaPipe category name -> our gesture id (unknown/"None" -> "none"). */
export function toGesture(categoryName: string | undefined): HandGesture {
  return (categoryName && GESTURE_BY_CATEGORY[categoryName]) || "none";
}

"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { GestureRecognizer, GestureRecognizerResult } from "@mediapipe/tasks-vision";

import { toGesture, type HandGesture, type HandState } from "./hand-state";

// Keep in sync with the installed @mediapipe/tasks-vision version — the wasm
// runtime (fetched from the CDN) must match the JS bundle we import.
const TASKS_VISION_VERSION = "1.0.1";
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task";

const MIN_SCORE = 0.6;
/** A gesture must be seen this many frames in a row before it's committed. */
const STABLE_FRAMES = 2;
/** Landmarks averaged for the palm center: wrist + the four finger knuckles. */
const PALM = [0, 5, 9, 13, 17];

/** idle → camera (permission prompt) → model (download + init) → active. */
export type HandTrackingStatus = "idle" | "camera" | "model" | "active";

interface Session {
  stream: MediaStream;
  recognizer: GestureRecognizer;
  raf: number;
}

// The wasm fileset type isn't exported by the package; derive it from the API.
type VisionFileset = Parameters<typeof GestureRecognizer.createFromOptions>[0];

function stopTracks(stream: MediaStream | undefined) {
  if (!stream) return;
  for (const track of stream.getTracks()) track.stop();
}

async function openCamera(): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: "user" }, width: { ideal: 640 }, height: { ideal: 480 } },
    });
  } catch (err) {
    // Some webcams/drivers reject any constraint set; fall back to "any camera".
    if (err instanceof DOMException && err.name === "OverconstrainedError") {
      return navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    }
    throw err;
  }
}

/** GPU first (WebGL); some browsers/drivers refuse it, so retry on CPU. */
async function createRecognizer(vision: VisionFileset, Recognizer: typeof GestureRecognizer) {
  const options = { runningMode: "VIDEO" as const, numHands: 1 };
  try {
    return await Recognizer.createFromOptions(vision, {
      ...options,
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
    });
  } catch {
    return Recognizer.createFromOptions(vision, {
      ...options,
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "CPU" },
    });
  }
}

/** Turn a getUserMedia / MediaPipe failure into something a visitor can act on. */
function describeError(err: unknown): string {
  const name = err instanceof Error ? err.name : "";
  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
    case "PermissionDeniedError":
      return "Camera access was blocked. Allow it in your browser's site settings and try again.";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "No camera found on this device.";
    case "NotReadableError":
    case "TrackStartError":
    case "AbortError":
      return "The camera is busy or blocked by the system. Close other apps using it and check your OS camera privacy settings.";
    default: {
      const message = err instanceof Error ? err.message : "";
      return `Couldn't start hand tracking${message ? `: ${message}` : "."}`;
    }
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Webcam hand tracking for the robot. Everything runs in the browser — frames
 * never leave the device. Opt-in only: nothing (camera, model, wasm) loads
 * until `start()` is called from a user action.
 *
 * Writes palm position + the recognised gesture into the `hand` ref on every
 * processed frame; exposes a little React state (status, error, current
 * gesture) for the control UI.
 */
export function useHandTracking(hand: RefObject<HandState>) {
  const [status, setStatus] = useState<HandTrackingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  /** null until mounted — camera APIs don't exist on the server. */
  const [supported, setSupported] = useState<boolean | null>(null);
  const [gesture, setGesture] = useState<HandGesture>("none");
  const [tracking, setTracking] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const session = useRef<Session | null>(null);
  // Bumped on every start/stop so an in-flight start() can tell it was cancelled.
  const generation = useRef(0);
  const pending = useRef<{ gesture: HandGesture; frames: number }>({ gesture: "none", frames: 0 });
  const lastVideoTime = useRef(-1);
  const lastRunAt = useRef(0);
  // Phones get warm fast; halve the detection rate there.
  const interval = useRef(1000 / 30);

  useEffect(() => {
    // `mediaDevices` is undefined outside secure contexts (http://<lan-ip>).
    setSupported(window.isSecureContext && !!navigator.mediaDevices?.getUserMedia);
    interval.current = window.matchMedia("(pointer: coarse)").matches ? 1000 / 15 : 1000 / 30;
  }, []);

  const commitGesture = useCallback(
    (next: HandGesture) => {
      const p = pending.current;
      if (p.gesture === next) p.frames++;
      else {
        p.gesture = next;
        p.frames = 1;
      }
      if (p.frames < STABLE_FRAMES) return;
      const h = hand.current;
      if (h.gesture !== next) {
        h.gesture = next;
        h.gestureAt = performance.now();
        setGesture(next);
      }
    },
    [hand],
  );

  const apply = useCallback(
    (result: GestureRecognizerResult) => {
      const h = hand.current;
      const landmarks = result.landmarks[0];
      if (!landmarks) {
        if (h.tracking) setTracking(false);
        h.tracking = false;
        commitGesture("none");
        return;
      }
      let cx = 0;
      let cy = 0;
      for (const i of PALM) {
        cx += landmarks[i].x;
        cy += landmarks[i].y;
      }
      cx /= PALM.length;
      cy /= PALM.length;
      // Camera frames aren't mirrored: a hand moving to the user's right
      // drifts left in the image. Flip x so the robot follows the hand, not
      // its reflection. y stays image-down = +1, matching the pointer.
      h.x = clamp((1 - cx) * 2 - 1, -1, 1);
      h.y = clamp(cy * 2 - 1, -1, 1);
      if (!h.tracking) setTracking(true);
      h.tracking = true;

      const top = result.gestures[0]?.[0];
      commitGesture(top && top.score >= MIN_SCORE ? toGesture(top.categoryName) : "none");
    },
    [hand, commitGesture],
  );

  const loop = useCallback(() => {
    const s = session.current;
    const video = videoRef.current;
    if (!s || !video) return;
    const now = performance.now();
    if (
      !document.hidden &&
      video.readyState >= 2 &&
      video.currentTime !== lastVideoTime.current &&
      now - lastRunAt.current >= interval.current
    ) {
      lastVideoTime.current = video.currentTime;
      lastRunAt.current = now;
      apply(s.recognizer.recognizeForVideo(video, now));
    }
    s.raf = requestAnimationFrame(loop);
  }, [apply]);

  const stop = useCallback(() => {
    generation.current++;
    const s = session.current;
    session.current = null;
    if (s) {
      cancelAnimationFrame(s.raf);
      s.recognizer.close();
      stopTracks(s.stream);
    }
    const video = videoRef.current;
    if (video) video.srcObject = null;
    const h = hand.current;
    h.tracking = false;
    h.gesture = "none";
    h.gestureAt = performance.now();
    pending.current = { gesture: "none", frames: 0 };
    setTracking(false);
    setGesture("none");
    setStatus("idle");
  }, [hand]);

  const start = useCallback(async () => {
    if (session.current) return;
    const myGen = ++generation.current;
    const cancelled = () => myGen !== generation.current;
    setError(null);
    setStatus("camera");

    let stream: MediaStream | undefined;
    let recognizer: GestureRecognizer | undefined;
    try {
      // Ask for the camera first so the permission prompt isn't stuck behind
      // the model download.
      stream = await openCamera();
      if (cancelled()) throw new Error("cancelled");
      setStatus("model");

      const { FilesetResolver, GestureRecognizer } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(WASM_URL);
      recognizer = await createRecognizer(vision, GestureRecognizer);
      if (cancelled()) throw new Error("cancelled");

      const video = videoRef.current;
      if (!video) throw new Error("video element not mounted");
      video.srcObject = stream;
      await video.play();
      if (cancelled()) throw new Error("cancelled");

      // Camera unplugged / revoked by the OS mid-session.
      const current = stream;
      stream.getVideoTracks()[0]?.addEventListener("ended", () => {
        if (session.current?.stream !== current) return;
        stop();
        setError("The camera was disconnected.");
      });

      lastVideoTime.current = -1;
      session.current = { stream, recognizer, raf: 0 };
      setStatus("active");
      loop();
    } catch (err) {
      stopTracks(stream);
      recognizer?.close();
      if (cancelled()) return;
      console.error("[hand-tracking]", err);
      setError(describeError(err));
      setStatus("idle");
    }
  }, [loop, stop]);

  // Release the camera on unmount.
  useEffect(() => stop, [stop]);

  const toggle = useCallback(() => {
    if (status === "active") stop();
    else if (status === "idle") void start();
  }, [status, start, stop]);

  return { status, error, supported, gesture, tracking, videoRef, start, stop, toggle };
}

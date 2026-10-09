"use client";

import {
  useCallback,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";

export interface DragOffset {
  x: number;
  y: number;
}

export const DRAG_ORIGIN: DragOffset = { x: 0, y: 0 };

/** Movement (px) before a press counts as a drag rather than a click. */
const THRESHOLD = 4;

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

const translate = ({ x, y }: DragOffset) => `translate(${x}px, ${y}px)`;

/**
 * Drag-to-move for the overlay window. `handleProps` go on the drag handle
 * (the title bar), `targetRef` on the element that moves, and `offset` is its
 * resting translation (render it as `transform: translate(...)`).
 *
 * While dragging, the transform is written straight to the element with any
 * transition switched off, so it follows the pointer 1:1 without a React
 * render per move; the position is committed to state on release. The handle
 * is kept fully inside the viewport so it can always be grabbed again. A press
 * that moved suppresses the click that follows, so dragging by the collapsed
 * title doesn't also restore the window. Anything inside an element marked
 * `data-no-drag` (the traffic lights) starts no drag.
 */
export function useDragOffset() {
  const [offset, setOffset] = useState(DRAG_ORIGIN);
  const latest = useRef(DRAG_ORIGIN);
  const targetRef = useRef<HTMLDivElement>(null);
  const press = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    base: DragOffset;
    /** Handle rect at press time; the window moves with it 1:1. */
    rect: DOMRect;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);

  const reset = useCallback(() => {
    latest.current = DRAG_ORIGIN;
    setOffset(DRAG_ORIGIN);
  }, []);

  const onPointerDown = useCallback((e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    if ((e.target as Element).closest("[data-no-drag]")) return;
    suppressClick.current = false;
    press.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      base: latest.current,
      rect: e.currentTarget.getBoundingClientRect(),
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    const target = targetRef.current;
    if (target) target.style.transition = "none";
  }, []);

  const onPointerMove = useCallback((e: PointerEvent<HTMLElement>) => {
    const p = press.current;
    if (!p || e.pointerId !== p.pointerId) return;
    let dx = e.clientX - p.startX;
    let dy = e.clientY - p.startY;
    if (!p.moved && Math.hypot(dx, dy) >= THRESHOLD) p.moved = true;
    // Keep the handle on screen.
    dx = clamp(dx, -p.rect.left, window.innerWidth - p.rect.right);
    dy = clamp(dy, -p.rect.top, window.innerHeight - p.rect.bottom);
    latest.current = { x: p.base.x + dx, y: p.base.y + dy };
    const target = targetRef.current;
    if (target) target.style.transform = translate(latest.current);
  }, []);

  const onPointerUp = useCallback((e: PointerEvent<HTMLElement>) => {
    const p = press.current;
    if (!p || e.pointerId !== p.pointerId) return;
    press.current = null;
    if (p.moved) suppressClick.current = true;
    const target = targetRef.current;
    if (target) target.style.transition = "";
    // Same transform React will render, so committing doesn't animate.
    setOffset(latest.current);
  }, []);

  const onClickCapture = useCallback((e: MouseEvent<HTMLElement>) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return {
    offset,
    reset,
    targetRef,
    /** Inline style for the target; keeps React and the live drag in step. */
    targetStyle: { transform: translate(offset) },
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
      // touch-none so touch drags aren't taken by page scroll.
      className: "cursor-grab touch-none select-none active:cursor-grabbing",
    },
  };
}

"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const ROLES = ["Web Developer", "App Developer", "Fullstack Developer"];

const TYPE_SPEED = 90; // ms per character while typing
const DELETE_SPEED = 45; // ms per character while deleting
const HOLD_DELAY = 1600; // ms to hold a fully-typed role
const NEXT_DELAY = 400; // ms to pause once a role is cleared

/**
 * Typewriter effect that cycles through a list of roles — types a word out,
 * holds, deletes it, then moves to the next. A blinking caret trails the text.
 * Respects `prefers-reduced-motion` by showing the first role statically.
 */
export function TypingRole({ className }: { className?: string }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const role = ROLES[roleIndex];

    // Finished typing the full word — hold, then start deleting.
    if (!deleting && text === role) {
      const t = setTimeout(() => setDeleting(true), HOLD_DELAY);
      return () => clearTimeout(t);
    }

    // Finished deleting — pause, then advance to the next role.
    if (deleting && text === "") {
      const t = setTimeout(() => {
        setDeleting(false);
        setRoleIndex((i) => (i + 1) % ROLES.length);
      }, NEXT_DELAY);
      return () => clearTimeout(t);
    }

    const t = setTimeout(
      () => {
        setText((current) =>
          deleting
            ? role.slice(0, current.length - 1)
            : role.slice(0, current.length + 1),
        );
      },
      deleting ? DELETE_SPEED : TYPE_SPEED,
    );
    return () => clearTimeout(t);
  }, [text, deleting, roleIndex, reduced]);

  return (
    <span className={cn("inline-flex items-center", className)} aria-label={ROLES[roleIndex]}>
      <span aria-hidden="true">{reduced ? ROLES[0] : text}</span>
      <span
        aria-hidden="true"
        className="ml-1 inline-block h-[1.1em] w-[2px] translate-y-[0.1em] bg-current motion-safe:animate-pulse"
      />
    </span>
  );
}

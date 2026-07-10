"use client";

import * as React from "react";
import { LazyMotion, MotionConfig, domMax } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";

/**
 * Root client providers, mounted once in the app layout.
 *
 * - ThemeProvider: class-based dark mode via next-themes (system-aware,
 *   flash-free thanks to `suppressHydrationWarning` on <html>).
 * - MotionConfig `reducedMotion="user"`: globally honors the OS
 *   prefers-reduced-motion setting (transforms are skipped, opacity kept) so
 *   accessibility is handled once instead of per-component.
 * - LazyMotion + domMax (`strict`): enforces the lightweight `m.*` components
 *   (using `motion.*` throws). `domMax` rather than `domAnimation` because the
 *   skill tiles use shared-element `layoutId` transitions, which need layout
 *   projection — a feature `domAnimation` does not bundle.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domMax} strict>
          {children}
        </LazyMotion>
      </MotionConfig>
    </ThemeProvider>
  );
}

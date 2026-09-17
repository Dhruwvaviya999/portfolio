import Link from "next/link";
import { ArrowRight, ChevronDown, Download } from "lucide-react";

import { profile } from "@/content/profile";
import { socialLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn, SlideUp } from "@/components/motion";
import { Robot } from "@/components/robot";
import { SocialIcon } from "@/components/shared/icons";
import { TypingRole } from "@/components/sections/typing-role";

/**
 * Hero — the centerpiece. Intro/CTAs on the left, the interactive robot on the
 * right. Text-first in the DOM (good for SEO and mobile order); the grid swaps
 * to two columns on large screens. Entrance is a staggered slide-up sequence.
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden"
    >
      {/* Subtle, theme-aware background effects */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 -top-24 size-[28rem] rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -right-24 top-1/3 size-[24rem] rounded-full bg-brand/10 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8">
        {/* Left: intro */}
        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          <SlideUp>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-sm text-muted-foreground">
              <span className="size-2 animate-pulse rounded-full bg-brand" />
              Open to new opportunities
            </span>
          </SlideUp>

          <SlideUp delay={0.08}>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>
          </SlideUp>

          <SlideUp delay={0.16}>
            <p className="text-xl font-medium text-muted-foreground sm:text-2xl">
              <TypingRole className="text-brand" />
            </p>
          </SlideUp>

          <SlideUp delay={0.24}>
            <p className="max-w-xl text-pretty text-muted-foreground">
              {profile.tagline}
            </p>
          </SlideUp>

          <SlideUp delay={0.32}>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <a href="#projects" className={buttonVariants({ size: "lg" })}>
                View Projects
                <ArrowRight className="size-4" />
              </a>
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                <Download className="size-4" />
                Download Resume
              </a>
            </div>
          </SlideUp>

          <SlideUp delay={0.4}>
            <div className="flex items-center justify-center gap-1 lg:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                >
                  <SocialIcon name={social.icon} className="size-[1.05rem]" />
                </a>
              ))}
            </div>
          </SlideUp>
        </div>

        {/* Right: interactive robot */}
        <FadeIn duration={0.8} className="w-full">
          <div className="relative mx-auto aspect-square w-full max-w-65 sm:max-w-sm lg:max-w-md">
            <Robot />
          </div>
        </FadeIn>
      </div>

      {/* Scroll indicator (desktop only — the stacked mobile hero scrolls naturally) */}
      <Link
        href="#about"
        aria-label="Scroll to about"
        className="absolute inset-x-0 bottom-6 mx-auto hidden w-fit flex-col items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground sm:flex"
      >
        <span className="font-mono uppercase tracking-widest">Scroll</span>
        <ChevronDown className="size-4 motion-safe:animate-bounce" />
      </Link>
    </section>
  );
}

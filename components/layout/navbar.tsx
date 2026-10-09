"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquareTerminal } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { SECTION_IDS, isNavItemActive, mainNav } from "@/lib/navigation";
import { useScrolled } from "@/hooks/use-scrolled";
import { useActiveSection } from "@/hooks/use-active-section";
import { Button } from "@/components/ui/button";
import { openTerminal } from "@/components/terminal/terminal-dialog";
import { HandControlButton } from "@/components/robot/HandControl";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";

/**
 * Sticky site header: transparent over the hero, switching to a blurred
 * background once scrolled. Desktop shows inline nav with scroll-spy active
 * highlighting; mobile collapses into a Sheet. The scroll-spy runs once here
 * and its result is shared with the mobile drawer.
 */
export function Navbar() {
  const scrolled = useScrolled();
  const pathname = usePathname();
  const activeSection = useActiveSection(SECTION_IDS);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span
            className="inline-block size-2 rounded-full bg-brand"
            aria-hidden="true"
          />
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {mainNav.map((item) => {
            const active = isNavItemActive(item, pathname, activeSection);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-1 text-sm transition-colors hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-brand" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          {/* The robot it drives only lives on the home page. Decided from the
              path so the server render matches and the header doesn't shift. */}
          {pathname === "/" && <HandControlButton />}
          <Button
            variant="ghost"
            size="icon"
            onClick={openTerminal}
            aria-label="Open terminal"
            title="Open terminal (`)"
          >
            <SquareTerminal className="size-4" />
          </Button>
          <ThemeToggle />
          <MobileNav pathname={pathname} activeSection={activeSection} />
        </div>
      </div>
    </header>
  );
}

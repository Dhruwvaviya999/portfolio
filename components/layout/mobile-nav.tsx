"use client";

import Link from "next/link";
import { FileText, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { isNavItemActive, mainNav } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Mobile navigation drawer (shadcn Sheet). Active state is passed down from the
 * Navbar so the scroll-spy observer only runs once. Each link is wrapped in
 * `SheetClose` so tapping it both navigates and dismisses the drawer.
 */
export function MobileNav({
  pathname,
  activeSection,
}: {
  pathname: string;
  activeSection: string | null;
}) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="text-left">{siteConfig.name}</SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
          {mainNav.map((item) => {
            const active = isNavItemActive(item, pathname, activeSection);
            return (
              <SheetClose
                key={item.href}
                render={
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-md px-2 py-2 text-base transition-colors hover:bg-muted",
                      active
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  />
                }
              >
                {item.label}
              </SheetClose>
            );
          })}
        </nav>

        <Separator className="my-2" />

        <div className="px-4">
          <Button
            className="w-full"
            render={
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <FileText className="size-4" />
            Resume
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

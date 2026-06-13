"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { isNavItemActive, mainNav } from "@/lib/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Mobile navigation drawer (shadcn Sheet). Active state is passed down from the
 * Navbar so the scroll-spy observer only runs once. The Sheet is controlled so
 * tapping a link both navigates (real `<Link>`, proper link semantics) and
 * dismisses the drawer — avoiding `SheetClose render={<Link/>}`, which would
 * apply button semantics to a navigation link.
 */
export function MobileNav({
  pathname,
  activeSection,
}: {
  pathname: string;
  activeSection: string | null;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-2 py-2 text-base transition-colors hover:bg-muted",
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Separator className="my-2" />

        <div className="px-4">
          <Link
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className={cn(buttonVariants(), "w-full")}
          >
            <FileText className="size-4" />
            Resume
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { mainNav, socialLinks } from "@/lib/navigation";
import { Separator } from "@/components/ui/separator";
import { SocialIcon } from "@/components/shared/icons";

/**
 * Site footer: brand blurb, quick navigation, social links, and a copyright
 * line with the current year. Server component — fully crawlable, no client JS.
 * (The year is resolved at build time; it refreshes on each deploy.)
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              <span
                className="inline-block size-2 rounded-full bg-brand"
                aria-hidden="true"
              />
              {siteConfig.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            <nav aria-label="Footer navigation">
              <h2 className="text-sm font-medium text-foreground">Navigation</h2>
              <ul className="mt-3 space-y-2">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-sm font-medium text-foreground">Connect</h2>
              <ul className="mt-3 space-y-2">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <SocialIcon name={social.icon} className="size-4" />
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Built with Next.js &amp; Three.js</p>
        </div>
      </div>
    </footer>
  );
}

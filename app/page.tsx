import { siteConfig } from "@/lib/site";

/**
 * Temporary foundation placeholder.
 *
 * This exists only to verify the Section 1 wiring (fonts, theme tokens,
 * providers) renders cleanly. It is replaced by the real home sections in
 * Section 5 — do not build section UI here.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
        Foundation ready
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        {siteConfig.name}
      </h1>
      <p className="max-w-md text-balance text-muted-foreground">
        {siteConfig.description}
      </p>
    </main>
  );
}

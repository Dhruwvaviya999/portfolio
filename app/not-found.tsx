import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p className="font-mono text-7xl font-bold text-brand/20 sm:text-8xl">404</p>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Back home
        </Link>
        <Link href="/projects" className={buttonVariants({ variant: "outline" })}>
          View projects
        </Link>
      </div>
    </main>
  );
}

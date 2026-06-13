"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

/**
 * Route-segment error boundary. Renders inside the root layout (header/footer
 * stay), so a runtime error degrades gracefully instead of blanking the page.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for diagnostics (replace with real logging if desired).
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          An unexpected error occurred. Try again, or head back home.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}

import type { MDXComponents } from "mdx/types";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Element → component mapping for MDX bodies (project case studies, blog posts).
 *
 * These are hand-styled with Tailwind utilities reading the theme tokens, so
 * MDX content re-themes with the rest of the site. `mdxComponents` is passed to
 * `<MDXRemote components={mdxComponents} />` at the page level (Section 6).
 *
 * `useMDXComponents` is also exported for compatibility with the @next/mdx
 * convention, in case the pipeline is ever swapped.
 */

export const mdxComponents: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "mt-6 scroll-m-20 text-lg font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn("leading-7 not-first:mt-5 text-muted-foreground", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-5 ml-6 list-disc space-y-2", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn("my-5 ml-6 list-decimal space-y-2", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("leading-7 text-muted-foreground", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 border-brand pl-6 italic text-foreground",
        className,
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold text-foreground", className)} {...props} />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-10 border-border", className)} {...props} />
  ),
  a: ({ className, href = "", ...props }) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    const classes = cn(
      "font-medium text-brand underline underline-offset-4 hover:no-underline",
      className,
    );
    if (isInternal) {
      return <Link href={href} className={classes} {...props} />;
    }
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  },
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm text-foreground",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-lg border bg-muted p-4 text-sm",
        className,
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border border-border px-4 py-2 text-left font-semibold",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn("border border-border px-4 py-2 text-muted-foreground", className)}
      {...props}
    />
  ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}

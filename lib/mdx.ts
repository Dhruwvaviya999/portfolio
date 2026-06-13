/**
 * MDX compile configuration.
 *
 * Centralizes the remark/rehype plugin pipeline used when MDX bodies are
 * compiled with `<MDXRemote>` (next-mdx-remote/rsc) at the page level in
 * Section 6. Keeping it here means the toolchain is defined once and shared by
 * both project case studies and blog posts.
 */

import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

/** Strongly-typed options object passed to `<MDXRemote options={mdxOptions} />`. */
export const mdxOptions: NonNullable<MDXRemoteProps["options"]> = {
  // Frontmatter is parsed separately (gray-matter) in the content loaders, so
  // it is disabled here to avoid double-parsing.
  parseFrontmatter: false,
  mdxOptions: {
    remarkPlugins: [
      // GitHub-flavored markdown: tables, task lists, strikethrough, autolinks.
      remarkGfm,
    ],
    rehypePlugins: [
      // Adds `id`s to headings so case studies support deep links / a TOC.
      rehypeSlug,
    ],
    // Syntax highlighting (rehype-pretty-code / Shiki) is added in Section 6,
    // where the code blocks are actually rendered.
  },
};

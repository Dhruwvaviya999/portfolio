/**
 * Renders a JSON-LD <script>. Server component — the data is serialized into
 * static HTML with no client cost.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Data is built from trusted, static site config — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";
import { getProjectMeta, getProjectSlugs } from "@/lib/content/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project case study";

// Pre-generate one OG image per project at build time.
export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectMeta(slug);
  const title = project?.title ?? "Case study";
  const summary = project?.summary ?? "";
  const tags = project?.tags ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          color: "white",
          background: "linear-gradient(135deg, #0b1220 0%, #15294a 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
          }}
        >
          <span style={{ color: "#8FABD4", letterSpacing: 2 }}>CASE STUDY</span>
          <span style={{ color: "#94a3b8" }}>
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            {title}
          </div>
          <div
            style={{
              fontSize: 34,
              color: "#cbd5e1",
              lineHeight: 1.3,
              maxWidth: 900,
            }}
          >
            {summary}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {tags.slice(0, 4).map((tag) => (
            <div
              key={tag}
              style={{
                fontSize: 24,
                color: "#8FABD4",
                border: "1px solid #33507d",
                borderRadius: 9999,
                padding: "8px 20px",
                display: "flex",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}

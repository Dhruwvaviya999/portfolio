import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 9999,
              background: "#8FABD4",
            }}
          />
          <div style={{ fontSize: 30, color: "#8FABD4" }}>
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1.05 }}>
            {siteConfig.name}
          </div>
          <div style={{ fontSize: 44, color: "#cbd5e1" }}>{siteConfig.title}</div>
        </div>

        <div style={{ fontSize: 28, color: "#94a3b8" }}>
          Next.js · TypeScript · React · 3D on the web
        </div>
      </div>
    ),
    { ...size },
  );
}

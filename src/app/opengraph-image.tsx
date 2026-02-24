import { ImageResponse } from "next/og";
import { SITE_CONFIG, SERVICES } from "@/lib/site-config";
import messages from "../../messages/en.json";

export const alt = SITE_CONFIG.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#09090b",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient orb */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-50px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#f97316",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "3px",
              color: "#a1a1aa",
              fontFamily: "monospace",
            }}
          >
            ENGINEERING
          </span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#fafafa",
              lineHeight: 1.1,
            }}
          >
            {SITE_CONFIG.name}
          </span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#f97316",
            }}
          >
            .
          </span>
        </div>

        {/* Subtitle */}
        <span
          style={{
            fontSize: "24px",
            color: "#a1a1aa",
            marginTop: "16px",
          }}
        >
          {messages.meta.tagline}
        </span>

        {/* Service tags */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "48px",
          }}
        >
          {SERVICES.map((s) => (
            <div
              key={s.id}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                backgroundColor: "#111113",
                border: "1px solid #27272a",
                fontSize: "13px",
                color: "#a1a1aa",
                fontFamily: "monospace",
              }}
            >
              {typeof messages.services[s.id as keyof typeof messages.services] === "object"
                ? (messages.services[s.id as keyof typeof messages.services] as { title: string }).title
                : s.id}
            </div>
          ))}
        </div>

        {/* Domain */}
        <span
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            fontSize: "14px",
            letterSpacing: "2px",
            color: "#71717a",
            fontFamily: "monospace",
          }}
        >
          {SITE_CONFIG.domain}
        </span>
      </div>
    ),
    { ...size },
  );
}

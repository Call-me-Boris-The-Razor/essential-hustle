import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Build-time version injection — auto from package.json + git
const APP_VERSION = process.env.APP_VERSION
  ?? (JSON.parse(readFileSync("./package.json", "utf-8")) as { version: string }).version;

const GIT_HASH = process.env.GIT_HASH !== "unknown" && process.env.GIT_HASH
  ? process.env.GIT_HASH
  : (() => {
      try { return execSync("git rev-parse --short HEAD").toString().trim(); }
      catch { return "unknown"; }
    })();

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const UMAMI_ORIGIN = process.env.NEXT_PUBLIC_UMAMI_URL
  ? new URL(process.env.NEXT_PUBLIC_UMAMI_URL).origin
  : "";

// Content-Security-Policy: 'unsafe-inline' required for Next.js hydration scripts.
// Still blocks object injection, base hijacking, form action hijacking, and framing.
const CSP_DIRECTIVES = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${UMAMI_ORIGIN ? ` ${UMAMI_ORIGIN}` : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data:`,
  `font-src 'self'`,
  `connect-src 'self'${UMAMI_ORIGIN ? ` ${UMAMI_ORIGIN}` : ""}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP_DIRECTIVES },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const CACHE_STATIC_LONG = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

const CACHE_HTML = [
  { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
];

const CACHE_ASSETS = [
  { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  env: {
    APP_VERSION,
    GIT_HASH,
  },
  headers: async () => [
    { source: "/(.*)", headers: SECURITY_HEADERS },
    { source: "/_next/static/:path*", headers: CACHE_STATIC_LONG },
    { source: "/favicon.svg", headers: CACHE_ASSETS },
    { source: "/opengraph-image", headers: CACHE_ASSETS },
    { source: "/:path*.html", headers: CACHE_HTML },
  ],
};

export default withNextIntl(nextConfig);

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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

const nextConfig: NextConfig = {
  reactCompiler: true,
  headers: async () => [
    { source: "/(.*)", headers: SECURITY_HEADERS },
  ],
};

export default withNextIntl(nextConfig);

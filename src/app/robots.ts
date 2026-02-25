import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/site-config";

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "GoogleOther",
  "Amazonbot",
  "cohere-ai",
] as const;

const isProduction =
  process.env.SITE_URL?.includes(SITE_CONFIG.domain) ??
  process.env.NODE_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  // Block indexing on staging/preview/dev environments
  if (!isProduction) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/" as const })),
    ],
    sitemap: `https://${SITE_CONFIG.domain}/sitemap.xml`,
  };
}

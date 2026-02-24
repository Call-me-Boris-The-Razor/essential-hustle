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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/" as const })),
    ],
    sitemap: `https://${SITE_CONFIG.domain}/sitemap.xml`,
  };
}

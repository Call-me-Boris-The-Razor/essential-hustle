import { getAllPosts } from "@/lib/blog";
import { SITE_CONFIG } from "@/lib/site-config";

const BASE_URL = `https://${SITE_CONFIG.domain}`;

/** Escape XML special characters for use outside CDATA */
const escapeXml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Escape CDATA terminator to prevent XML injection */
const escapeCdata = (s: string): string =>
  s.replace(/]]>/g, "]]]]><![CDATA[>");

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${escapeCdata(post.title)}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${escapeCdata(post.description)}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`,
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_CONFIG.name} Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Engineering insights from ${SITE_CONFIG.name}</description>
    <!-- RSS feed uses EN as canonical language for search engines -->
    <language>en</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(feed.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

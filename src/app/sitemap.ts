import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/site-config";
import { getAllPosts } from "@/lib/blog";
import { locales, defaultLocale } from "@/i18n/config";

const BASE_URL = `https://${SITE_CONFIG.domain}`;

const localeUrl = (path: string, locale: string) =>
  locale === defaultLocale ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;

const alternates = (path: string) => ({
  languages: Object.fromEntries(
    locales.map((l) => [l, localeUrl(path, l)]),
  ),
});

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: localeUrl("/", locale),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: alternates("/"),
    },
    {
      url: localeUrl("/blog", locale),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: alternates("/blog"),
    },
  ]);

  const blogPosts: MetadataRoute.Sitemap = getAllPosts().flatMap((post) =>
    locales.map((locale) => ({
      url: localeUrl(`/blog/${post.slug}`, locale),
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: alternates(`/blog/${post.slug}`),
    })),
  );

  return [...pages, ...blogPosts];
}

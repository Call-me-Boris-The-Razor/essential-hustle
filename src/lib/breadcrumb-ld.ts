import { SITE_CONFIG } from "@/lib/site-config";

const BASE_URL = `https://${SITE_CONFIG.domain}`;

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_CONFIG.name, item: BASE_URL },
      ...items.map((item, i) => ({
        "@type": "ListItem" as const,
        position: i + 2,
        name: item.name,
        item: `${BASE_URL}${item.path}`,
      })),
    ],
  };
}

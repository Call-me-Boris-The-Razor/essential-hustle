import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SITE_CONFIG, SERVICES } from "@/lib/site-config";
import { Providers } from "@/components/providers";
import { JsonLd } from "@/components/json-ld";
import { Analytics } from "@/components/analytics";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: `${SITE_CONFIG.name} — ${t("tagline")}`,
    description: t("description"),
    metadataBase: new URL(`https://${SITE_CONFIG.domain}`),
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: `${SITE_CONFIG.name} — ${t("tagline")}`,
      description: t("description"),
      siteName: SITE_CONFIG.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_CONFIG.name} — ${t("tagline")}`,
      description: t("description"),
    },
    alternates: {
      canonical: `https://${SITE_CONFIG.domain}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? `https://${SITE_CONFIG.domain}`
            : `https://${SITE_CONFIG.domain}/${l}`,
        ]),
      ),
    },
    other: {
      author: SITE_CONFIG.name,
      publisher: SITE_CONFIG.name,
      topic: SERVICES.map((s) => s.id).join(", "),
      classification: "Technology Services",
      category: "Technology",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <JsonLd />
        <link rel="author" href="/humans.txt" />
        <link rel="alternate" type="application/json" href="/api/site-summary" />
        <link rel="alternate" type="application/rss+xml" title="Essential Hustle Blog" href="/feed.xml" />
      </head>
      <body className="grain antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-bg focus:text-sm focus:font-semibold"
        >
          {(messages as Record<string, unknown>).skipToContent as string}
        </a>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

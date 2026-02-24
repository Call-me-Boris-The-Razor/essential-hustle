import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { SITE_CONFIG, SERVICES } from "@/lib/site-config";
import { Providers } from "@/components/providers";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  metadataBase: new URL(`https://${SITE_CONFIG.domain}`),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  alternates: {
    canonical: `https://${SITE_CONFIG.domain}`,
  },
  other: {
    author: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    topic: "Engineering Services, DevOps, AI, Embedded Systems, Web Development",
    classification: "Technology Services",
    category: "Technology",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <JsonLd />
        <link rel="author" href="/humans.txt" />
        <link rel="alternate" type="application/json" href="/api/site-summary" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} grain antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-bg focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <noscript>
          <div style={{ padding: "2rem", color: "var(--text-primary)", fontFamily: "system-ui" }}>
            <h1>{SITE_CONFIG.name} — {SITE_CONFIG.tagline}</h1>
            <p>{SITE_CONFIG.description}</p>
            <p>Services: {SERVICES.map((s) => s.title).join(", ")}</p>
            <p>Contact: {SITE_CONFIG.email}</p>
          </div>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

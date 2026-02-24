import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { SITE_CONFIG } from "@/lib/site-config";
import { Providers } from "@/components/providers";
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
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: SITE_CONFIG.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} grain antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

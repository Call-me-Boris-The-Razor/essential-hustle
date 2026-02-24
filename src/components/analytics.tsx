import Script from "next/script";

const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL;
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

/**
 * Umami analytics script — only renders when env vars are set.
 * Privacy-friendly, no cookies, GDPR compliant.
 */
export const Analytics = () => {
  if (!UMAMI_URL || !WEBSITE_ID) return null;

  return (
    <Script
      async
      src={`${UMAMI_URL}/script.js`}
      data-website-id={WEBSITE_ID}
      strategy="afterInteractive"
    />
  );
};

import { getTranslations } from "next-intl/server";
import { SITE_CONFIG } from "@/lib/site-config";
import { LegalPage } from "@/components/legal-page";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });

  return {
    title: `${t("title")} — ${SITE_CONFIG.name}`,
    description: t("intro").slice(0, 160),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  const tNav = await getTranslations({ locale, namespace: "notFound" });

  return (
    <LegalPage
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      intro={t("intro")}
      backLabel={tNav("back")}
      sections={[
        { title: t("section1Title"), paragraphs: [t("section1p1")] },
        { title: t("section2Title"), paragraphs: [t("section2p1")] },
        { title: t("section3Title"), paragraphs: [t("section3p1")] },
        { title: t("section4Title"), paragraphs: [t("section4p1")] },
        { title: t("section5Title"), paragraphs: [t("section5p1")] },
        { title: t("section6Title"), paragraphs: [t("section6p1")] },
        { title: t("section7Title"), paragraphs: [t("section7p1")] },
      ]}
    />
  );
}

import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <span className="font-mono text-sm tracking-widest text-accent">404</span>
      <h1 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-7xl">
        {t("title")}<span className="text-accent">.</span>
      </h1>
      <p className="mt-4 max-w-md text-center text-lg text-text-secondary">
        {t("description")}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover"
      >
        {t("back")}
      </Link>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  // Log for future Sentry integration
  console.error("[locale-error]", error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <span className="font-mono text-sm tracking-widest text-accent">
        {t("label")}
      </span>
      <h1 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-7xl">
        {t("title")}
        <span className="text-accent">.</span>
      </h1>
      <p className="mt-4 max-w-md text-center text-lg text-text-secondary">
        {t("description")}
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-text-muted">
          Error ID: {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover"
      >
        {t("retry")}
      </button>
    </div>
  );
}

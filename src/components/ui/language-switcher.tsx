"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { locales, localeNames, type Locale } from "@/i18n/config";

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-1 rounded-lg border border-border p-0.5">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => handleChange(l)}
          className={`rounded-md px-2 py-1 font-mono text-xs transition-colors ${
            l === locale
              ? "bg-surface-2 text-text-primary"
              : "text-text-muted hover:text-text-secondary"
          }`}
          aria-label={localeNames[l]}
          aria-current={l === locale ? "true" : undefined}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

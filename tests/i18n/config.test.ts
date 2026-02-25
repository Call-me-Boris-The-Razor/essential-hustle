import { describe, it, expect } from "vitest";
import { locales, defaultLocale, localeNames, type Locale } from "@/i18n/config";

describe("i18n/config.ts", () => {
  it("locales contains en, ru, zh", () => {
    expect(locales).toEqual(["en", "ru", "zh"]);
  });

  it("defaultLocale is en", () => {
    expect(defaultLocale).toBe("en");
  });

  it("localeNames has human-readable name for each locale", () => {
    for (const locale of locales) {
      expect(localeNames[locale as Locale]).toBeDefined();
      expect(typeof localeNames[locale as Locale]).toBe("string");
      expect(localeNames[locale as Locale].length).toBeGreaterThan(0);
    }
  });

  it("defaultLocale is included in locales array", () => {
    expect(locales).toContain(defaultLocale);
  });
});

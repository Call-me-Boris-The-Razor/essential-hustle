import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const MESSAGES_DIR = resolve(process.cwd(), "messages");

/** Recursively extract all keys from a nested object as dot-separated paths */
function extractKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...extractKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

function loadMessages(locale: string): Record<string, unknown> {
  const raw = readFileSync(resolve(MESSAGES_DIR, `${locale}.json`), "utf-8");
  return JSON.parse(raw) as Record<string, unknown>;
}

describe("i18n message files", () => {
  const locales = ["en", "ru", "zh"] as const;
  const messages: Record<string, Record<string, unknown>> = {};
  const keysByLocale: Record<string, string[]> = {};

  type LocaleKey = (typeof locales)[number];

  // Load all locale files
  for (const locale of locales) {
    messages[locale] = loadMessages(locale);
    keysByLocale[locale] = extractKeys(messages[locale]);
  }

  describe("structural completeness", () => {
    it("all 3 locale files exist and are valid JSON", () => {
      for (const locale of locales) {
        expect(messages[locale]).toBeDefined();
        expect(typeof messages[locale]).toBe("object");
      }
    });

    it("en.json and ru.json have identical key sets", () => {
      const enKeys = keysByLocale.en!;
      const ruKeys = keysByLocale.ru!;

      const missingInRu = enKeys.filter((k) => !ruKeys.includes(k));
      const extraInRu = ruKeys.filter((k) => !enKeys.includes(k));

      expect(missingInRu).toEqual([]);
      expect(extraInRu).toEqual([]);
    });

    it("en.json and zh.json have identical key sets", () => {
      const enKeys = keysByLocale.en!;
      const zhKeys = keysByLocale.zh!;

      const missingInZh = enKeys.filter((k) => !zhKeys.includes(k));
      const extraInZh = zhKeys.filter((k) => !enKeys.includes(k));

      expect(missingInZh).toEqual([]);
      expect(extraInZh).toEqual([]);
    });
  });

  describe("no empty translations", () => {
    for (const locale of locales) {
      it(`${locale}.json has no empty string values`, () => {
        const emptyKeys: string[] = [];

        function checkEmpty(obj: Record<string, unknown>, prefix = "") {
          for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === "string" && value.trim() === "") {
              emptyKeys.push(fullKey);
            } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
              checkEmpty(value as Record<string, unknown>, fullKey);
            }
          }
        }

        checkEmpty(messages[locale]!);
        expect(emptyKeys).toEqual([]);
      });
    }
  });

  describe("placeholder consistency", () => {
    it("placeholders in en.json exist in ru.json and zh.json", () => {
      const placeholderRegex = /\{(\w+)\}/g;

      function extractPlaceholders(obj: Record<string, unknown>, prefix = ""): Map<string, string[]> {
        const result = new Map<string, string[]>();
        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (typeof value === "string") {
            const matches = [...value.matchAll(placeholderRegex)].map((m) => m[1]).filter((v): v is string => v !== undefined);
            if (matches.length > 0) {
              result.set(fullKey, matches.sort());
            }
          } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            const nested = extractPlaceholders(value as Record<string, unknown>, fullKey);
            for (const [k, v] of nested) result.set(k, v);
          }
        }
        return result;
      }

      const enPlaceholders = extractPlaceholders(messages.en!);
      const ruPlaceholders = extractPlaceholders(messages.ru!);
      const zhPlaceholders = extractPlaceholders(messages.zh!);

      for (const [key, enVars] of enPlaceholders) {
        const ruVars = ruPlaceholders.get(key);
        const zhVars = zhPlaceholders.get(key);

        if (ruVars) {
          expect(ruVars).toEqual(enVars);
        }
        if (zhVars) {
          expect(zhVars).toEqual(enVars);
        }
      }
    });
  });

  describe("required sections exist", () => {
    const requiredSections = [
      "meta",
      "nav",
      "hero",
      "services",
      "projects",
      "about",
      "testimonials",
      "contact",
      "blog",
      "footer",
      "privacy",
      "terms",
      "common",
      "error",
      "notFound",
    ];

    for (const locale of locales) {
      it(`${locale}.json has all required sections`, () => {
        for (const section of requiredSections) {
          expect(messages[locale]!).toHaveProperty(section);
        }
      });
    }
  });
});

import { describe, it, expect } from "vitest";
import { THEME_COLORS } from "@/lib/theme";

describe("theme.ts", () => {
  describe("THEME_COLORS", () => {
    const expectedKeys = [
      "bg",
      "surface1",
      "border",
      "textPrimary",
      "textSecondary",
      "textMuted",
      "accent",
    ] as const;

    it("has all 7 required color keys", () => {
      for (const key of expectedKeys) {
        expect(THEME_COLORS).toHaveProperty(key);
      }
      expect(Object.keys(THEME_COLORS)).toHaveLength(expectedKeys.length);
    });

    it("all values are valid hex color strings", () => {
      for (const key of expectedKeys) {
        expect(THEME_COLORS[key]).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });

    it("bg matches globals.css :root --bg", () => {
      expect(THEME_COLORS.bg).toBe("#09090b");
    });

    it("accent is orange (#f97316)", () => {
      expect(THEME_COLORS.accent).toBe("#f97316");
    });

    it("text-primary is near-white for dark theme", () => {
      expect(THEME_COLORS.textPrimary).toBe("#fafafa");
    });
  });
});

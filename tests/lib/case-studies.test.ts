import { describe, it, expect } from "vitest";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";

describe("case-studies.ts", () => {
  describe("CASE_STUDIES", () => {
    it("contains exactly 4 case studies", () => {
      expect(CASE_STUDIES).toHaveLength(4);
    });

    it("each case study has all required fields", () => {
      for (const cs of CASE_STUDIES) {
        expect(cs.slug).toBeDefined();
        expect(cs.title).toBeDefined();
        expect(Array.isArray(cs.tags)).toBe(true);
        expect(cs.tags.length).toBeGreaterThan(0);
        expect(["production", "active"]).toContain(cs.status);
        expect(Array.isArray(cs.stack)).toBe(true);
        expect(cs.stack.length).toBeGreaterThan(0);
        expect(cs.timeline).toBeDefined();
        expect(cs.timeline).toMatch(/\d+ months?/);
      }
    });

    it("slugs are unique", () => {
      const slugs = CASE_STUDIES.map((cs) => cs.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("slugs are URL-safe", () => {
      for (const cs of CASE_STUDIES) {
        expect(cs.slug).toMatch(/^[a-z0-9-]+$/);
      }
    });

    it("contains expected projects", () => {
      const slugs = CASE_STUDIES.map((cs) => cs.slug);
      expect(slugs).toContain("sortina");
      expect(slugs).toContain("dcc");
      expect(slugs).toContain("china-tours");
      expect(slugs).toContain("mux");
    });

    it("status is only production or active", () => {
      for (const cs of CASE_STUDIES) {
        expect(cs.status === "production" || cs.status === "active").toBe(true);
      }
    });
  });

  describe("getCaseStudy()", () => {
    it("returns case study by slug", () => {
      const sortina = getCaseStudy("sortina");
      expect(sortina).toBeDefined();
      expect(sortina!.title).toBe("Sortina");
      expect(sortina!.status).toBe("production");
    });

    it("returns DCC case study", () => {
      const dcc = getCaseStudy("dcc");
      expect(dcc).toBeDefined();
      expect(dcc!.title).toBe("Drone Control Center");
    });

    it("returns undefined for non-existent slug", () => {
      expect(getCaseStudy("nonexistent")).toBeUndefined();
    });

    it("returns undefined for empty string", () => {
      expect(getCaseStudy("")).toBeUndefined();
    });

    it("is case-sensitive (slug must match exactly)", () => {
      expect(getCaseStudy("Sortina")).toBeUndefined();
      expect(getCaseStudy("SORTINA")).toBeUndefined();
    });
  });
});

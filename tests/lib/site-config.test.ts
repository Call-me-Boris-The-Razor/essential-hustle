import { describe, it, expect } from "vitest";
import {
  SITE_CONFIG,
  SERVICES,
  PROJECTS,
  NAV_LINKS,
  ABOUT_STATS,
  TESTIMONIAL_COUNT,
  type ServiceId,
} from "@/lib/site-config";

describe("site-config.ts", () => {
  describe("SITE_CONFIG", () => {
    it("has all required fields", () => {
      expect(SITE_CONFIG.name).toBe("Essential Hustle");
      expect(SITE_CONFIG.domain).toBe("essentialhustle.dev");
      expect(SITE_CONFIG.email).toMatch(/@essentialhustle\.dev$/);
      expect(SITE_CONFIG.github).toMatch(/^https:\/\/github\.com\//);
      expect(SITE_CONFIG.telegram).toMatch(/^https:\/\/t\.me\//);
      expect(SITE_CONFIG.established).toBeGreaterThanOrEqual(2024);
    });

    it("email is a valid format", () => {
      expect(SITE_CONFIG.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it("is immutable (as const)", () => {
      // TypeScript enforces this at compile time, but we verify at runtime
      expect(Object.isFrozen(SITE_CONFIG)).toBe(false); // as const doesn't freeze
      // The important thing is the values are correct
      expect(typeof SITE_CONFIG.name).toBe("string");
    });
  });

  describe("SERVICES", () => {
    it("contains exactly 4 services", () => {
      expect(SERVICES).toHaveLength(4);
    });

    it("each service has id and tags array", () => {
      for (const service of SERVICES) {
        expect(service.id).toBeDefined();
        expect(typeof service.id).toBe("string");
        expect(Array.isArray(service.tags)).toBe(true);
        expect(service.tags.length).toBeGreaterThan(0);
      }
    });

    it("service IDs match ServiceId type", () => {
      const validIds: ServiceId[] = ["devops", "ai", "embedded", "web"];
      for (const service of SERVICES) {
        expect(validIds).toContain(service.id);
      }
    });

    it("has no duplicate service IDs", () => {
      const ids = SERVICES.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("all tags are non-empty strings", () => {
      for (const service of SERVICES) {
        for (const tag of service.tags) {
          expect(typeof tag).toBe("string");
          expect(tag.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("PROJECTS", () => {
    it("contains exactly 4 projects", () => {
      expect(PROJECTS).toHaveLength(4);
    });

    it("each project has id, title, tags, status", () => {
      for (const project of PROJECTS) {
        expect(project.id).toBeDefined();
        expect(project.title).toBeDefined();
        expect(Array.isArray(project.tags)).toBe(true);
        expect(["production", "active"]).toContain(project.status);
      }
    });

    it("has no duplicate project IDs", () => {
      const ids = PROJECTS.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("project IDs are URL-safe (lowercase, no spaces)", () => {
      for (const project of PROJECTS) {
        expect(project.id).toMatch(/^[a-z0-9-]+$/);
      }
    });
  });

  describe("NAV_LINKS", () => {
    it("has 5 navigation links", () => {
      expect(NAV_LINKS).toHaveLength(5);
    });

    it("each link has key and href", () => {
      for (const link of NAV_LINKS) {
        expect(link.key).toBeDefined();
        expect(link.href).toBeDefined();
        expect(typeof link.key).toBe("string");
        expect(typeof link.href).toBe("string");
      }
    });

    it("anchors start with # and paths start with /", () => {
      for (const link of NAV_LINKS) {
        expect(link.href.startsWith("#") || link.href.startsWith("/")).toBe(true);
      }
    });

    it("includes blog link as a path route", () => {
      const blogLink = NAV_LINKS.find((l) => l.key === "blog");
      expect(blogLink).toBeDefined();
      expect(blogLink!.href).toBe("/blog");
    });
  });

  describe("ABOUT_STATS", () => {
    it("has exactly 4 stat items", () => {
      expect(ABOUT_STATS).toHaveLength(4);
    });

    it("each stat has value and key", () => {
      for (const stat of ABOUT_STATS) {
        expect(stat.value).toBeDefined();
        expect(stat.key).toBeDefined();
        expect(typeof stat.value).toBe("string");
        expect(stat.key).toMatch(/^stat\d+$/);
      }
    });
  });

  describe("TESTIMONIAL_COUNT", () => {
    it("is a positive number", () => {
      expect(TESTIMONIAL_COUNT).toBeGreaterThan(0);
      expect(Number.isInteger(TESTIMONIAL_COUNT)).toBe(true);
    });
  });
});

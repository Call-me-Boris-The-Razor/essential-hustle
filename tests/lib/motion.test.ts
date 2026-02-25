import { describe, it, expect } from "vitest";
import { EASE_OUT_EXPO, staggerVariants } from "@/lib/motion";

describe("motion.ts", () => {
  describe("EASE_OUT_EXPO", () => {
    it("is a tuple of 4 numbers", () => {
      expect(EASE_OUT_EXPO).toHaveLength(4);
      for (const val of EASE_OUT_EXPO) {
        expect(typeof val).toBe("number");
      }
    });

    it("values are within valid cubic-bezier range [0, 1] for x-coords", () => {
      // x1, x2 must be [0,1]; y1, y2 can exceed [0,1] for overshoot
      expect(EASE_OUT_EXPO[0]).toBeGreaterThanOrEqual(0);
      expect(EASE_OUT_EXPO[0]).toBeLessThanOrEqual(1);
      expect(EASE_OUT_EXPO[2]).toBeGreaterThanOrEqual(0);
      expect(EASE_OUT_EXPO[2]).toBeLessThanOrEqual(1);
    });
  });

  describe("staggerVariants()", () => {
    it("returns hidden and visible variant objects", () => {
      const variants = staggerVariants({ y: 30 });
      expect(variants).toHaveProperty("hidden");
      expect(variants).toHaveProperty("visible");
    });

    it("hidden state has opacity 0 and specified from values", () => {
      const variants = staggerVariants({ y: 30 });
      expect(variants.hidden).toEqual({ opacity: 0, y: 30 });
    });

    it("hidden state with scale preserves scale value", () => {
      const variants = staggerVariants({ scale: 0.8 });
      expect(variants.hidden).toEqual({ opacity: 0, scale: 0.8 });
    });

    it("hidden state with x preserves x value", () => {
      const variants = staggerVariants({ x: -50 });
      expect(variants.hidden).toEqual({ opacity: 0, x: -50 });
    });

    it("visible(0) returns opacity 1, zeroed from values, delay 0", () => {
      const variants = staggerVariants({ y: 30 });
      const visible = variants.visible(0) as Record<string, unknown>;
      expect(visible.opacity).toBe(1);
      expect(visible.y).toBe(0);
      expect((visible.transition as { delay: number }).delay).toBe(0);
    });

    it("visible with scale returns scale 1 (not 0)", () => {
      const variants = staggerVariants({ scale: 0.8 });
      const visible = variants.visible(0) as Record<string, unknown>;
      expect(visible.scale).toBe(1);
    });

    it("visible(i) calculates delay as stagger * i", () => {
      const variants = staggerVariants({ y: 30 }, { stagger: 0.15 });
      expect(variants.visible(0).transition.delay).toBe(0);
      expect(variants.visible(1).transition.delay).toBeCloseTo(0.15);
      expect(variants.visible(2).transition.delay).toBeCloseTo(0.30);
      expect(variants.visible(5).transition.delay).toBeCloseTo(0.75);
    });

    it("uses default stagger 0.1 and duration 0.5", () => {
      const variants = staggerVariants({ y: 30 });
      const visible = variants.visible(3);
      expect(visible.transition.delay).toBeCloseTo(0.3);
      expect(visible.transition.duration).toBe(0.5);
    });

    it("custom duration is propagated", () => {
      const variants = staggerVariants({ y: 30 }, { duration: 0.8 });
      expect(variants.visible(0).transition.duration).toBe(0.8);
    });

    it("transition ease uses EASE_OUT_EXPO", () => {
      const variants = staggerVariants({ y: 30 });
      expect(variants.visible(0).transition.ease).toEqual(EASE_OUT_EXPO);
    });

    it("handles multiple from properties simultaneously", () => {
      const variants = staggerVariants({ y: 30, x: -20 });
      expect(variants.hidden).toEqual({ opacity: 0, y: 30, x: -20 });
      const visible = variants.visible(0) as Record<string, unknown>;
      expect(visible.y).toBe(0);
      expect(visible.x).toBe(0);
    });
  });
});

import { describe, it, expect } from "vitest";
import { buildBreadcrumbLd } from "@/lib/breadcrumb-ld";

describe("breadcrumb-ld.ts", () => {
  describe("buildBreadcrumbLd()", () => {
    it("returns valid BreadcrumbList schema structure", () => {
      const result = buildBreadcrumbLd([]);
      expect(result["@context"]).toBe("https://schema.org");
      expect(result["@type"]).toBe("BreadcrumbList");
      expect(result.itemListElement).toBeDefined();
      expect(Array.isArray(result.itemListElement)).toBe(true);
    });

    it("always includes Home as first item (position 1)", () => {
      const result = buildBreadcrumbLd([]);
      const home = result.itemListElement[0]!;

      expect(home["@type"]).toBe("ListItem");
      expect(home.position).toBe(1);
      expect(home.name).toBe("Essential Hustle");
      expect(home.item).toBe("https://essentialhustle.dev");
    });

    it("returns only Home when items array is empty", () => {
      const result = buildBreadcrumbLd([]);
      expect(result.itemListElement).toHaveLength(1);
    });

    it("adds custom items with correct positions starting at 2", () => {
      const result = buildBreadcrumbLd([
        { name: "Blog", path: "/blog" },
        { name: "Docker Infrastructure", path: "/blog/docker-infra" },
      ]);

      expect(result.itemListElement).toHaveLength(3);
      expect(result.itemListElement[1]!.position).toBe(2);
      expect(result.itemListElement[1]!.name).toBe("Blog");
      expect(result.itemListElement[1]!.item).toBe("https://essentialhustle.dev/blog");
      expect(result.itemListElement[2]!.position).toBe(3);
      expect(result.itemListElement[2]!.name).toBe("Docker Infrastructure");
    });

    it("prepends BASE_URL to all item paths", () => {
      const result = buildBreadcrumbLd([{ name: "Projects", path: "/projects" }]);

      const projectItem = result.itemListElement[1]!;
      expect(projectItem.item).toBe("https://essentialhustle.dev/projects");
    });

    it("all items have @type ListItem", () => {
      const result = buildBreadcrumbLd([
        { name: "Blog", path: "/blog" },
        { name: "Post", path: "/blog/post" },
      ]);

      for (const item of result.itemListElement) {
        expect(item["@type"]).toBe("ListItem");
      }
    });

    it("positions are sequential and monotonically increasing", () => {
      const result = buildBreadcrumbLd([
        { name: "A", path: "/a" },
        { name: "B", path: "/b" },
        { name: "C", path: "/c" },
      ]);

      const positions = result.itemListElement.map((i) => i.position);
      expect(positions).toEqual([1, 2, 3, 4]);
    });

    it("output is valid JSON (serializable)", () => {
      const result = buildBreadcrumbLd([{ name: "Test", path: "/test" }]);
      expect(() => JSON.stringify(result)).not.toThrow();
      const parsed = JSON.parse(JSON.stringify(result));
      expect(parsed["@context"]).toBe("https://schema.org");
    });
  });
});

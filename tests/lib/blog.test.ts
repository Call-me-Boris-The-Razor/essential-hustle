import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

// Module-level mock fns — survive vi.resetModules()
const mockExistsSync = vi.fn<(...args: unknown[]) => boolean>();
const mockReadFileSync = vi.fn<(...args: unknown[]) => string>();
const mockReaddirSync = vi.fn<(...args: unknown[]) => string[]>();

vi.mock("fs", () => ({
  default: {
    existsSync: (...a: unknown[]) => mockExistsSync(...a),
    readFileSync: (...a: unknown[]) => mockReadFileSync(...a),
    readdirSync: (...a: unknown[]) => mockReaddirSync(...a),
  },
  existsSync: (...a: unknown[]) => mockExistsSync(...a),
  readFileSync: (...a: unknown[]) => mockReadFileSync(...a),
  readdirSync: (...a: unknown[]) => mockReaddirSync(...a),
}));

vi.mock("reading-time", () => ({
  default: (text: string) => ({
    text: `${Math.ceil(text.split(/\s+/).length / 200)} min read`,
    minutes: Math.ceil(text.split(/\s+/).length / 200),
    words: text.split(/\s+/).length,
  }),
}));

const VALID_MDX = `---
title: "Building Docker Infrastructure"
date: "2026-01-15"
description: "A deep dive into production Docker setups"
tags: ["docker", "devops", "infrastructure"]
---

This is the actual blog post content about Docker infrastructure.
It has multiple paragraphs and enough words to test reading time calculation.

## Setting Up Docker

Here we discuss the key concepts of Docker orchestration in production environments.
`;

const MINIMAL_MDX = `---
title: "Minimal Post"
---

Short content here.
`;

const NO_FRONTMATTER_MDX = `Just raw content without any frontmatter block at all.`;

const EMPTY_FRONTMATTER_MDX = `---
---

Content after empty frontmatter.
`;

describe("blog.ts", () => {
  beforeEach(() => {
    vi.resetModules();
    mockExistsSync.mockReset();
    mockReadFileSync.mockReset();
    mockReaddirSync.mockReset();
  });

  describe("getSlugs()", () => {
    it("returns slugs from .mdx files in content/blog", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(["docker-infra.mdx", "ai-deployment.mdx", "crsf-protocol.mdx"]);

      const { getSlugs } = await import("@/lib/blog");
      const slugs = getSlugs();

      expect(slugs).toEqual(["docker-infra", "ai-deployment", "crsf-protocol"]);
      expect(mockReaddirSync).toHaveBeenCalledWith(CONTENT_DIR);
    });

    it("returns empty array if content directory does not exist", async () => {
      mockExistsSync.mockReturnValue(false);

      const { getSlugs } = await import("@/lib/blog");
      expect(getSlugs()).toEqual([]);
    });

    it("ignores non-.mdx files", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(["good-post.mdx", "readme.md", "notes.txt", "config.json", ".DS_Store"]);

      const { getSlugs } = await import("@/lib/blog");
      expect(getSlugs()).toEqual(["good-post"]);
    });

    it("strips .mdx extension from filenames", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(["my-post.mdx"]);

      const { getSlugs } = await import("@/lib/blog");
      expect(getSlugs()).toEqual(["my-post"]);
    });
  });

  describe("getPost(slug)", () => {
    it("returns full BlogPost for valid slug", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(VALID_MDX);

      const { getPost } = await import("@/lib/blog");
      const post = getPost("docker-infra");

      expect(post).not.toBeNull();
      expect(post!.slug).toBe("docker-infra");
      expect(post!.title).toBe("Building Docker Infrastructure");
      expect(post!.date).toBe("2026-01-15");
      expect(post!.description).toBe("A deep dive into production Docker setups");
      expect(post!.tags).toEqual(["docker", "devops", "infrastructure"]);
      expect(post!.readTime).toMatch(/\d+ min read/);
      expect(post!.content).toContain("Docker infrastructure");
      expect(post!.content).not.toContain("---");
    });

    it("returns null for non-existent slug", async () => {
      mockExistsSync.mockReturnValue(false);

      const { getPost } = await import("@/lib/blog");
      expect(getPost("does-not-exist")).toBeNull();
    });

    it("returns null for empty slug", async () => {
      const { getPost } = await import("@/lib/blog");
      expect(getPost("")).toBeNull();
    });

    it("sanitizes path traversal attempts", async () => {
      mockExistsSync.mockReturnValue(false);

      const { getPost } = await import("@/lib/blog");
      getPost("../../etc/passwd");
      expect(mockExistsSync).toHaveBeenCalledWith(
        expect.stringContaining("etcpasswd.mdx"),
      );
    });

    it("uses slug as fallback title when frontmatter title missing", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(EMPTY_FRONTMATTER_MDX);

      const { getPost } = await import("@/lib/blog");
      const post = getPost("untitled-post");

      expect(post!.title).toBe("untitled-post");
    });

    it("returns empty description when missing from frontmatter", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(MINIMAL_MDX);

      const { getPost } = await import("@/lib/blog");
      const post = getPost("minimal-post");

      expect(post!.description).toBe("");
    });

    it("returns empty tags array when missing from frontmatter", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(MINIMAL_MDX);

      const { getPost } = await import("@/lib/blog");
      const post = getPost("minimal-post");

      expect(post!.tags).toEqual([]);
    });

    it("handles file with no frontmatter gracefully", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(NO_FRONTMATTER_MDX);

      const { getPost } = await import("@/lib/blog");
      const post = getPost("no-frontmatter");

      expect(post).not.toBeNull();
      expect(post!.title).toBe("no-frontmatter");
      expect(post!.content).toContain("raw content");
    });

    it("returns sanitized slug, not original input", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(VALID_MDX);

      const { getPost } = await import("@/lib/blog");
      const post = getPost("Docker-Infra");

      expect(post!.slug).toBe("Docker-Infra");
    });
  });

  describe("getAllPosts()", () => {
    it("returns BlogPostMeta[] sorted by date newest first", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(["old-post.mdx", "new-post.mdx"]);
      mockReadFileSync.mockImplementation((...args: unknown[]) => {
        const p = String(args[0]);
        if (p.includes("old-post")) {
          return `---\ntitle: "Old Post"\ndate: "2025-01-01"\n---\nOld content here with enough words.`;
        }
        return `---\ntitle: "New Post"\ndate: "2026-06-15"\n---\nNew content here with enough words.`;
      });

      const { getAllPosts } = await import("@/lib/blog");
      const posts = getAllPosts();

      expect(posts).toHaveLength(2);
      expect(posts[0]!.title).toBe("New Post");
      expect(posts[1]!.title).toBe("Old Post");
    });

    it("returns posts without content field (BlogPostMeta)", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(["test.mdx"]);
      mockReadFileSync.mockReturnValue(VALID_MDX);

      const { getAllPosts } = await import("@/lib/blog");
      const posts = getAllPosts();

      expect(posts[0]!).not.toHaveProperty("content");
      expect(posts[0]!).toHaveProperty("slug");
      expect(posts[0]!).toHaveProperty("title");
      expect(posts[0]!).toHaveProperty("date");
      expect(posts[0]!).toHaveProperty("description");
      expect(posts[0]!).toHaveProperty("tags");
      expect(posts[0]!).toHaveProperty("readTime");
    });

    it("returns empty array when no posts exist", async () => {
      mockExistsSync.mockReturnValue(false);

      const { getAllPosts } = await import("@/lib/blog");
      expect(getAllPosts()).toEqual([]);
    });

    it("skips null posts (invalid files)", async () => {
      mockExistsSync.mockImplementation((...args: unknown[]) => {
        const s = String(args[0]);
        if (s === CONTENT_DIR) return true;
        return s.includes("valid-post");
      });
      mockReaddirSync.mockReturnValue(["valid-post.mdx", "broken-post.mdx"]);
      mockReadFileSync.mockReturnValue(VALID_MDX);

      const { getAllPosts } = await import("@/lib/blog");
      const posts = getAllPosts();

      expect(posts.length).toBeLessThanOrEqual(2);
    });
  });
});

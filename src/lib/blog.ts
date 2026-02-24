import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readTime: string;
  content: string;
};

export type BlogPostMeta = Omit<BlogPost, "content">;

/** Get all blog post slugs for static generation */
export const getSlugs = (): string[] => {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
};

/** Sanitize slug to prevent path traversal */
const sanitizeSlug = (slug: string): string =>
  slug.replace(/[^a-z0-9-]/gi, "");

/** Get a single blog post by slug */
export const getPost = (slug: string): BlogPost | null => {
  const safe = sanitizeSlug(slug);
  if (!safe) return null;
  const filePath = path.join(CONTENT_DIR, `${safe}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const { text: readTime } = readingTime(content);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString(),
    description: data.description ?? "",
    tags: data.tags ?? [],
    readTime,
    content,
  };
};

/** Get all posts sorted by date (newest first) */
export const getAllPosts = (): BlogPostMeta[] =>
  getSlugs()
    .map((slug) => {
      const post = getPost(slug);
      if (!post) return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content: _content, ...meta } = post;
      return meta;
    })
    .filter((p): p is BlogPostMeta => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

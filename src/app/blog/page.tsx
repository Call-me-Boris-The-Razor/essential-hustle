import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { SITE_CONFIG } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Blog — ${SITE_CONFIG.name}`,
  description: `Engineering insights, DevOps practices, and technical deep-dives from ${SITE_CONFIG.name}.`,
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <header className="mb-16">
        <span className="font-mono text-sm uppercase tracking-widest text-accent">Blog</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Engineering Notes<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          Technical deep-dives, infrastructure war stories, and lessons from production.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-text-muted">No posts yet. Check back soon.</p>
      ) : (
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>&middot;</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mt-2 text-text-secondary">{post.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3 py-0.5 font-mono text-xs text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

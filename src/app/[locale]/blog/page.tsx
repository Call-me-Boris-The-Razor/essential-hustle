import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getAllPosts } from "@/lib/blog";
import { SITE_CONFIG } from "@/lib/site-config";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: `${t("label")} — ${SITE_CONFIG.name}`,
    description: t("description"),
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <header className="mb-16">
        <span className="font-mono text-sm uppercase tracking-widest text-accent">{t("label")}</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          {t("title")}<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          {t("description")}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-text-muted">{t("noPosts")}</p>
      ) : (
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString(locale, {
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

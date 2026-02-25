import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Clock, Zap, Target, Rocket } from "lucide-react";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildBreadcrumbLd } from "@/lib/breadcrumb-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};

  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: `${cs.title} — ${SITE_CONFIG.name}`,
    description: t(`${cs.slug}.description`),
  };
}

const SECTION_ICONS = {
  challenge: Target,
  solution: Zap,
  result: Rocket,
} as const;

export default async function CaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const t = await getTranslations({ locale, namespace: "projects" });
  const tCs = (key: string) => t(`caseStudy.${key}`);

  const sections = [
    { key: "challenge", icon: SECTION_ICONS.challenge, text: t(`${cs.slug}_challenge`) },
    { key: "solution", icon: SECTION_ICONS.solution, text: t(`${cs.slug}_solution`) },
    { key: "result", icon: SECTION_ICONS.result, text: t(`${cs.slug}_result`) },
  ];

  const breadcrumbLd = buildBreadcrumbLd([
    { name: t("title"), path: "/#projects" },
    { name: cs.title, path: `/projects/${cs.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    <div className="mx-auto max-w-3xl px-6 py-32">
      <Link
        href="/#projects"
        className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-secondary"
        data-umami-event="case-study-back"
      >
        <ArrowLeft size={16} />
        {tCs("backToProjects")}
      </Link>

      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          {cs.title}<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-text-secondary">
          {t(`${cs.slug}.description`)}
        </p>

        {/* Meta row */}
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Clock size={14} />
            <span>{tCs("timeline")}: {cs.timeline}</span>
          </div>
          <span
            className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider ${
              cs.status === "production"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-accent-2/20 bg-accent-2/10 text-accent-2"
            }`}
          >
            {cs.status}
          </span>
        </div>
      </div>

      {/* Challenge / Solution / Result */}
      <div className="space-y-10">
        {sections.map(({ key, icon: Icon, text }) => (
          <section key={key}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2">
                <Icon size={16} className="text-accent" />
              </div>
              <h2 className="font-display text-xl font-semibold tracking-tight">
                {tCs(key)}
              </h2>
            </div>
            <p className="leading-relaxed text-text-secondary pl-11">{text}</p>
          </section>
        ))}
      </div>

      {/* Tech Stack */}
      <section className="mt-16">
        <h2 className="font-display text-xl font-semibold tracking-tight mb-4">
          {tCs("stack")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {cs.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border px-4 py-1.5 font-mono text-xs text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Navigation to other projects */}
      <nav className="mt-20 border-t border-border pt-10">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-text-muted">
          {t("label")}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CASE_STUDIES.filter((p) => p.slug !== cs.slug).map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group rounded-xl border border-border p-4 transition-colors hover:border-border-light hover:bg-surface-1"
              data-umami-event="case-study-nav"
              data-umami-event-slug={p.slug}
            >
              <span className="font-display text-sm font-semibold text-text-primary transition-colors group-hover:text-accent">
                {p.title}
              </span>
              <p className="mt-1 text-xs text-text-muted line-clamp-2">
                {t(`${p.slug}.description`)}
              </p>
            </Link>
          ))}
        </div>
      </nav>
    </div>
    </>
  );
}

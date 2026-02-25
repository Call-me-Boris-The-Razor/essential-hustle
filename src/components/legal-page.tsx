import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

interface LegalSection {
  title: string;
  paragraphs: string[];
  list?: string[];
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
  backLabel: string;
}

export const LegalPage = ({ title, lastUpdated, intro, sections, backLabel }: LegalPageProps) => (
  <div className="mx-auto max-w-3xl px-6 py-32">
    <Link
      href="/"
      className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-secondary"
    >
      <ArrowLeft size={16} />
      {backLabel}
    </Link>

    <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
      {title}<span className="text-accent">.</span>
    </h1>
    <p className="mt-2 font-mono text-sm text-text-muted">{lastUpdated}</p>
    <p className="mt-6 text-lg leading-relaxed text-text-secondary">{intro}</p>

    <div className="mt-12 space-y-10">
      {sections.map((section, i) => (
        <section key={i}>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {section.title}
          </h2>
          {section.paragraphs.map((p, j) => (
            <p key={j} className="mt-3 leading-relaxed text-text-secondary">{p}</p>
          ))}
          {section.list && (
            <ul className="mt-3 space-y-2 pl-5">
              {section.list.map((item, k) => (
                <li key={k} className="list-disc leading-relaxed text-text-secondary">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  </div>
);

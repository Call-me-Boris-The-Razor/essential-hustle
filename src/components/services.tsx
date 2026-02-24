"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/lib/site-config";
import { SectionHeading } from "@/components/ui/section-heading";

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  devops: (
    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M17.5 14v7M14 17.5h7" />
    </svg>
  ),
  ai: (
    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  embedded: (
    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </svg>
  ),
  web: (
    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <path d="M7 8l-4 4 4 4" />
      <path d="M17 8l4 4-4 4" />
      <path d="M14 4l-4 16" />
    </svg>
  ),
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export const Services = () => (
  <section id="services" className="relative py-32">
    <div className="mx-auto max-w-7xl px-6">
      <SectionHeading
        label="What we do"
        title="Services"
        description="End-to-end engineering across the full technology stack."
      />

      {/* Bento grid — asymmetric 2x2 on desktop */}
      <div className="grid gap-4 md:grid-cols-2">
        {SERVICES.map((service, i) => (
          <motion.div
            key={service.id}
            custom={i}
            variants={CARD_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface-1 p-8 transition-colors hover:border-border-light md:p-10"
          >
            {/* Icon */}
            <div className="mb-6 inline-flex rounded-xl bg-surface-2 p-3 text-accent transition-colors group-hover:bg-surface-3">
              {SERVICE_ICONS[service.id]}
            </div>

            <h3 className="font-display text-2xl font-bold text-text-primary">
              {service.title}
            </h3>
            <p className="mt-3 text-text-secondary leading-relaxed">
              {service.description}
            </p>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-xs text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Hover glow — top-right corner */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent/5 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

"use client";

import { motion } from "framer-motion";
import { SERVICES, SERVICES_SECTION } from "@/lib/site-config";
import { staggerVariants } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICE_ICON_MAP } from "@/components/ui/icons";

const CARD_VARIANTS = staggerVariants({ y: 40 });

export const Services = () => (
  <section id="services" aria-labelledby="services-heading" className="relative py-32">
    <div className="mx-auto max-w-7xl px-6">
      <SectionHeading
        id="services-heading"
        label={SERVICES_SECTION.label}
        title={SERVICES_SECTION.title}
        description={SERVICES_SECTION.description}
      />

      {/* Bento grid — asymmetric 2x2 on desktop */}
      <div className="grid gap-4 md:grid-cols-2">
        {SERVICES.map((service, i) => (
          <motion.article
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
              {SERVICE_ICON_MAP[service.id]}
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
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

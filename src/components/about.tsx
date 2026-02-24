"use client";

import { motion } from "framer-motion";
import { ABOUT_TEXT } from "@/lib/site-config";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";

const STAT_VARIANTS = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.1 * i, duration: 0.4, ease: EASE_OUT_EXPO },
  }),
};

export const About = () => (
  <section id="about" aria-labelledby="about-heading" className="relative py-32">
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid gap-16 md:grid-cols-2">
        {/* Left — text */}
        <div>
          <SectionHeading id="about-heading" label="Who we are" title={ABOUT_TEXT.headline} />
          <div className="space-y-4">
            {ABOUT_TEXT.paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-text-secondary">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Right — stats grid */}
        <div className="grid grid-cols-2 gap-4 self-center">
          {ABOUT_TEXT.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={STAT_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-surface-1 p-6 text-center"
            >
              <div className="font-display text-3xl font-bold text-accent md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 font-mono text-xs tracking-wider text-text-muted uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

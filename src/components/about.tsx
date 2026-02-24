"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ABOUT_STATS } from "@/lib/site-config";
import { staggerVariants } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";

const STAT_VARIANTS = staggerVariants({ scale: 0.8 }, { duration: 0.4 });

export const About = () => {
  const t = useTranslations("about");

  return (
    <section id="about" aria-labelledby="about-heading" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Left — text */}
          <div>
            <SectionHeading id="about-heading" label={t("label")} title={t("headline")} />
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-text-secondary">{t("p1")}</p>
              <p className="text-lg leading-relaxed text-text-secondary">{t("p2")}</p>
            </div>
          </div>

          {/* Right — stats grid */}
          <div className="grid grid-cols-2 gap-4 self-center">
            {ABOUT_STATS.map((stat, i) => (
              <motion.div
                key={stat.key}
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
                  {t(stat.key)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { TESTIMONIAL_COUNT } from "@/lib/site-config";
import { staggerVariants } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";

const CARD_VARIANTS = staggerVariants({ y: 30 }, { stagger: 0.12 });

export const Testimonials = () => {
  const t = useTranslations("testimonials");

  return (
    <section aria-labelledby="testimonials-heading" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          id="testimonials-heading"
          label={t("label")}
          title={t("title")}
        />

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {Array.from({ length: TESTIMONIAL_COUNT }, (_, i) => (
            <motion.blockquote
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={CARD_VARIANTS}
              className="relative rounded-2xl border border-border bg-surface-1 p-8"
            >
              <Quote size={24} className="mb-4 text-accent opacity-40" />
              <p className="text-lg leading-relaxed text-text-secondary">
                &ldquo;{t(`items.${i}.quote`)}&rdquo;
              </p>
              <footer className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-medium text-text-primary">{t(`items.${i}.author`)}</p>
                <p className="text-sm text-text-muted">{t(`items.${i}.company`)}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

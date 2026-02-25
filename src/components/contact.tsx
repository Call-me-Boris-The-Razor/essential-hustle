"use client";

import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { SITE_CONFIG } from "@/lib/site-config";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ContactForm } from "@/components/contact-form";

export const Contact = () => {
  const t = useTranslations("contact");

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface-1 px-8 py-20 text-center md:px-16 md:py-28">
          {/* Decorative gradient */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, var(--accent) 0%, transparent 60%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="relative"
          >
            <span className="font-mono text-sm tracking-widest uppercase text-accent">
              {t("label")}
            </span>

            <h2 id="contact-heading" className="mt-4 font-display text-4xl font-bold tracking-tight md:text-6xl">
              {t("headline")}
            </h2>

            <p className="mx-auto mt-6 max-w-lg text-lg text-text-secondary">
              {t("description")}
            </p>

            <address className="mt-10 flex flex-col items-center justify-center gap-4 not-italic sm:flex-row">
              <MagneticButton
                href={`mailto:${SITE_CONFIG.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover"
                data-umami-event="contact-email"
              >
                <Mail size={18} />
                {SITE_CONFIG.email}
              </MagneticButton>

              <MagneticButton
                href={SITE_CONFIG.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-semibold text-text-primary transition-colors hover:border-border-light hover:bg-surface-2"
                data-umami-event="contact-telegram"
              >
                {t("telegram")}
                <ArrowUpRight size={16} />
              </MagneticButton>
            </address>

            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

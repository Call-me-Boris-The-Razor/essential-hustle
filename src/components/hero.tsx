"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { SITE_CONFIG, HERO_TEXT } from "@/lib/site-config";
import { staggerVariants } from "@/lib/motion";
import { DotGrid } from "@/components/ui/dot-grid";
import { MagneticButton } from "@/components/ui/magnetic-button";

const FADE_UP = staggerVariants({ y: 30 }, { stagger: 0.15, duration: 0.6 });

export const Hero = () => (
  <section className="relative flex min-h-screen items-center overflow-hidden">
    <DotGrid opacity={0.08} />

    {/* Gradient orb — decorative */}
    <div
      className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
      style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
    />
    <div
      className="absolute bottom-20 -left-40 h-[400px] w-[400px] rounded-full opacity-10 blur-[100px]"
      style={{ background: "radial-gradient(circle, var(--accent-2) 0%, transparent 70%)" }}
    />

    <div className="relative mx-auto max-w-7xl px-6 py-32 md:py-40">
      <div className="max-w-4xl">
        {/* Tag */}
        <motion.div
          custom={0}
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5"
        >
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs tracking-wider text-text-secondary">
            {HERO_TEXT.badge.toUpperCase()}
          </span>
        </motion.div>

        {/* Headline — asymmetric, mixed fonts */}
        <motion.h1
          custom={1}
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          className="font-display text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl"
        >
          {HERO_TEXT.headline[0]}
          <br />
          <span className="text-accent">{HERO_TEXT.headline[1]}</span>
          <span className="text-text-muted">.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          custom={2}
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary md:text-xl"
        >
          {SITE_CONFIG.description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticButton
            href="#services"
            className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover"
          >
            {HERO_TEXT.cta.primary}
          </MagneticButton>
          <MagneticButton
            href="#projects"
            className="rounded-full border border-border px-8 py-3.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-light hover:bg-surface-1"
          >
            {HERO_TEXT.cta.secondary}
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-20 flex items-center gap-2 text-text-muted"
        >
          <ArrowDown size={16} className="animate-bounce" />
          <span className="font-mono text-xs tracking-wider">{HERO_TEXT.scroll.toUpperCase()}</span>
        </motion.div>
      </div>

      {/* Side label — decorative, desktop only */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 -rotate-90 md:block">
        <span className="font-mono text-xs tracking-[0.3em] text-text-muted/50">
          EST. {HERO_TEXT.established} — {SITE_CONFIG.domain}
        </span>
      </div>
    </div>
  </section>
);

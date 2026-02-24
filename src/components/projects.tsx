"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/site-config";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";

const STATUS_STYLES = {
  production: { label: "Production", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  active: { label: "Active", className: "bg-accent-2/10 text-accent-2 border-accent-2/20" },
} as const;

const ROW_VARIANTS = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.08 * i, duration: 0.5, ease: EASE_OUT_EXPO },
  }),
};

export const Projects = () => (
  <section id="projects" aria-labelledby="projects-heading" className="relative py-32">
    <div className="mx-auto max-w-7xl px-6">
      <SectionHeading
        id="projects-heading"
        label="Our work"
        title="Projects"
        description="Real systems running in production. Not demos, not prototypes."
      />

      {/* Project list — editorial style, not card grid */}
      <ol className="list-none space-y-0 divide-y divide-border">
        {PROJECTS.map((project, i) => (
          <motion.li
            key={project.id}
            custom={i}
            variants={ROW_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="group grid items-center gap-6 py-8 md:grid-cols-12 md:py-10"
          >
            {/* Number */}
            <div className="hidden font-mono text-5xl font-bold text-surface-3 transition-colors group-hover:text-border-light md:col-span-1 md:block">
              {String(i + 1).padStart(2, "0")}
            </div>

            {/* Title + status */}
            <div className="md:col-span-3">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-xl font-bold text-text-primary transition-colors group-hover:text-accent">
                  {project.title}
                </h3>
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_STYLES[project.status].className}`}
                >
                  {STATUS_STYLES[project.status].label}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-text-secondary md:col-span-5">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  </section>
);

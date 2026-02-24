"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/site-config";
import { useActiveSection } from "@/lib/use-active-section";

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(NAV_LINKS.map((l) => l.href));

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-bg/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="font-display text-lg font-bold tracking-tight text-text-primary">
          {SITE_CONFIG.name}
          <span className="text-accent">.</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={activeSection === link.href ? "true" : undefined}
              className={`text-sm transition-colors hover:text-text-primary ${
                activeSection === link.href ? "text-accent" : "text-text-secondary"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-text-secondary md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/50 bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={activeSection === link.href ? "true" : undefined}
                  className={`text-base transition-colors hover:text-text-primary ${
                    activeSection === link.href ? "text-accent" : "text-text-secondary"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="mt-2 rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-bg"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

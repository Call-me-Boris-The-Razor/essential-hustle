"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG, NAV_LINKS, HERO_TEXT } from "@/lib/site-config";
import { useActiveSection } from "@/lib/use-active-section";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const isAnchor = (href: string) => href.startsWith("#");

const navLinkClass = (href: string, active: boolean, size: "sm" | "base" = "sm") =>
  `text-${size} transition-colors hover:text-text-primary ${
    active ? "text-accent" : "text-text-secondary"
  }`;

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const sectionHrefs = useMemo(() => NAV_LINKS.filter((l) => isAnchor(l.href)).map((l) => l.href), []);
  const activeSection = useActiveSection(sectionHrefs);

  const isActive = (href: string) =>
    isAnchor(href) ? activeSection === href : pathname.startsWith(href);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
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
          {NAV_LINKS.map((link) =>
            isAnchor(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "true" : undefined}
                className={navLinkClass(link.href, isActive(link.href))}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "true" : undefined}
                className={navLinkClass(link.href, isActive(link.href))}
              >
                {link.label}
              </Link>
            ),
          )}
          <ThemeToggle />
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
          >
            {HERO_TEXT.ctaContact}
          </a>
        </div>

        {/* Mobile: theme + menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-text-secondary"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
              {NAV_LINKS.map((link) =>
                isAnchor(link.href) ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(link.href) ? "true" : undefined}
                    className={navLinkClass(link.href, isActive(link.href), "base")}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(link.href) ? "true" : undefined}
                    className={navLinkClass(link.href, isActive(link.href), "base")}
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="mt-2 rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-bg"
              >
                {HERO_TEXT.ctaContact}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

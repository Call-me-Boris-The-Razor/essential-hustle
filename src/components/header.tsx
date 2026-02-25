"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/site-config";
import { useActiveSection } from "@/lib/use-active-section";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

const isAnchor = (href: string) => href.startsWith("#");

const SIZE_CLASS = { sm: "text-sm", base: "text-base" } as const;

const navLinkClass = (active: boolean, size: "sm" | "base" = "sm") =>
  `${SIZE_CLASS[size]} transition-colors hover:text-text-primary ${
    active ? "text-accent" : "text-text-secondary"
  }`;

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tHero = useTranslations("hero");
  const tCommon = useTranslations("common");
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
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-bg/80 backdrop-blur-xl pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-text-primary">
          {SITE_CONFIG.name}
          <span className="text-accent">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) =>
            isAnchor(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "true" : undefined}
                className={navLinkClass(isActive(link.href))}
              >
                {t(link.key)}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "true" : undefined}
                className={navLinkClass(isActive(link.href))}
              >
                {t(link.key)}
              </Link>
            ),
          )}
          <LanguageSwitcher />
          <ThemeToggle />
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
            data-umami-event="header-get-in-touch"
          >
            {tHero("ctaContact")}
          </a>
        </div>

        {/* Mobile: language + theme + menu toggle */}
        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-text-secondary"
            aria-label={tCommon("toggleMenu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu — backdrop + panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay — tap to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-bg/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 top-[57px] z-50 max-h-[calc(100dvh-57px)] overflow-y-auto border-t border-border/50 bg-bg/95 backdrop-blur-xl lg:hidden pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV_LINKS.map((link) =>
                  isAnchor(link.href) ? (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive(link.href) ? "true" : undefined}
                      className={`flex min-h-[44px] items-center ${navLinkClass(isActive(link.href), "base")}`}
                    >
                      {t(link.key)}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive(link.href) ? "true" : undefined}
                      className={`flex min-h-[44px] items-center ${navLinkClass(isActive(link.href), "base")}`}
                    >
                      {t(link.key)}
                    </Link>
                  ),
                )}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="mt-2 flex min-h-[44px] items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-bg"
                  data-umami-event="mobile-get-in-touch"
                >
                  {tHero("ctaContact")}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

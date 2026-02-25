"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/site-config";
import { GitHubIcon, TelegramIcon } from "@/components/ui/icons";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");

  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand + version */}
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold text-text-primary">
              {SITE_CONFIG.name}
              <span className="text-accent">.</span>
            </span>
            <span className="text-text-muted">|</span>
            <span className="font-mono text-xs text-text-muted">
              &copy; {currentYear}
            </span>
            {process.env.APP_VERSION && (
              <>
                <span className="text-text-muted">|</span>
                <span className="font-mono text-xs text-text-muted">
                  v{process.env.APP_VERSION}
                  {process.env.GIT_HASH && process.env.GIT_HASH !== "unknown" && (
                    <> · {process.env.GIT_HASH}</>
                  )}
                </span>
              </>
            )}
          </div>

          {/* Nav */}
          <div className="flex flex-wrap justify-center gap-6">
            {NAV_LINKS.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  {t(link.key)}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  {t(link.key)}
                </Link>
              ),
            )}
            <Link
              href="/privacy"
              className="text-sm text-text-muted transition-colors hover:text-text-secondary"
            >
              {tFooter("privacy")}
            </Link>
            <Link
              href="/terms"
              className="text-sm text-text-muted transition-colors hover:text-text-secondary"
            >
              {tFooter("terms")}
            </Link>
          </div>

          {/* Links */}
          <div className="flex gap-4">
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted transition-colors hover:text-text-secondary"
              aria-label="GitHub"
              data-umami-event="footer-github"
            >
              <GitHubIcon />
            </a>
            <a
              href={SITE_CONFIG.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted transition-colors hover:text-text-secondary"
              aria-label="Telegram"
              data-umami-event="footer-telegram"
            >
              <TelegramIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

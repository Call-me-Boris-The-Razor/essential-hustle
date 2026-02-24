# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-02-25

### Added
- Dark/light theme toggle in header (desktop + mobile)
- Light theme CSS variables with WCAG AA contrast ratios
- `next-themes` integration with localStorage persistence
- Lighthouse CI GitHub Actions workflow on every PR (Performance ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95)

### Changed
- `providers.tsx` wraps app with ThemeProvider (data-theme attribute, default dark)
- `layout.tsx` uses `suppressHydrationWarning` for SSR compatibility

## [0.3.2] - 2025-02-25

### Fixed
- Header toggle button: added `type="button"` (was defaulting to submit)
- not-found.tsx: replaced raw `<a>` with `next/link` for client-side routing (ESLint fix)

### Changed
- Extracted `navLinkClass()` helper — eliminates duplicated active state logic in header
- Section descriptions moved to site-config (`SERVICES_SECTION`, `PROJECTS_SECTION`, `ABOUT_SECTION`)
- New `staggerVariants()` factory in motion.ts — replaces boilerplate in 4 section components
- `topic` meta tag derived from SERVICES instead of hardcoded string
- `::selection` color uses `color-mix(var(--accent))` instead of hardcoded hex
- Added skip-to-content link for keyboard navigation (WCAG 2.4.1)

## [0.3.1] - 2025-02-25

### Fixed
- OG image: SVG → auto-generated PNG via opengraph-image.tsx (SVG unsupported by social platforms)
- MagneticButton: external links now support target/rel (Telegram link was missing noopener)
- useActiveSection: memoized sectionHrefs to prevent IntersectionObserver recreation every render
- Mobile menu: added aria-expanded and Escape key handler
- noscript fallback: replaced hardcoded text with site-config values

### Changed
- SERVICE_ICON_MAP: strict ServiceId typing — TypeScript errors if icon missing for a service
- Hardcoded hero/header strings moved to HERO_TEXT in site-config
- Animation easing extracted to shared EASE_OUT_EXPO constant (was duplicated in 5 files)
- JSON-LD knowsAbout derived from SERVICES tags instead of hardcoded array
- /api/site-summary: added Cache-Control + CORS headers
- Security headers added via next.config.ts (X-Frame-Options, HSTS, CSP, Referrer-Policy)

## [0.3.0] - 2025-02-25

### Added
- llms.txt + llms-full.txt for LLM crawler discovery
- JSON-LD structured data (Organization, WebSite, 4x Service schemas)
- Explicit AI bot rules in robots.txt (GPTBot, ClaudeBot, PerplexityBot, etc.)
- security.txt (RFC 9116) and humans.txt
- /api/site-summary JSON endpoint with full site content
- Meta tags for AI attribution (author, publisher, topic, canonical)
- noscript fallback with plain text summary
- link tags for humans.txt and JSON API discovery
- Auto-versioning via GitHub Actions (release.yml)
- AGENT.md (gitignored) with project rules for AI assistants

### Changed
- Semantic HTML: article elements for service cards, ol/li for projects, address for contact
- All sections have aria-labelledby pointing to heading IDs
- section-heading.tsx supports optional id prop
- robots.ts refactored with AI_BOTS array

## [0.2.0] - 2025-02-25

### Added
- Custom 404 page matching site theme
- robots.txt and sitemap.xml (auto-generated via Next.js)
- OG image (SVG, 1200x630) + Twitter card metadata
- Active nav link highlighting via IntersectionObserver + aria-current
- Reusable icon components (DevOps, AI, Embedded, Web, GitHub, Telegram)
- Section dividers between all page sections
- GitHub Actions CI pipeline (lint + type check + build)
- .dockerignore for production builds
- Providers component with MotionConfig reducedMotion

### Fixed
- prefers-reduced-motion: CSS media query + Framer Motion MotionConfig
- Mobile menu body scroll lock
- Contact section text moved to site-config (single source of truth)
- Grain overlay z-index lowered from 9999 to 50

### Changed
- README rewritten with custom SVG visual system (banner, stack, headings, dividers, features)
- Version in banner SVG auto-syncs from package.json via pre-commit hook
- Inline SVG icons extracted into src/components/ui/icons.tsx

## [0.1.0] - 2025-02-25

### Added
- Initial site with Hero, Services, Projects, About, Contact, Footer sections
- Dark theme with orange (#f97316) / cyan (#06b6d4) accent palette
- Design tokens as CSS custom properties in globals.css
- 3 font families: Space Grotesk, Inter, JetBrains Mono
- Framer Motion scroll animations with viewport triggers
- Custom SVG service icons (DevOps, AI, Embedded, Web)
- Magnetic button component with cursor-follow effect
- Dot grid background pattern component
- Grain texture overlay
- Responsive mobile hamburger menu with AnimatePresence
- Centralized site content in `site-config.ts`
- SVG favicon (EH monogram)
- OpenGraph metadata
- `.env.example` with placeholder variables

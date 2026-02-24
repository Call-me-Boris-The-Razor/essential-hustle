# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.1] - 2026-02-25

### Security
- **CSP header** — added Content-Security-Policy with directives for script-src, style-src, img-src, connect-src, object-src, base-uri, form-action, frame-ancestors. Dynamically includes Umami analytics origin. (#104)
- **Rate limiter hardened** — now uses IP from `x-forwarded-for`/`x-real-ip` headers instead of email (trivially bypassed). Added periodic cleanup + 10K entry cap to prevent memory leak. (#105)
- **PII protection** — `console.log` no longer dumps user name/email/message to server logs when webhook is not configured. (#106)
- **npm audit clean** — resolved 8 high severity `minimatch` ReDoS vulnerabilities via `overrides` in package.json. (#102)

### Changed
- `.env.example` updated with accurate env var documentation (#103)
- CORS wildcard on `/api/site-summary` documented as intentional (#107)

## [0.7.0] - 2026-02-25

### Fixed
- **P0: Header, Footer, NotFound** — all navigation now uses locale-aware `Link` and `usePathname` from `@/i18n/routing` instead of `next/link` / `next/navigation`. Blog link, logo, and back-home link now respect active locale. (#88, #89, #90, #93)
- **P0: Contact form validation** — Zod error messages now translated via `useTranslations` instead of hardcoded English. Server action returns error keys instead of strings. (#91, #92)
- **P1: Path traversal** — `blog.ts` `getPost()` now sanitizes slug to `[a-z0-9-]` only. (#94)
- **P1: DRY** — extracted `INPUT_CLASS` constant in `contact-form.tsx`, eliminating 3x duplicated className. (#95)
- **P1: Accessibility** — `ThemeToggle` aria-label now translated for all locales. (#96)
- **P1: Theme sync** — OG image uses shared `THEME_COLORS` from `src/lib/theme.ts` instead of 10+ hardcoded hex values. (#97)

### Changed
- `TESTIMONIAL_COUNT` moved to `site-config.ts` — single source of truth. (#98)
- RSS feed `<language>en</language>` documented as intentional canonical choice. (#99)
- `json-ld.tsx` service schemas use `schema.name` as React key instead of array index. (#100)

### Added
- `src/lib/theme.ts` — shared dark theme color constants for non-CSS contexts
- 10 new translation keys per locale (validation errors, theme toggle labels) — 84 keys total

## [0.6.1] - 2026-02-25

### Fixed
- **Critical: ThemeToggle SSR hang** — `React.use()` with a never-resolving Promise on the server caused every page to hang for ~87s. Replaced with standard `useEffect + useState` mount detection. (#86)

## [0.6.0] - 2026-02-25

### Added
- **i18n support** (EN / RU / ZH) via `next-intl` v4.8
  - Middleware-based locale detection with `localePrefix: "as-needed"`
  - Message files: `messages/en.json`, `messages/ru.json`, `messages/zh.json` (81 keys each)
  - Locale-aware routing: `src/i18n/config.ts`, `routing.ts`, `request.ts`
  - `createNavigation()` for locale-aware `Link`, `useRouter`, `usePathname`
  - `NextIntlClientProvider` in `[locale]/layout.tsx`
- **Language switcher** component (EN / RU / ZH toggle in header)
- **Locale-aware SEO**: hreflang alternates in metadata, sitemap with per-locale entries
- **Local fonts** via `@fontsource-variable` (Space Grotesk, Inter, JetBrains Mono) — no Google Fonts fetch dependency

### Changed
- All UI components migrated to `useTranslations` / `getTranslations`
- `site-config.ts` refactored to structural-only data (URLs, IDs, tags)
- Routes restructured to `src/app/[locale]/` prefix
- Blog pages use locale-aware `Link` and locale-formatted dates
- `opengraph-image.tsx`, `json-ld.tsx`, `api/site-summary` read from EN messages for canonical text
- Sitemap generates entries for all 3 locales with `alternates`

### Fixed
- LanguageSwitcher: uses `next-intl` navigation instead of manual pathname parsing (#78)
- Blog back links now locale-aware (#79)
- Dynamic Tailwind class `text-${size}` replaced with lookup map (#81)
- All hardcoded UI strings translated (#82)
- Indentation drift in hero.tsx, contact.tsx (#83)
- hreflang and sitemap locale support (#84)

### Dependencies
- `next-intl` ^4.8.3
- `@fontsource-variable/space-grotesk`
- `@fontsource-variable/inter`
- `@fontsource-variable/jetbrains-mono`

## [0.5.0] - 2025-02-25

### Added
- **Blog** with MDX support (`/blog`, `/blog/[slug]`)
  - File-based content engine (gray-matter + next-mdx-remote + rehype-pretty-code)
  - Custom MDX components (typography, code blocks, external links)
  - RSS feed at `/feed.xml`
  - JSON-LD BlogPosting schema per post
  - Sitemap updated with blog index + all posts
  - 2 sample posts: Ollama on consumer GPUs, Docker Compose patterns
- **Contact form** with Zod validation and Server Action
  - Name, email, message fields with field-level errors
  - In-memory rate limiting (1/min per email)
  - Configurable webhook via `CONTACT_WEBHOOK_URL` env var
- **Testimonials** section with quote cards and stagger animation
- Blog link in navigation (next/link for client-side routing)
- RSS `<link>` tag in document head

### Changed
- Header handles both anchor (`#`) and page (`/`) links
- `useActiveSection` filters only anchor hrefs
- Dependencies: gray-matter, next-mdx-remote, rehype-pretty-code, shiki, reading-time, zod

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

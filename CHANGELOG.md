# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

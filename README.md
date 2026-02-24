<div align="center">

# Essential Hustle.

**Engineering studio website — from silicon to cloud.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-f97316)](LICENSE)

<br />

[Live Site](https://essentialhustle.dev) · [Report Bug](https://github.com/Call-me-Boris-The-Razor/essential-hustle/issues) · [Request Feature](https://github.com/Call-me-Boris-The-Razor/essential-hustle/issues)

</div>

---

## Overview

Marketing website for **Essential Hustle** — a tech services studio specializing in DevOps, AI integration, embedded systems, and full-stack web development.

### Key Features

- **Dark theme** with orange (#f97316) / cyan (#06b6d4) accent palette
- **3 font families** — Space Grotesk (display), Inter (body), JetBrains Mono (code)
- **Scroll animations** via Framer Motion with viewport-triggered reveals
- **Custom SVG icons** — hand-crafted service icons on 24x24 grid
- **Magnetic buttons** — subtle cursor-follow effect on CTAs
- **Grain texture overlay** — adds tactile depth to the dark background
- **Fully responsive** — mobile hamburger menu with animated transitions
- **Zero hardcode** — all content lives in `site-config.ts`

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI | React | 19.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Animation | Framer Motion | 12.x |
| Icons | Lucide React + Custom SVG | — |
| Fonts | Google Fonts (next/font) | — |

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Design tokens (CSS custom properties)
│   ├── layout.tsx           # Root layout: fonts, metadata, grain overlay
│   └── page.tsx             # Page composition (all sections)
├── components/
│   ├── header.tsx           # Sticky nav + mobile menu
│   ├── hero.tsx             # Hero: headline, CTAs, dot grid, gradient orbs
│   ├── services.tsx         # 4 service cards with custom SVG icons
│   ├── projects.tsx         # Editorial project list with status badges
│   ├── about.tsx            # About text + animated stats grid
│   ├── contact.tsx          # CTA section with gradient overlay
│   ├── footer.tsx           # Brand, nav links, social icons
│   └── ui/
│       ├── dot-grid.tsx     # Background dot pattern
│       ├── magnetic-button.tsx  # Cursor-follow button effect
│       └── section-heading.tsx  # Reusable section header
└── lib/
    └── site-config.ts       # All site content & configuration
```

## Getting Started

### Prerequisites

- **Node.js** >= 22.x
- **npm** (package manager)

### Installation

```bash
git clone https://github.com/Call-me-Boris-The-Razor/essential-hustle.git
cd essential-hustle
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

### Type Check

```bash
npx tsc --noEmit
```

## Configuration

All site content is centralized in [`src/lib/site-config.ts`](src/lib/site-config.ts):

| Constant | Purpose |
|----------|---------|
| `SITE_CONFIG` | Name, domain, tagline, email, social links |
| `NAV_LINKS` | Navigation menu items |
| `SERVICES` | Service cards (title, description, tags) |
| `PROJECTS` | Project showcase (title, description, tags, status) |
| `ABOUT_TEXT` | About section text + stats |

Design tokens are defined as CSS custom properties in [`src/app/globals.css`](src/app/globals.css).

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email displayed on site | No (fallback in config) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID | No |

## License

MIT — see [LICENSE](LICENSE) for details.

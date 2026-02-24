<picture>
  <img src=".github/banner.svg" alt="Essential Hustle" width="100%" />
</picture>

<br />
<br />

We don't use templates. We don't use page builders.
This is a hand-built site for an engineering studio that ships
infrastructure, AI pipelines, embedded firmware, and web apps.

Every pixel, every icon, every animation — written from scratch.

<br />

<picture>
  <img src=".github/stack.svg" alt="Next.js · React · TypeScript · Tailwind · Framer Motion · Custom SVG" width="100%" />
</picture>

<br />

---

<br />

### What's different

Zero content lives in components. One config file drives the entire site:

```
site-config.ts → all text, all links, all project data, all stats
globals.css    → every color, every spacing token, every font assignment
```

Change the config — site updates everywhere. No hunting through JSX.

<br />

Every service icon is hand-drawn on a `24×24` SVG grid. Not pulled from a library.
The GitHub and Telegram icons in the footer — also hand-drawn.
There is no icon dependency besides Lucide for the header nav.

<br />

The magnetic button effect doesn't use a library either.
It reads `clientX`/`clientY` on `mousemove`, calculates offset from center,
and applies `transform: translate` with a configurable strength multiplier.
Simple math, no packages.

<br />

Grain overlay is a `feTurbulence` SVG filter rendered as a `::after` pseudo-element
on `<body>`. Fixed position, `pointer-events: none`, `opacity: 0.03`.
You barely notice it, but remove it and the page feels flat.

<br />

---

<br />

### Why it looks the way it looks

Dark base is `#09090b` — almost black but not quite. Pure black (`#000`) feels
like a hole in the screen. This has just enough warmth.

Orange `#f97316` paired with cyan `#06b6d4`. Warm energy against cold tech.
Two accents from opposite ends of the spectrum — if they were the same hue family
the whole thing would look monotone.

Three typefaces, three jobs. **Space Grotesk** for headlines — geometric, techy,
wide. **Inter** for body text — neutral, readable, disappears. **JetBrains Mono**
for tags and code snippets — because monospace signals "this is technical" without
saying it.

Hero is asymmetric on purpose. Content pushes left, a rotated side label floats
right at `rotate(-90deg)`. Services are a `2×2` bento grid, not a list.
Projects are editorial numbered rows — not cards, because cards all look the same.
About section splits into text left, animated stats right.

<br />

---

<br />

### Run locally

```bash
git clone https://github.com/Call-me-Boris-The-Razor/essential-hustle.git
cd essential-hustle
npm install
npm run dev
```

Node >= 22. Opens at `localhost:3000`.

`npm run version:sync` updates the version in the banner SVG from `package.json`.
This also runs automatically as a pre-commit hook.

<br />

---

<br />

### License

MIT — do whatever you want with it.

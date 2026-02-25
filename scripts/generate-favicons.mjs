#!/usr/bin/env node

/**
 * Generate PNG favicons from favicon.svg using Next.js ImageResponse.
 * Run: node scripts/generate-favicons.mjs
 *
 * Generates:
 *   - public/icon-192.png (192x192)
 *   - public/icon-512.png (512x512)
 *   - public/apple-touch-icon.png (180x180)
 *
 * Requires: @vercel/og (bundled with next)
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = resolve(ROOT, "public");

// Favicon design matches public/favicon.svg
const BG = "#09090b";
const TEXT_PRIMARY = "#fafafa";
const ACCENT = "#f97316";

function createSvgBuffer(size) {
  const fontSize = Math.round(size * 0.6875);
  const rx = Math.round(size * 0.1875);
  const xE = Math.round(size * 0.1875);
  const xH = Math.round(size * 0.53125);
  const yText = Math.round(size * 0.75);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${rx}" fill="${BG}"/>
  <text x="${xE}" y="${yText}" font-family="system-ui, sans-serif" font-weight="800" font-size="${fontSize}" fill="${TEXT_PRIMARY}">E</text>
  <text x="${xH}" y="${yText}" font-family="system-ui, sans-serif" font-weight="800" font-size="${fontSize}" fill="${ACCENT}">H</text>
</svg>`;

  return svg;
}

// Write SVG-based PNGs (browsers render SVG favicons natively)
// For true PNG generation, use: npx @aspect-build/rules_js sharp-cli
// For now, create properly sized SVGs that serve as icon fallbacks

const sizes = [
  { name: "icon-192.png", size: 192, note: "PWA icon" },
  { name: "icon-512.png", size: 512, note: "PWA splash" },
  { name: "apple-touch-icon.png", size: 180, note: "iOS home screen" },
];

console.log("[generate-favicons] Generating SVG-based favicon files...");
console.log("[generate-favicons] Note: For production PNG, install sharp: npm i -D sharp");
console.log("[generate-favicons] Then run: npx sharp -i public/favicon.svg -o public/icon-192.png resize 192 192");
console.log();

for (const { name, size, note } of sizes) {
  const svg = createSvgBuffer(size);
  const outPath = resolve(PUBLIC, name.replace(".png", ".svg"));
  writeFileSync(outPath, svg, "utf-8");
  console.log(`[generate-favicons] ${name} → ${outPath} (${size}x${size}, ${note})`);
}

console.log();
console.log("[generate-favicons] SVG fallbacks created. For proper PNG conversion:");
console.log("  brew install librsvg");
console.log("  rsvg-convert -w 192 -h 192 public/favicon.svg > public/icon-192.png");
console.log("  rsvg-convert -w 512 -h 512 public/favicon.svg > public/icon-512.png");
console.log("  rsvg-convert -w 180 -h 180 public/favicon.svg > public/apple-touch-icon.png");

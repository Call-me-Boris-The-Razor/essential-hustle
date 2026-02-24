#!/usr/bin/env node

/**
 * Reads version from package.json and updates it in .github/banner.svg.
 * Run manually: node scripts/sync-version.mjs
 * Runs automatically via pre-commit hook.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PKG_PATH = resolve(ROOT, "package.json");
const BANNER_PATH = resolve(ROOT, ".github/banner.svg");

const VERSION_PATTERN = /(<text[^>]*>)v[\d.]+(<\/text>\s*$)/m;

const pkg = JSON.parse(readFileSync(PKG_PATH, "utf-8"));
const version = `v${pkg.version}`;

let banner = readFileSync(BANNER_PATH, "utf-8");
const match = banner.match(VERSION_PATTERN);

if (!match) {
  console.error("[sync-version] Could not find version text in banner.svg");
  process.exit(1);
}

const currentInSvg = match[0].match(/v[\d.]+/)?.[0];

if (currentInSvg === version) {
  process.exit(0);
}

banner = banner.replace(VERSION_PATTERN, `$1${version}$2`);
writeFileSync(BANNER_PATH, banner, "utf-8");
console.log(`[sync-version] ${currentInSvg} → ${version}`);

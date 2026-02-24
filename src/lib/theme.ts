/**
 * Shared theme color constants — used in OG image generation and anywhere
 * CSS custom properties are unavailable (e.g. next/og ImageResponse).
 * Keep in sync with globals.css :root variables.
 */
export const THEME_COLORS = {
  bg: "#09090b",
  surface1: "#111113",
  border: "#27272a",
  textPrimary: "#fafafa",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
  accent: "#f97316",
} as const;

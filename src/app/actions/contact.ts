"use server";

import { headers } from "next/headers";
import { contactSchema, type ContactFormData } from "@/lib/contact-schema";
import { sendContactEmail } from "@/lib/mail";
import { sendTelegramNotification } from "@/lib/telegram";

type ActionResult = {
  success: boolean;
  error?: string;
};

/**
 * In-memory rate limiter — single-instance only.
 * Resets on server/container restart. For horizontal scaling, replace with Redis.
 */
const RATE_LIMIT_MS = 60_000; // 1 minute cooldown per client
const MAX_ENTRIES = 10_000;   // Hard cap before forced purge
const PURGE_INTERVAL = 100;   // Purge every N submissions to prevent unbounded growth

const submissions = new Map<string, number>();
let requestCounter = 0;

/** Remove expired entries to bound memory usage */
const purgeExpired = (): void => {
  const now = Date.now();
  for (const [key, ts] of submissions) {
    if (now - ts >= RATE_LIMIT_MS) submissions.delete(key);
  }
};

/** Get client identifier from request headers (IP) with email fallback */
const getClientId = async (email: string): Promise<string> => {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? h.get("x-real-ip")
    ?? email;
};

/** Check and record rate limit. Returns true if client should be blocked. */
const isRateLimited = (clientId: string): boolean => {
  requestCounter++;

  // Periodic purge to prevent stale entry accumulation
  if (requestCounter % PURGE_INTERVAL === 0 || submissions.size > MAX_ENTRIES) {
    purgeExpired();
  }

  const last = submissions.get(clientId);
  if (last && Date.now() - last < RATE_LIMIT_MS) return true;
  submissions.set(clientId, Date.now());
  return false;
};

export async function submitContact(
  data: ContactFormData,
  honeypot?: string,
): Promise<ActionResult> {
  // Honeypot — bots fill this hidden field, humans don't
  if (honeypot) {
    // Silently accept to not reveal detection
    return { success: true };
  }

  // Validate
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "errorInvalid" };
  }

  // Rate limit by IP (with email fallback)
  const clientId = await getClientId(parsed.data.email);
  if (isRateLimited(clientId)) {
    return { success: false, error: "errorRateLimit" };
  }

  // Send email notification (primary delivery)
  const emailSent = await sendContactEmail(parsed.data);

  // Send Telegram notification (fire-and-forget, don't block on failure)
  sendTelegramNotification(parsed.data).catch(() => {});

  if (!emailSent) {
    console.warn("[contact] Email delivery failed — submission from:", parsed.data.email);
    // Still return success if Telegram is configured as fallback
    // Only fail if neither channel is available
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return { success: false, error: "errorSendFailed" };
    }
  }

  return { success: true };
}

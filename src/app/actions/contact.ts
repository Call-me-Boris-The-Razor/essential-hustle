"use server";

import { headers } from "next/headers";
import { contactSchema, type ContactFormData } from "@/lib/contact-schema";

type ActionResult = {
  success: boolean;
  error?: string;
};

const WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL;
const RATE_LIMIT_MS = 60_000;
const MAX_ENTRIES = 10_000;
const submissions = new Map<string, number>();

/** Purge expired entries to prevent unbounded memory growth */
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

/** In-memory rate limiter per IP (resets on server restart) */
const isRateLimited = (clientId: string): boolean => {
  if (submissions.size > MAX_ENTRIES) purgeExpired();
  const last = submissions.get(clientId);
  if (last && Date.now() - last < RATE_LIMIT_MS) return true;
  submissions.set(clientId, Date.now());
  return false;
};

export async function submitContact(data: ContactFormData): Promise<ActionResult> {
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

  // Send to webhook if configured
  if (WEBHOOK_URL) {
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `📩 New contact form submission\n\n*Name:* ${parsed.data.name}\n*Email:* ${parsed.data.email}\n*Message:*\n${parsed.data.message}`,
          ...parsed.data,
        }),
      });

      if (!res.ok) {
        console.error("[contact] Webhook failed:", res.status);
        return { success: false, error: "errorSendFailed" };
      }
    } catch (err) {
      console.error("[contact] Webhook error:", err);
      return { success: false, error: "errorSendFailed" };
    }
  } else {
    // Fallback: confirm receipt without logging PII
    console.log("[contact] Form submission received (no webhook configured)");
  }

  return { success: true };
}

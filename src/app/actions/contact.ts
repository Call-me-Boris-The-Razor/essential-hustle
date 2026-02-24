"use server";

import { contactSchema, type ContactFormData } from "@/lib/contact-schema";

type ActionResult = {
  success: boolean;
  error?: string;
};

const WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL;
const RATE_LIMIT_MS = 60_000;
const submissions = new Map<string, number>();

/** Simple in-memory rate limiter per IP (resets on server restart) */
const isRateLimited = (ip: string): boolean => {
  const last = submissions.get(ip);
  if (last && Date.now() - last < RATE_LIMIT_MS) return true;
  submissions.set(ip, Date.now());
  return false;
};

export async function submitContact(data: ContactFormData): Promise<ActionResult> {
  // Validate
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: firstError };
  }

  // Rate limit (use email as identifier since headers aren't available in Server Actions)
  if (isRateLimited(parsed.data.email)) {
    return { success: false, error: "Please wait before submitting again" };
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
        return { success: false, error: "Failed to send message. Please try again." };
      }
    } catch (err) {
      console.error("[contact] Webhook error:", err);
      return { success: false, error: "Failed to send message. Please try again." };
    }
  } else {
    // Fallback: log to console (development)
    console.log("[contact] Form submission:", parsed.data);
  }

  return { success: true };
}

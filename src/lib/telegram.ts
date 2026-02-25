import type { ContactFormData } from "./contact-schema";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const isConfigured = Boolean(BOT_TOKEN && CHAT_ID);

function formatMessage(data: ContactFormData): string {
  return [
    "📩 *New Contact Form Submission*",
    "",
    `*Name:* ${escapeMarkdown(data.name)}`,
    `*Email:* ${escapeMarkdown(data.email)}`,
    "",
    "*Message:*",
    escapeMarkdown(data.message),
  ].join("\n");
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

/**
 * Send Telegram notification. Fire-and-forget — never throws.
 * Returns true on success, false on failure.
 */
export async function sendTelegramNotification(data: ContactFormData): Promise<boolean> {
  if (!isConfigured) {
    console.warn("[telegram] Bot not configured — skipping notification");
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: formatMessage(data),
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[telegram] Send failed:", res.status, body);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[telegram] Error:", err);
    return false;
  }
}

import nodemailer from "nodemailer";
import type { ContactFormData } from "./contact-schema";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM ?? SMTP_USER;
const MAIL_TO = process.env.MAIL_TO ?? SMTP_USER;

const isConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildNotificationHtml(data: ContactFormData): string {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
      <h2 style="color:#f97316;margin-bottom:16px;">New Contact Form Submission</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#71717a;width:80px;vertical-align:top;">Name</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding:8px 0;color:#71717a;vertical-align:top;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color:#f97316;">${escapeHtml(data.email)}</a></td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#18181b;border-radius:8px;color:#fafafa;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
    </div>
  `;
}

function buildAutoReplyHtml(name: string): string {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
      <h2 style="color:#f97316;margin-bottom:16px;">Thank you, ${escapeHtml(name)}!</h2>
      <p style="color:#a1a1aa;line-height:1.6;">We've received your message and will get back to you within 24 hours.</p>
      <p style="color:#a1a1aa;line-height:1.6;">In the meantime, feel free to reach out directly via <a href="mailto:hello@essentialhustle.dev" style="color:#f97316;">hello@essentialhustle.dev</a></p>
      <p style="margin-top:24px;color:#71717a;font-size:14px;">— Essential Hustle Team</p>
    </div>
  `;
}

/**
 * Send notification email to site owner + auto-reply to sender.
 * Returns true on success, false on failure (never throws).
 */
export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  if (!isConfigured) {
    console.warn("[mail] SMTP not configured — skipping email delivery");
    return false;
  }

  const transport = getTransporter();

  try {
    // Notification to site owner
    await transport.sendMail({
      from: `"Essential Hustle" <${MAIL_FROM}>`,
      to: MAIL_TO,
      replyTo: data.email,
      subject: `[Contact] ${data.name}`,
      html: buildNotificationHtml(data),
    });

    // Auto-reply to sender
    await transport.sendMail({
      from: `"Essential Hustle" <${MAIL_FROM}>`,
      to: data.email,
      subject: "We received your message — Essential Hustle",
      html: buildAutoReplyHtml(data.name),
    });

    return true;
  } catch (err) {
    console.error("[mail] Failed to send email:", err);
    return false;
  }
}

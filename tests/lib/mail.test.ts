import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ContactFormData } from "@/lib/contact-schema";

// Mock nodemailer before importing mail module
const mockSendMail = vi.fn();
vi.mock("nodemailer", () => ({
  default: {
    createTransport: () => ({ sendMail: mockSendMail }),
  },
}));

const validContact: ContactFormData = {
  name: "Boris Kuznetsov",
  email: "boris@example.com",
  message: "I need help setting up Docker infrastructure for production.",
};

describe("mail.ts", () => {
  beforeEach(() => {
    vi.resetModules();
    mockSendMail.mockReset();
  });

  describe("sendContactEmail()", () => {
    it("returns false when SMTP is not configured", async () => {
      delete process.env.SMTP_HOST;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;

      const { sendContactEmail } = await import("@/lib/mail");
      const result = await sendContactEmail(validContact);

      expect(result).toBe(false);
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it("sends notification email and returns true on success", async () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret-password";
      process.env.MAIL_FROM = "noreply@essentialhustle.dev";
      process.env.MAIL_TO = "hello@essentialhustle.dev";
      mockSendMail.mockResolvedValue({ messageId: "test-id" });

      const { sendContactEmail } = await import("@/lib/mail");
      const result = await sendContactEmail(validContact);

      expect(result).toBe(true);
      // Should send 2 emails: notification + auto-reply
      expect(mockSendMail).toHaveBeenCalledTimes(2);
    });

    it("notification email contains sender details", async () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret-password";
      mockSendMail.mockResolvedValue({ messageId: "test-id" });

      const { sendContactEmail } = await import("@/lib/mail");
      await sendContactEmail(validContact);

      const notificationCall = mockSendMail.mock.calls[0][0];
      expect(notificationCall.replyTo).toBe("boris@example.com");
      expect(notificationCall.subject).toContain("Boris Kuznetsov");
      expect(notificationCall.html).toContain("Boris Kuznetsov");
      expect(notificationCall.html).toContain("boris@example.com");
    });

    it("returns false when notification email fails", async () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret-password";
      mockSendMail.mockRejectedValueOnce(new Error("SMTP connection refused"));

      const { sendContactEmail } = await import("@/lib/mail");
      const result = await sendContactEmail(validContact);

      expect(result).toBe(false);
    });

    it("returns true even if auto-reply fails (non-critical)", async () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret-password";
      // First call (notification) succeeds, second (auto-reply) fails
      mockSendMail
        .mockResolvedValueOnce({ messageId: "notification-ok" })
        .mockRejectedValueOnce(new Error("Auto-reply failed"));

      const { sendContactEmail } = await import("@/lib/mail");
      const result = await sendContactEmail(validContact);

      expect(result).toBe(true);
    });

    it("escapes HTML in user input to prevent injection", async () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret-password";
      mockSendMail.mockResolvedValue({ messageId: "test-id" });

      const { sendContactEmail } = await import("@/lib/mail");
      await sendContactEmail({
        name: '<script>alert("xss")</script>',
        email: "test@example.com",
        message: 'Message with <img src=x onerror=alert(1)>',
      });

      const html = mockSendMail.mock.calls[0][0].html;
      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
      expect(html).not.toContain("<img");
    });

    it("sanitizes subject to prevent header injection", async () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret-password";
      mockSendMail.mockResolvedValue({ messageId: "test-id" });

      const { sendContactEmail } = await import("@/lib/mail");
      await sendContactEmail({
        name: "Attacker\r\nBcc: victim@example.com",
        email: "test@example.com",
        message: "Header injection attempt via name field in subject.",
      });

      const subject = mockSendMail.mock.calls[0][0].subject;
      expect(subject).not.toContain("\r");
      expect(subject).not.toContain("\n");
    });

    it("truncates subject to 200 characters max", async () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret-password";
      mockSendMail.mockResolvedValue({ messageId: "test-id" });

      const { sendContactEmail } = await import("@/lib/mail");
      await sendContactEmail({
        ...validContact,
        name: "A".repeat(250),
      });

      const subject = mockSendMail.mock.calls[0][0].subject;
      expect(subject.length).toBeLessThanOrEqual(200);
    });

    it("auto-reply uses SITE_CONFIG.email, not hardcoded value", async () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret-password";
      mockSendMail.mockResolvedValue({ messageId: "test-id" });

      const { sendContactEmail } = await import("@/lib/mail");
      await sendContactEmail(validContact);

      // Auto-reply is the second call
      const autoReplyHtml = mockSendMail.mock.calls[1][0].html;
      expect(autoReplyHtml).toContain("hello@essentialhustle.dev");
    });
  });
});

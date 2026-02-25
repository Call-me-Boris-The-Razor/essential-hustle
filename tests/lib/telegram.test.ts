import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ContactFormData } from "@/lib/contact-schema";

const validContact: ContactFormData = {
  name: "Boris Kuznetsov",
  email: "boris@example.com",
  message: "I need help setting up Docker infrastructure for production.",
};

describe("telegram.ts", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  describe("sendTelegramNotification()", () => {
    it("returns false when bot is not configured", async () => {
      delete process.env.TELEGRAM_BOT_TOKEN;
      delete process.env.TELEGRAM_CHAT_ID;

      const { sendTelegramNotification } = await import("@/lib/telegram");
      const result = await sendTelegramNotification(validContact);

      expect(result).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
    });

    it("returns false when only token is set (no chat ID)", async () => {
      process.env.TELEGRAM_BOT_TOKEN = "123:ABC";
      delete process.env.TELEGRAM_CHAT_ID;

      const { sendTelegramNotification } = await import("@/lib/telegram");
      const result = await sendTelegramNotification(validContact);

      expect(result).toBe(false);
    });

    it("sends message and returns true on success", async () => {
      process.env.TELEGRAM_BOT_TOKEN = "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11";
      process.env.TELEGRAM_CHAT_ID = "-1001234567890";

      vi.mocked(fetch).mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const { sendTelegramNotification } = await import("@/lib/telegram");
      const result = await sendTelegramNotification(validContact);

      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(1);

      const [url, options] = vi.mocked(fetch).mock.calls[0]!;
      expect(url).toContain("api.telegram.org");
      expect(url).toContain("sendMessage");

      const body = JSON.parse((options as RequestInit).body as string);
      expect(body.chat_id).toBe("-1001234567890");
      expect(body.parse_mode).toBe("MarkdownV2");
      expect(body.text).toContain("Boris Kuznetsov");
    });

    it("returns false when API returns non-ok response", async () => {
      process.env.TELEGRAM_BOT_TOKEN = "123:ABC";
      process.env.TELEGRAM_CHAT_ID = "-100123";

      vi.mocked(fetch).mockResolvedValue(
        new Response(JSON.stringify({ ok: false, description: "Bad Request" }), { status: 400 }),
      );

      const { sendTelegramNotification } = await import("@/lib/telegram");
      const result = await sendTelegramNotification(validContact);

      expect(result).toBe(false);
    });

    it("returns false on network error (never throws)", async () => {
      process.env.TELEGRAM_BOT_TOKEN = "123:ABC";
      process.env.TELEGRAM_CHAT_ID = "-100123";

      vi.mocked(fetch).mockRejectedValue(new Error("Network unreachable"));

      const { sendTelegramNotification } = await import("@/lib/telegram");
      const result = await sendTelegramNotification(validContact);

      expect(result).toBe(false);
    });

    it("escapes MarkdownV2 special characters in message", async () => {
      process.env.TELEGRAM_BOT_TOKEN = "123:ABC";
      process.env.TELEGRAM_CHAT_ID = "-100123";

      vi.mocked(fetch).mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const { sendTelegramNotification } = await import("@/lib/telegram");
      await sendTelegramNotification({
        name: "Test_User (Corp.)",
        email: "test+tag@example.com",
        message: "Price is $100. Is that *final*?",
      });

      const body = JSON.parse(
        (vi.mocked(fetch).mock.calls[0]![1] as RequestInit).body as string,
      );
      // MarkdownV2 special chars should be escaped with backslash
      expect(body.text).toContain("\\(");
      expect(body.text).toContain("\\)");
      expect(body.text).toContain("\\.");
      expect(body.text).toContain("\\*");
      expect(body.text).toContain("\\_");
    });

    it("disables web page preview", async () => {
      process.env.TELEGRAM_BOT_TOKEN = "123:ABC";
      process.env.TELEGRAM_CHAT_ID = "-100123";

      vi.mocked(fetch).mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

      const { sendTelegramNotification } = await import("@/lib/telegram");
      await sendTelegramNotification(validContact);

      const body = JSON.parse(
        (vi.mocked(fetch).mock.calls[0]![1] as RequestInit).body as string,
      );
      expect(body.disable_web_page_preview).toBe(true);
    });
  });
});

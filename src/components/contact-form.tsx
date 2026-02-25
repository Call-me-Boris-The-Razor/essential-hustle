"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { submitContact } from "@/app/actions/contact";
import { contactSchema } from "@/lib/contact-schema";

type FormState = "idle" | "success" | "error";

const INPUT_CLASS = "w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const FIELD_ERROR_KEYS: Record<string, Record<string, string>> = {
  name: { too_small: "nameMin", too_big: "nameMax" },
  email: { too_big: "emailMax", invalid_string: "emailInvalid" },
  message: { too_small: "messageMin", too_big: "messageMax" },
};

export const ContactForm = () => {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const t = useTranslations("contact.form");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    // Client-side validation
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]?.toString();
        if (field && !errors[field]) {
          const key = FIELD_ERROR_KEYS[field]?.[issue.code] ?? "errorGeneric";
          errors[field] = t(key);
        }
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    const honeypot = (formData.get("website") as string) || undefined;
    startTransition(async () => {
      const result = await submitContact(parsed.data, honeypot);
      if (result.success) {
        setState("success");
        (e.target as HTMLFormElement).reset();
        if (typeof window !== "undefined" && "umami" in window) {
          (window as unknown as { umami: { track: (event: string) => void } }).umami.track("contact-form-submit");
        }
      } else {
        setState("error");
        setError(t(result.error ?? "errorGeneric"));
      }
    });
  };

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle size={32} className="text-green-500" />
        <p className="text-lg font-medium text-text-primary">{t("success")}</p>
        <p className="text-sm text-text-muted">{t("successSub")}</p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-2 text-sm text-accent underline underline-offset-4 hover:text-accent-hover"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md space-y-4 text-left">
      {/* Honeypot — hidden from humans, traps bots that auto-fill all fields */}
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-text-secondary">
          {t("name")}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={INPUT_CLASS}
          placeholder={t("namePlaceholder")}
        />
        {fieldErrors.name && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-text-secondary">
          {t("email")}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={INPUT_CLASS}
          placeholder={t("emailPlaceholder")}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-text-secondary">
          {t("message")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          className={`${INPUT_CLASS} resize-none`}
          placeholder={t("messagePlaceholder")}
        />
        {fieldErrors.message && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.message}</p>
        )}
      </div>

      {state === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {isPending ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-bg border-t-transparent" />
        ) : (
          <Send size={16} />
        )}
        {isPending ? t("sending") : t("send")}
      </button>
    </form>
  );
};

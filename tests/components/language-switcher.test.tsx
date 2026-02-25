import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

describe("LanguageSwitcher", () => {
  it("renders 3 locale buttons (EN, RU, ZH)", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("RU")).toBeInTheDocument();
    expect(screen.getByText("ZH")).toBeInTheDocument();
  });

  it("all buttons have type='button'", () => {
    render(<LanguageSwitcher />);
    const buttons = screen.getAllByRole("button");
    for (const btn of buttons) {
      expect(btn).toHaveAttribute("type", "button");
    }
  });

  it("current locale button has aria-current='true'", () => {
    render(<LanguageSwitcher />);
    // Default locale mock returns "en"
    const enBtn = screen.getByText("EN");
    expect(enBtn).toHaveAttribute("aria-current", "true");
  });

  it("non-current locale buttons do not have aria-current", () => {
    render(<LanguageSwitcher />);
    const ruBtn = screen.getByText("RU");
    const zhBtn = screen.getByText("ZH");
    expect(ruBtn).not.toHaveAttribute("aria-current");
    expect(zhBtn).not.toHaveAttribute("aria-current");
  });

  it("each button has data-umami-event-locale attribute", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText("EN")).toHaveAttribute("data-umami-event-locale", "en");
    expect(screen.getByText("RU")).toHaveAttribute("data-umami-event-locale", "ru");
    expect(screen.getByText("ZH")).toHaveAttribute("data-umami-event-locale", "zh");
  });

  it("each button has aria-label with locale name", () => {
    render(<LanguageSwitcher />);
    const buttons = screen.getAllByRole("button");
    for (const btn of buttons) {
      expect(btn).toHaveAttribute("aria-label");
    }
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MagneticButton } from "@/components/ui/magnetic-button";

describe("MagneticButton", () => {
  it("renders as <a> when href is provided", () => {
    render(<MagneticButton href="https://example.com">Link</MagneticButton>);
    const el = screen.getByText("Link");
    expect(el.tagName).toBe("A");
    expect(el).toHaveAttribute("href", "https://example.com");
  });

  it("renders as <button type='button'> when href is not provided", () => {
    render(<MagneticButton>Click me</MagneticButton>);
    const el = screen.getByText("Click me");
    expect(el.tagName).toBe("BUTTON");
    expect(el).toHaveAttribute("type", "button");
  });

  it("passes target and rel to <a>", () => {
    render(
      <MagneticButton href="/link" target="_blank" rel="noopener noreferrer">
        External
      </MagneticButton>,
    );
    const el = screen.getByText("External");
    expect(el).toHaveAttribute("target", "_blank");
    expect(el).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("passes data-* attributes", () => {
    render(
      <MagneticButton href="/test" data-umami-event="click-cta">
        CTA
      </MagneticButton>,
    );
    const el = screen.getByText("CTA");
    expect(el).toHaveAttribute("data-umami-event", "click-cta");
  });

  it("applies custom className", () => {
    render(<MagneticButton className="custom-class">Btn</MagneticButton>);
    const el = screen.getByText("Btn");
    expect(el.className).toContain("custom-class");
  });

  it("has focus-visible outline class for accessibility", () => {
    render(<MagneticButton>Accessible</MagneticButton>);
    const el = screen.getByText("Accessible");
    expect(el.className).toContain("focus-visible:outline");
  });
});

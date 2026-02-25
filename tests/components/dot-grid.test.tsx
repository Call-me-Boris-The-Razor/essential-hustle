import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DotGrid } from "@/components/ui/dot-grid";

describe("DotGrid", () => {
  it("renders a div with pointer-events-none", () => {
    const { container } = render(<DotGrid />);
    const div = container.firstElementChild!;
    expect(div.className).toContain("pointer-events-none");
    expect(div.className).toContain("absolute");
  });

  it("applies default styles (dotSize=1, gap=24, opacity=0.12)", () => {
    const { container } = render(<DotGrid />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.backgroundSize).toBe("24px 24px");
    expect(div.style.opacity).toBe("0.12");
  });

  it("accepts custom dotSize, gap, opacity", () => {
    const { container } = render(<DotGrid dotSize={2} gap={32} opacity={0.2} />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.backgroundSize).toBe("32px 32px");
    expect(div.style.opacity).toBe("0.2");
  });

  it("applies custom className", () => {
    const { container } = render(<DotGrid className="z-10" />);
    const div = container.firstElementChild!;
    expect(div.className).toContain("z-10");
  });
});

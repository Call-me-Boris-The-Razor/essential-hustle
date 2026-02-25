import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeading } from "@/components/ui/section-heading";

describe("SectionHeading", () => {
  it("renders label and title", () => {
    render(<SectionHeading label="What we do" title="Services" />);
    expect(screen.getByText("What we do")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
  });

  it("renders optional description when provided", () => {
    render(
      <SectionHeading
        label="Label"
        title="Title"
        description="Some description text"
      />,
    );
    expect(screen.getByText("Some description text")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = render(<SectionHeading label="Label" title="Title" />);
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(0);
  });

  it("sets id on h2 when provided", () => {
    render(<SectionHeading label="Label" title="Services" id="services" />);
    const heading = screen.getByText("Services");
    expect(heading.id).toBe("services");
  });

  it("label has uppercase tracking-widest mono style", () => {
    render(<SectionHeading label="Label" title="Title" />);
    const label = screen.getByText("Label");
    expect(label.className).toContain("uppercase");
    expect(label.className).toContain("font-mono");
  });
});

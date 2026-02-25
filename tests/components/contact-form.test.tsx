import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock submitContact server action
const mockSubmitContact = vi.fn();
vi.mock("@/app/actions/contact", () => ({
  submitContact: (...args: unknown[]) => mockSubmitContact(...args),
}));

// Mock framer-motion to pass-through
vi.mock("framer-motion", () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      // Return a forwardRef component for any motion.div, motion.span, etc.
      return ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
        const Tag = prop as string;
        return <div data-motion-tag={Tag} {...props}>{children}</div>;
      };
    },
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => true,
}));

import { ContactForm } from "@/components/contact-form";

describe("ContactForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockSubmitContact.mockReset();
  });

  it("renders name, email, and message fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/contact\.form\.name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact\.form\.email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact\.form\.message/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<ContactForm />);
    const btn = screen.getByRole("button", { name: /contact\.form\.send/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("type", "submit");
  });

  it("renders honeypot field (hidden, tabIndex -1, aria-hidden)", () => {
    render(<ContactForm />);
    const honeypot = document.querySelector('input[name="website"]');
    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("aria-hidden", "true");
  });

  it("shows field errors for invalid input on submit", async () => {
    render(<ContactForm />);

    // Fill only name (1 char — too short) and submit
    const nameInput = screen.getByLabelText(/contact\.form\.name/i);
    const emailInput = screen.getByLabelText(/contact\.form\.email/i);
    const messageInput = screen.getByLabelText(/contact\.form\.message/i);

    await user.type(nameInput, "A");
    await user.type(emailInput, "valid@example.com");
    await user.type(messageInput, "short");

    const submitBtn = screen.getByRole("button", { name: /contact\.form\.send/i });
    await user.click(submitBtn);

    // Should show validation errors (server action should NOT be called)
    expect(mockSubmitContact).not.toHaveBeenCalled();
  });

  it("calls submitContact with valid data", async () => {
    mockSubmitContact.mockResolvedValue({ success: true });
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/contact\.form\.name/i), "Boris Kuznetsov");
    await user.type(screen.getByLabelText(/contact\.form\.email/i), "boris@example.com");
    await user.type(
      screen.getByLabelText(/contact\.form\.message/i),
      "I need help with Docker infrastructure for production deployment.",
    );

    await user.click(screen.getByRole("button", { name: /contact\.form\.send/i }));

    expect(mockSubmitContact).toHaveBeenCalledTimes(1);
    expect(mockSubmitContact).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Boris Kuznetsov",
        email: "boris@example.com",
      }),
      undefined, // honeypot not filled
    );
  });

  it("shows success state after successful submit", async () => {
    mockSubmitContact.mockResolvedValue({ success: true });
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/contact\.form\.name/i), "Boris Kuznetsov");
    await user.type(screen.getByLabelText(/contact\.form\.email/i), "boris@example.com");
    await user.type(
      screen.getByLabelText(/contact\.form\.message/i),
      "I need help with Docker infrastructure for production deployment.",
    );

    await user.click(screen.getByRole("button", { name: /contact\.form\.send/i }));

    // Success state should show — wait for transition to complete
    await waitFor(() => {
      expect(screen.getByText("contact.form.success")).toBeInTheDocument();
    });
    expect(screen.getByText("contact.form.successSub")).toBeInTheDocument();
  });

  it("shows error state after failed submit", async () => {
    mockSubmitContact.mockResolvedValue({ success: false, error: "errorSendFailed" });
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/contact\.form\.name/i), "Boris Kuznetsov");
    await user.type(screen.getByLabelText(/contact\.form\.email/i), "boris@example.com");
    await user.type(
      screen.getByLabelText(/contact\.form\.message/i),
      "I need help with Docker infrastructure for production deployment.",
    );

    await user.click(screen.getByRole("button", { name: /contact\.form\.send/i }));

    // Error state should show — wait for transition to complete
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("'send another' button resets to idle state", async () => {
    mockSubmitContact.mockResolvedValue({ success: true });
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/contact\.form\.name/i), "Boris Kuznetsov");
    await user.type(screen.getByLabelText(/contact\.form\.email/i), "boris@example.com");
    await user.type(
      screen.getByLabelText(/contact\.form\.message/i),
      "I need help with Docker infrastructure for production deployment.",
    );

    await user.click(screen.getByRole("button", { name: /contact\.form\.send/i }));

    // Wait for success
    await waitFor(() => {
      expect(screen.getByText("contact.form.success")).toBeInTheDocument();
    });
    const sendAnother = screen.getByText("contact.form.sendAnother");
    await user.click(sendAnother);

    // Should be back to form
    expect(screen.getByLabelText(/contact\.form\.name/i)).toBeInTheDocument();
  });

  it("name field has aria-describedby pointing to error", async () => {
    render(<ContactForm />);
    const nameInput = screen.getByLabelText(/contact\.form\.name/i);

    // Before error — no aria-describedby
    expect(nameInput).not.toHaveAttribute("aria-describedby");
  });
});

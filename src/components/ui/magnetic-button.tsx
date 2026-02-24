"use client";

import { useRef, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
  strength?: number;
  target?: string;
  rel?: string;
}

export const MagneticButton = ({
  children,
  href,
  className = "",
  strength = 0.15,
  target,
  rel,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  const props = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: `inline-flex items-center justify-center transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`,
  };

  if (href) {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} target={target} rel={rel} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" ref={ref as React.RefObject<HTMLButtonElement>} {...props}>
      {children}
    </button>
  );
};

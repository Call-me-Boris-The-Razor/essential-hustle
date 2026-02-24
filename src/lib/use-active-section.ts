"use client";

import { useState, useEffect } from "react";

/**
 * Tracks which section is currently visible in the viewport
 * using IntersectionObserver. Returns the href of the active section.
 */
export const useActiveSection = (sectionIds: readonly string[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id.replace("#", "")))
      .filter(Boolean) as HTMLElement[];

    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
};

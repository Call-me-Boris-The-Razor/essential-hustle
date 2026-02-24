"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => (
  <ThemeProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange>
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  </ThemeProvider>
);

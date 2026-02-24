"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);

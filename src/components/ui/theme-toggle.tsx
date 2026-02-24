"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { use } from "react";

/** Resolves after first client render — avoids useEffect + setState lint warning */
const mountPromise = typeof window !== "undefined"
  ? Promise.resolve(true)
  : new Promise<boolean>(() => {});

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = use(mountPromise);

  // Prevent hydration mismatch — render placeholder on server
  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

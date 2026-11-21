"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "stylevique-theme";

/**
 * Light/dark theme switch. The initial class is applied by the inline script
 * in the root layout, so there is no flash before hydration. Clicking stores
 * an explicit choice which overrides the device preference.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
  }, []);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Private browsing should still allow switching for this session.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {isDark ? (
        <Sun className="size-[1.1rem]" aria-hidden="true" />
      ) : (
        <Moon className="size-[1.1rem]" aria-hidden="true" />
      )}
    </button>
  );
}

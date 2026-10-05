import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getTheme, toggleTheme, THEME_EVENT, type Theme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    const sync = () => setThemeState(getTheme());
    sync();
    const scheme = window.matchMedia("(prefers-color-scheme: light)");
    window.addEventListener(THEME_EVENT, sync);
    scheme.addEventListener("change", sync);
    return () => {
      window.removeEventListener(THEME_EVENT, sync);
      scheme.removeEventListener("change", sync);
    };
  }, []);

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme ? `Switch to ${next} theme` : "Toggle theme"}
      title={theme ? `Switch to ${next} theme` : "Toggle theme"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary ${className}`}
    >
      {theme === "light" ? (
        <Moon aria-hidden className="h-4 w-4" />
      ) : (
        <Sun aria-hidden className="h-4 w-4" />
      )}
    </button>
  );
}

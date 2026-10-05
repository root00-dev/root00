export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
export const THEME_EVENT = "themechange";

// Runs inline in <head> before paint so a saved theme never flashes.
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})()`;

export function getTheme(): Theme {
  const explicit = document.documentElement.dataset["theme"];
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset["theme"] = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode); the choice still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

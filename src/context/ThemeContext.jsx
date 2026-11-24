import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

function getInitialTheme() {
  try {
    const saved = window.localStorage.getItem("internplatform-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try { window.localStorage.setItem("internplatform-theme", theme); } catch { /* Storage may be unavailable. */ }
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((current) => current === "dark" ? "light" : "dark"), []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? "light" : "dark"} mode`} title={`Switch to ${isDark ? "light" : "dark"} mode`} className="theme-toggle fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-4 py-3 text-sm font-semibold text-text-primary shadow-lg backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
      <span aria-hidden="true" className="text-lg">{isDark ? "☀" : "☾"}</span>
      <span>{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}

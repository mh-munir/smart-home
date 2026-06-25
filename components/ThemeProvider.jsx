"use client";

import { createContext, useContext, useState, useEffect, useCallback, memo } from "react";

const ThemeContext = createContext(null);

const THEMES = {
  light: "light",
  dark: "dark",
  system: "system",
};

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("system");
  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("smart-home-theme");
    if (stored && THEMES[stored]) {
      setThemeState(stored);
    } else {
      setThemeState("system");
    }
  }, []);

  useEffect(() => {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(resolved);

    // Defer DOM class manipulation to next animation frame to avoid forced reflow
    const applyClass = (isDark) => {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
      }
    };

    const rafId = requestAnimationFrame(() => applyClass(resolved === "dark"));

    // If system theme, listen for OS preference changes
    if (theme !== "system") return () => cancelAnimationFrame(rafId);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      setResolvedTheme(e.matches ? "dark" : "light");
      requestAnimationFrame(() => applyClass(e.matches));
    };

    mediaQuery.addEventListener("change", handler);
    return () => {
      cancelAnimationFrame(rafId);
      mediaQuery.removeEventListener("change", handler);
    };
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    if (THEMES[newTheme]) {
      setThemeState(newTheme);
      localStorage.setItem("smart-home-theme", newTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "system",
      resolvedTheme: "light",
      setTheme: () => {},
    };
  }
  return context;
}

const MemoizedThemeProvider = memo(ThemeProvider);

export { MemoizedThemeProvider as ThemeProvider, useTheme };
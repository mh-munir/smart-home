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

    const root = document.documentElement;
    if (resolved === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      setResolvedTheme(e.matches ? "dark" : "light");
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
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
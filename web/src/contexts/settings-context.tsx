"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SettingsContextType {
  graphDataPoints: number;
  setGraphDataPoints: (points: number) => void;
  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [graphDataPoints, setGraphDataPointsState] = useState<number>(50);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const storedPoints = localStorage.getItem("graphDataPoints");
    if (storedPoints) {
      const points = parseInt(storedPoints, 10);
      if (points >= 10 && points <= 500) {
        setGraphDataPointsState(points);
      }
    }

    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = storedTheme === "dark" || (!storedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setGraphDataPoints = (points: number) => {
    if (points >= 10 && points <= 500) {
      setGraphDataPointsState(points);
      if (typeof window !== "undefined") {
        localStorage.setItem("graphDataPoints", points.toString());
      }
    }
  };

  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDark ? "dark" : "light");
      
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  return (
    <SettingsContext.Provider value={{ graphDataPoints, setGraphDataPoints, isDarkMode, setDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}


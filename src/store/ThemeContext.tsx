'use client';

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  themeColor: string;
  setThemeColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeColor: "#4C1D3D",
  setThemeColor: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeColor, setThemeColor] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedColor = localStorage.getItem("themeColor") || "#4C1D3D";
      setThemeColor(storedColor);
      document.documentElement.style.setProperty("--theme-color", storedColor);
    }
  }, []);

  // Sync with localStorage and CSS var on change
  useEffect(() => {
    if (themeColor) {
      document.documentElement.style.setProperty("--theme-color", themeColor);
      localStorage.setItem("themeColor", themeColor);
    }
  }, [themeColor]);

  // Don't render children until themeColor is loaded
  if (!themeColor) return null;

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

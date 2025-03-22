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
  const [themeColor, setThemeColor] = useState<string>("#4C1D3D");

  // Read from localStorage safely in useEffect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedColor = localStorage.getItem("themeColor");
      if (storedColor) {
        setThemeColor(storedColor);
        document.documentElement.style.setProperty("--theme-color", storedColor);
      } else {
        document.documentElement.style.setProperty("--theme-color", themeColor);
      }
    }
  }, []);

  // Update localStorage and CSS variable on color change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("themeColor", themeColor);
      document.documentElement.style.setProperty("--theme-color", themeColor);
    }
  }, [themeColor]);

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

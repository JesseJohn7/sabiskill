"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/app/lib/supabase/client";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyTheme = (isDarkMode: boolean) => {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (isDarkMode) {
    html.classList.add("dark");
    document.body.style.colorScheme = "dark";
  } else {
    html.classList.remove("dark");
    document.body.style.colorScheme = "light";
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Load theme on mount
  useEffect(() => {
    const stored = localStorage.getItem("sabiskill_theme");
    const newIsDark = stored ? stored === "dark" : true;
    setIsDark(newIsDark);
    applyTheme(newIsDark);
    setIsMounted(true);
  }, []);

  // Apply theme whenever isDark changes (after mounted)
  useEffect(() => {
    if (!isMounted) return;
    applyTheme(isDark);
  }, [isDark, isMounted]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  // Save theme changes to localStorage and Supabase
  useEffect(() => {
    if (!isMounted) return;
    
    localStorage.setItem("sabiskill_theme", isDark ? "dark" : "light");
    
    // Save to Supabase (non-blocking)
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("user_preferences").upsert({
            user_id: user.id,
            theme: isDark ? "dark" : "light",
            updated_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.log("Could not save theme:", error);
      }
    })();
  }, [isDark, isMounted]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

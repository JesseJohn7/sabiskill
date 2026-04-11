"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/app/lib/supabase/client";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load theme preference from localStorage and Supabase
  useEffect(() => {
    const loadTheme = async () => {
      // First check localStorage
      const stored = localStorage.getItem("sabiskill_theme");
      if (stored !== null) {
        const isDarkMode = stored === "dark";
        setIsDark(isDarkMode);
        applyTheme(isDarkMode);
        setMounted(true);
        return;
      }

      // Try to fetch from Supabase
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("user_preferences")
            .select("theme")
            .eq("user_id", user.id)
            .maybeSingle();

          if (!error && data?.theme) {
            const isDarkMode = data.theme === "dark";
            setIsDark(isDarkMode);
            applyTheme(isDarkMode);
            localStorage.setItem("sabiskill_theme", isDarkMode ? "dark" : "light");
          }
        }
      } catch (e) {
        console.log("Could not fetch theme from Supabase:", e);
      }
      
      applyTheme(false);
      setMounted(true);
    };

    loadTheme();
  }, []);

  const applyTheme = (isDarkMode: boolean) => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    applyTheme(newIsDark);
    
    // Save to localStorage
    localStorage.setItem("sabiskill_theme", newIsDark ? "dark" : "light");

    // Save to Supabase
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("user_preferences").upsert(
          {
            user_id: user.id,
            theme: newIsDark ? "dark" : "light",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      }
    } catch (e) {
      console.log("Could not save theme to Supabase:", e);
    }
  };

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

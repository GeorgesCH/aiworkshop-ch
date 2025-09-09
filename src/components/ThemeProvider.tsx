import React, { createContext, useContext, useEffect } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light", // Force light as default
  storageKey = "ai-workshop-theme",
  ...props
}: ThemeProviderProps) {
  // Force light theme immediately and clear any stored theme
  useEffect(() => {
    // Clear any stored theme preference
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }, [storageKey]);

  // Force light theme class and remove dark theme aggressively
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme-related classes
    root.classList.remove("light", "dark", "system");
    root.classList.add("light");
    
    // Force remove dark class from body as well (in case it exists)
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    
    // Also ensure no dark attribute exists
    root.removeAttribute("data-theme");
    root.setAttribute("data-theme", "light");
  }, []);

  // No system theme listening needed - always light mode

  const value = {
    theme: "light", // Always return light theme
    setTheme: (theme: Theme) => {
      // Force light theme only - ignore any theme change requests
      console.warn("Theme switching is disabled. Only light mode is available.");
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

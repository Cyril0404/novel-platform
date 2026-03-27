"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ReaderTheme = "light" | "dark" | "sepia" | "amoled";
export type FontFamily = "sans" | "serif" | "mono" | "system";
export type TextAlign = "left" | "justify";

interface ReadingSettings {
  theme: ReaderTheme;
  fontSize: number;
  lineHeight: number;
  fontFamily: FontFamily;
  margin: number;
  textAlign: TextAlign;
}

interface ReadingSettingsContextType extends ReadingSettings {
  setTheme: (theme: ReaderTheme) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setFontFamily: (family: FontFamily) => void;
  setMargin: (margin: number) => void;
  setTextAlign: (align: TextAlign) => void;
}

const STORAGE_KEY = "novel-platform-reading-settings";

const defaultSettings: ReadingSettings = {
  theme: "light",
  fontSize: 18,
  lineHeight: 1.8,
  fontFamily: "sans",
  margin: 16,
  textAlign: "left",
};

const ReadingSettingsContext = createContext<ReadingSettingsContextType | undefined>(undefined);

export function ReadingSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ReadingSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ReadingSettings>;
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error("Failed to load reading settings:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save reading settings:", error);
      }
    }
  }, [settings, isLoaded]);

  const setTheme = useCallback((theme: ReaderTheme) => {
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  const setFontSize = useCallback((fontSize: number) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  }, []);

  const setLineHeight = useCallback((lineHeight: number) => {
    setSettings((prev) => ({ ...prev, lineHeight }));
  }, []);

  const setFontFamily = useCallback((fontFamily: FontFamily) => {
    setSettings((prev) => ({ ...prev, fontFamily }));
  }, []);

  const setMargin = useCallback((margin: number) => {
    setSettings((prev) => ({ ...prev, margin }));
  }, []);

  const setTextAlign = useCallback((textAlign: TextAlign) => {
    setSettings((prev) => ({ ...prev, textAlign }));
  }, []);

  return (
    <ReadingSettingsContext.Provider
      value={{
        ...settings,
        setTheme,
        setFontSize,
        setLineHeight,
        setFontFamily,
        setMargin,
        setTextAlign,
      }}
    >
      {children}
    </ReadingSettingsContext.Provider>
  );
}

export function useReadingSettings() {
  const context = useContext(ReadingSettingsContext);
  if (!context) {
    throw new Error("useReadingSettings must be used within ReadingSettingsProvider");
  }
  return context;
}

// Font family CSS mappings
export const fontFamilyClasses: Record<FontFamily, string> = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
  system: "font-system",
};

export const fontFamilyLabels: Record<FontFamily, string> = {
  sans: "Sans",
  serif: "Serif",
  mono: "Mono",
  system: "System",
};

// Theme display names
export const themeLabels: Record<ReaderTheme, string> = {
  light: "Light",
  dark: "Dark",
  sepia: "Sepia",
  amoled: "AMOLED",
};

// Theme background colors
export const themeClasses: Record<ReaderTheme, { bg: string; card: string; text: string; muted: string }> = {
  light: {
    bg: "bg-stone-50",
    card: "bg-white/80",
    text: "text-stone-800",
    muted: "text-stone-500",
  },
  dark: {
    bg: "bg-stone-950",
    card: "bg-stone-900/50",
    text: "text-stone-100",
    muted: "text-stone-400",
  },
  sepia: {
    bg: "bg-amber-50",
    card: "bg-amber-100/50",
    text: "text-stone-800",
    muted: "text-amber-700",
  },
  amoled: {
    bg: "bg-black",
    card: "bg-black",
    text: "text-zinc-100",
    muted: "text-zinc-500",
  },
};

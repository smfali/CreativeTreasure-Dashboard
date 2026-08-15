"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export const accentOptions = [
  { label: "Emerald", rgb: "16 185 129" },
  { label: "Blue", rgb: "59 130 246" },
  { label: "Purple", rgb: "139 92 246" },
  { label: "Rose", rgb: "244 63 94" },
  { label: "Amber", rgb: "245 158 11" },
  { label: "Cyan", rgb: "6 182 212" },
] as const;

export type Accent = (typeof accentOptions)[number]["rgb"];

interface AccentContextValue {
  accent: Accent;
  setAccent: (c: Accent) => void;
}

const AccentContext = createContext<AccentContextValue | null>(null);

export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<Accent>(accentOptions[0].rgb);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent() {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error("useAccent must be used within AccentProvider");
  return ctx;
}

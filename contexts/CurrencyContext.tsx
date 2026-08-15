"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Currency = "USD" | "EUR" | "GBP";

const symbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  symbol: string;
  format: (value: string) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const symbol = symbols[currency];

  function format(value: string) {
    return value.replace(/^\$/, symbol);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

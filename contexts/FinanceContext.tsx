"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  buildFinanceData,
  financeToday,
  payoutToTransaction,
  type FinanceSummary,
  type FinanceTransaction,
  type Payout,
} from "@/lib/data/finance";
import { useOrders } from "./OrdersContext";

interface FinanceContextValue {
  transactions: FinanceTransaction[];
  payouts: Payout[];
  summary: FinanceSummary;
  today: string;
  requestPayout: () => Payout | null;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { orders } = useOrders();
  const [requested, setRequested] = useState<Payout[]>([]);

  const base = useMemo(() => buildFinanceData(orders), [orders]);
  const today = useMemo(() => financeToday(orders), [orders]);

  const payouts = useMemo(() => [...requested, ...base.payouts], [requested, base.payouts]);

  const transactions = useMemo(() => {
    const extras = requested.map(payoutToTransaction);
    return [...extras, ...base.transactions].sort((a, b) => b.datetime.localeCompare(a.datetime));
  }, [requested, base.transactions]);

  const summary = useMemo<FinanceSummary>(() => {
    const requestedTotal = requested.reduce((s, p) => s + p.amount, 0);
    if (requestedTotal <= 0) return base.summary;
    return {
      ...base.summary,
      availableBalance: Math.max(0, base.summary.availableBalance - requestedTotal),
      nextPayout: Math.max(0, base.summary.nextPayout - requestedTotal),
      pendingPayout: Math.max(0, base.summary.pendingPayout + requestedTotal),
    };
  }, [base.summary, requested]);

  function requestPayout(): Payout | null {
    if (summary.availableBalance <= 0) return null;
    const payout: Payout = {
      id: `PO-2026-0${21 + requested.length}`,
      datetime: `${today}T12:00:00`,
      amount: summary.availableBalance,
      destination: "•••• 4821 · CreativeTreasury LLC",
      status: "pending",
      reference: "Manual request (demo)",
    };
    setRequested((prev) => [...prev, payout]);
    return payout;
  }

  return (
    <FinanceContext.Provider value={{ transactions, payouts, summary, today, requestPayout }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
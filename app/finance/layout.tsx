import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finance",
  description: "Balances, transactions, payouts, fees and refunds for CreativeTreasury.",
};

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
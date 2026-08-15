import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payouts",
  description: "Balances, payout history and scheduled payouts.",
};

export default function PayoutsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
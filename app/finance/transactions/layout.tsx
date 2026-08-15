import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
  description: "Search, filter and review every financial transaction.",
};

export default function TransactionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
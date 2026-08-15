import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaction · CreativeTreasury",
  description: "Transaction details, payments and timeline.",
};

export default function TransactionDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue",
  description: "Track your creator revenue and payouts",
};

export default function RevenueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
